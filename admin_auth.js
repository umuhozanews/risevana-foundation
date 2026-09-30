const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const IS_VERCEL = !!process.env.VERCEL;
const BASE_DIR = __dirname;
const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : path.join(BASE_DIR, 'data');
const CONFIG_PATH = path.join(DATA_DIR, 'admin_config.json');
const SESSIONS_PATH = path.join(DATA_DIR, 'sessions.json');

// Default initial credentials as requested by user
const DEFAULT_EMAIL = 'nextech@gmail.com';
const DEFAULT_PASSWORD = 'axel@12345';

// In-memory sessions store (vital for serverless & fast lookup)
const memorySessions = new Map();

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

  // Check bundled config first
  const bundledConfigPath = path.join(BASE_DIR, 'data', 'admin_config.json');
  if (fs.existsSync(bundledConfigPath)) {
    try {
      return JSON.parse(fs.readFileSync(bundledConfigPath, 'utf8'));
    } catch (_) {}
  }

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

function getSessions() {
  const sessions = Object.fromEntries(memorySessions.entries());
  if (fs.existsSync(SESSIONS_PATH)) {
    try {
      const fromDisk = JSON.parse(fs.readFileSync(SESSIONS_PATH, 'utf8'));
      Object.assign(sessions, fromDisk);
    } catch (_) {}
  }
  return sessions;
}

function saveSessions(sessions) {
  safeMkdir(DATA_DIR);
  for (const [k, v] of Object.entries(sessions)) {
    memorySessions.set(k, v);
  }
  try {
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2), 'utf8');
  } catch (_) {}
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

function createSession(email) {
  const sessions = getSessions();
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + (7 * 24 * 60 * 60 * 1000);

  for (const t of Object.keys(sessions)) {
    if (sessions[t].expiresAt < now) {
      delete sessions[t];
      memorySessions.delete(t);
    }
  }

  const sessionData = { email, createdAt: now, expiresAt };
  sessions[token] = sessionData;
  memorySessions.set(token, sessionData);

  saveSessions(sessions);
  return { token, expiresAt };
}

function validateSession(token) {
  if (!token) return false;
  if (memorySessions.has(token)) {
    const sess = memorySessions.get(token);
    if (sess.expiresAt > Date.now()) return sess;
    memorySessions.delete(token);
  }
  const sessions = getSessions();
  const session = sessions[token];
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    delete sessions[token];
    memorySessions.delete(token);
    saveSessions(sessions);
    return false;
  }
  memorySessions.set(token, session);
  return session;
}

function destroySession(token) {
  if (!token) return;
  memorySessions.delete(token);
  const sessions = getSessions();
  if (sessions[token]) {
    delete sessions[token];
    saveSessions(sessions);
  }
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
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const c of cookies) {
      if (c.startsWith('axel_admin_session=')) {
        return c.substring('axel_admin_session='.length).trim();
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
