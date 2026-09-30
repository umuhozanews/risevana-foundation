const url = require('url');
const adminAuth = require('../admin_auth');
const cmsManager = require('../cms_manager');

function sendJson(res, statusCode, data, headers = {}) {
  const jsonStr = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    ...headers
  });
  res.end(jsonStr);
}

async function getBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch (_) { return {}; }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch (_) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async function handler(req, res) {
  const parsedUrl = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize /api/...
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // 1. Auth: Login
  if (pathname.endsWith('/admin/login') && req.method === 'POST') {
    try {
      const body = await getBody(req);
      const { email, password } = body;
      if (!email || !password) {
        return sendJson(res, 400, { success: false, error: 'Email and password required' });
      }
      if (adminAuth.verifyCredentials(email, password)) {
        const session = adminAuth.createSession(email);
        const cookieHeader = `axel_admin_session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
        return sendJson(res, 200, { success: true, token: session.token, email }, { 'Set-Cookie': cookieHeader });
      } else {
        return sendJson(res, 401, { success: false, error: 'Invalid email or password' });
      }
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // 2. Auth: Logout
  if (pathname.endsWith('/admin/logout') && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    if (token) adminAuth.destroySession(token);
    const clearCookie = `axel_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`;
    return sendJson(res, 200, { success: true }, { 'Set-Cookie': clearCookie });
  }

  // 3. Auth: Check
  if (pathname.endsWith('/admin/check-auth') && req.method === 'GET') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    return sendJson(res, 200, { authenticated: !!session, email: session ? session.email : null });
  }

  // 4. Auth: Change Password
  if (pathname.endsWith('/admin/change-password') && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (!session) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
    try {
      const { oldPassword, newPassword } = await getBody(req);
      const result = adminAuth.updatePassword(oldPassword, newPassword);
      return sendJson(res, result.success ? 200 : 400, result);
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // 5. CMS Data
  if (pathname.endsWith('/cms-data')) {
    if (req.method === 'GET') {
      const data = cmsManager.getCmsData();
      return sendJson(res, 200, data);
    }
    if (req.method === 'POST') {
      const token = adminAuth.extractToken(req);
      const session = adminAuth.validateSession(token);
      if (!session) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
      try {
        const body = await getBody(req);
        const saved = cmsManager.saveCmsData(body);
        return sendJson(res, 200, { success: true, data: saved });
      } catch (e) {
        return sendJson(res, 500, { success: false, error: e.message });
      }
    }
  }

  // 6. Reset Defaults
  if (pathname.endsWith('/cms/reset') && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (!session) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
    try {
      const resetData = cmsManager.resetCmsData();
      return sendJson(res, 200, { success: true, data: resetData });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // 7. Assets List
  if (pathname.endsWith('/assets/list') && req.method === 'GET') {
    const category = parsedUrl.searchParams.get('category') || 'all';
    const search = parsedUrl.searchParams.get('search') || '';
    const page = parseInt(parsedUrl.searchParams.get('page')) || 1;
    const pageSize = parseInt(parsedUrl.searchParams.get('pageSize')) || 60;
    const list = cmsManager.listAssets(category, search, page, pageSize);
    return sendJson(res, 200, list);
  }

  // 8. Asset Upload
  if (pathname.endsWith('/assets/upload') && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (!session) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
    try {
      const { filename, base64Data } = await getBody(req);
      const uploaded = cmsManager.saveUpload(filename, base64Data);
      return sendJson(res, 200, uploaded);
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // 9. Asset Replace
  if (pathname.endsWith('/assets/replace') && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (!session) return sendJson(res, 401, { success: false, error: 'Unauthorized' });
    try {
      const { targetPath, base64Data } = await getBody(req);
      const replaced = cmsManager.replaceAsset(targetPath, base64Data);
      return sendJson(res, 200, replaced);
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // Fallback 404
  return sendJson(res, 404, { error: 'API route not found' });
};
