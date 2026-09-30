const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'data', 'admin_config.json');
const SESSIONS_PATH = path.join(__dirname, 'data', 'sessions.json');

// Default initial credentials as requested
const DEFAULT_EMAIL = 'nextech@gmail.com';
const DEFAULT_PASSWORD = 'axel@12345';

function hashPassword(password, salt) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function initAdminConfig() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    const { hash, salt } = hashPassword(DEFAULT_PASSWORD);
    const config = {
      email: DEFAULT_EMAIL,
      passwordHash: hash,
      salt: salt,
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    return config;
  }

  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    const { hash, salt } = hashPassword(DEFAULT_PASSWORD);
    const config = {
      email: DEFAULT_EMAIL,
      passwordHash: hash,
      salt: salt,
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    return config;
  }
}

function getSessions() {
  if (!fs.existsSync(SESSIONS_PATH)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(SESSIONS_PATH, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveSessions(sessions) {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2), 'utf8');
}

function verifyCredentials(email, password) {
  const config = initAdminConfig();
  if (!email || !password) return false;
  if (email.trim().toLowerCase() !== config.email.trim().toLowerCase()) {
    return false;
  }

  const { hash } = hashPassword(password, config.salt);
  return hash === config.passwordHash;
}

function createSession(email) {
  const sessions = getSessions();
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  // Valid for 7 days
  const expiresAt = now + (7 * 24 * 60 * 60 * 1000);

  // Clean old expired sessions
  for (const t of Object.keys(sessions)) {
    if (sessions[t].expiresAt < now) {
      delete sessions[t];
    }
  }

  sessions[token] = {
    email,
    createdAt: now,
    expiresAt
  };

  saveSessions(sessions);
  return { token, expiresAt };
}

function validateSession(token) {
  if (!token) return false;
  const sessions = getSessions();
  const session = sessions[token];
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    delete sessions[token];
    saveSessions(sessions);
    return false;
  }
  return session;
}

function destroySession(token) {
  if (!token) return;
  const sessions = getSessions();
  if (sessions[token]) {
    delete sessions[token];
    saveSessions(sessions);
  }
}

function updatePassword(oldPassword, newPassword) {
  const config = initAdminConfig();
  const { hash } = hashPassword(oldPassword, config.salt);
  if (hash !== config.passwordHash) {
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
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  return { success: true };
}

function extractToken(req) {
  // Check Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check Cookie header
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
