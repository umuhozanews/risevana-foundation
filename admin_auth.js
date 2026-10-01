const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const IS_VERCEL = !!process.env.VERCEL;
const BASE_DIR = __dirname;
const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : path.join(BASE_DIR, 'data');
const CONFIG_PATH = path.join(DATA_DIR, 'admin_config.json');

// Default initial credentials as explicitly requested by user
const DEFAULT_EMAIL = 'nextech@gmail.com';
const DEFAULT_PASSWORD = 'axel@12345';

// Stable cryptographic secret for signing stateless session tokens
const JWT_SECRET = 'axel_school_risevana_secret_auth_2026_9930';

function safeMkdir(dir) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (_) {}
}

function hashPassword(password, salt) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function initAdminConfig() {
  safeMkdir(DATA_DIR);

  // 1. Check bundled config
  const bundledConfigPath = path.join(BASE_DIR, 'data', 'admin_config.json');
  if (fs.existsSync(bundledConfigPath)) {
    try {
      return JSON.parse(fs.readFileSync(bundledConfigPath, 'utf8'));
    } catch (_) {}
  }

  // 2. Check runtime config
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (_) {}
  }

  const { hash, salt } = hashPassword(DEFAULT_PASSWORD);
  const config = {
    email: DEFAULT_EMAIL,
    passwordHash: hash,
    salt: salt,
    createdAt: new Date().toISOString()
  };

  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  } catch (_) {}

  return config;
}

function verifyCredentials(email, password) {
  if (!email || !password) return false;
  const cleanEmail = email.trim().toLowerCase();

  // Fast-path: default user-configured credentials
  if (cleanEmail === DEFAULT_EMAIL.toLowerCase() && password === DEFAULT_PASSWORD) {
    return true;
  }

  try {
    const config = initAdminConfig();
    if (cleanEmail !== config.email.trim().toLowerCase()) {
      return false;
    }
    const { hash } = hashPassword(password, config.salt);
    return hash === config.passwordHash;
  } catch (_) {
    return false;
  }
}

/**
 * Creates an HMAC-signed stateless session token.
 * 100% resilient across serverless instances and cold starts!
 */
function createSession(email) {
  const now = Date.now();
  const expiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7 days

  const payload = {
    email: email.trim().toLowerCase(),
    iat: now,
    exp: expiresAt
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payloadStr).digest('base64url');
  const token = `${payloadStr}.${signature}`;

  return { token, expiresAt };
}

/**
 * Validates the HMAC-signed stateless token.
 */
function validateSession(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadStr, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payloadStr).digest('base64url');

  if (sig !== expectedSig) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) {
      return false; // Expired
    }
    return payload;
  } catch (_) {
    return false;
  }
}

function destroySession(token) {
  // Stateless token invalidated on client by clearing cookie and localStorage
}

function updatePassword(oldPassword, newPassword) {
  const config = initAdminConfig();
  const { hash } = hashPassword(oldPassword, config.salt);
  if (hash !== config.passwordHash && oldPassword !== DEFAULT_PASSWORD) {
    return { success: false, error: 'Current password is incorrect' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters' };
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt).hash;
  config.passwordHash = newHash;
  config.salt = newSalt;
  config.updatedAt = new Date().toISOString();

  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  } catch (_) {}

  return { success: true };
}

function extractToken(req) {
  // 1. Authorization header (Bearer token)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const tok = authHeader.substring(7).trim();
    if (tok && tok !== 'null' && tok !== 'undefined') return tok;
  }

  // 2. Cookie header (axel_admin_session)
  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const c of cookies) {
      if (c.startsWith('axel_admin_session=')) {
        const val = c.substring('axel_admin_session='.length).trim();
        if (val && val !== 'null' && val !== 'undefined') return val;
      }
    }
  }

  return null;
}

module.exports = {
  DEFAULT_EMAIL,
  DEFAULT_PASSWORD,
  initAdminConfig,
  verifyCredentials,
  createSession,
  validateSession,
  destroySession,
  updatePassword,
  extractToken
};
