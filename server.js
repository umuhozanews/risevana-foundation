const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const url = require('url');

const adminAuth = require('./admin_auth');
const cmsManager = require('./cms_manager');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(__dirname, 'public');
const REMOTE_ORIGIN = 'https://thebinaschool.com';

// Ensure data and admin credentials initialized
adminAuth.initAdminConfig();
cmsManager.getCmsData();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon'
};

const ROUTE_MAP = {
  '/': 'index.html',
  '/index': 'index.html',
  '/index.html': 'index.html',
  '/teachers': 'teachers.html',
  '/teachers.html': 'teachers.html',
  '/primary-school': 'primary-school.html',
  '/primary-school.html': 'primary-school.html',
  '/middle-school': 'middle-school.html',
  '/middle-school.html': 'middle-school.html',
  '/about': 'about.html',
  '/about.html': 'about.html',
  '/admissions': 'admissions.html',
  '/admissions.html': 'admissions.html',
  '/tuition': 'tuition.html',
  '/tuition.html': 'tuition.html',
  '/open-house': 'open-house.html',
  '/open-house.html': 'open-house.html',
  '/programs': 'primary-school.html',
  '/programs.html': 'primary-school.html',
  '/contact': 'open-house.html',
  '/contact.html': 'open-house.html',
  '/donations': 'tuition.html',
  '/donations.html': 'tuition.html',
  '/app.js': 'public/app.js',
  '/cms-client.js': 'public/cms-client.js'
};

function getLocalFilePath(pathname) {
  if (ROUTE_MAP[pathname]) {
    const target = ROUTE_MAP[pathname];
    return target.startsWith('public') ? path.join(ROOT_DIR, target) : path.join(ROOT_DIR, target);
  }
  if (pathname.startsWith('/public/')) {
    return path.join(ROOT_DIR, pathname);
  }
  if (pathname.startsWith('/uploads/')) {
    return path.join(PUBLIC_DIR, pathname);
  }
  if (pathname.startsWith('/fonts/') || pathname.startsWith('/_astro/') || pathname.startsWith('/images/') || pathname.startsWith('/videos/')) {
    return path.join(PUBLIC_DIR, pathname);
  }
  return null;
}

function parseJsonBody(req, limit = 25 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) {
        req.destroy();
        reject(new Error('Payload exceeds 25MB limit'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const bodyStr = Buffer.concat(chunks).toString('utf8');
        resolve(bodyStr ? JSON.parse(bodyStr) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data, headers = {}) {
  const jsonStr = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    ...headers
  });
  res.end(jsonStr);
}

function proxyAndCache(remoteUrl, localPath, res) {
  const parsed = new URL(remoteUrl);
  const options = {
    hostname: parsed.hostname,
    port: 443,
    path: parsed.pathname + parsed.search,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  const reqRemote = https.get(options, (remoteRes) => {
    if (remoteRes.statusCode === 200) {
      const contentType = remoteRes.headers['content-type'] || 'application/octet-stream';
      if (!res.headersSent) {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000'
        });
      }

      const chunks = [];
      remoteRes.on('data', (chunk) => {
        chunks.push(chunk);
        res.write(chunk);
      });

      remoteRes.on('end', () => {
        res.end();
        const buffer = Buffer.concat(chunks);
        fs.mkdir(path.dirname(localPath), { recursive: true }, (err) => {
          if (!err) {
            fs.writeFile(localPath, buffer, () => {});
          }
        });
      });
    } else {
      if (remoteUrl.match(/\.(png|jpg|jpeg|webp|avif|gif)$/i)) {
        const transparentPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=', 'base64');
        if (!res.headersSent) {
          res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
          res.end(transparentPng);
        }
      } else {
        if (!res.headersSent) {
          res.writeHead(remoteRes.statusCode, { 'Content-Type': 'text/plain' });
          res.end(`Not Found: ${remoteRes.statusCode}`);
        }
      }
    }
  });

  reqRemote.setTimeout(8000, () => {
    reqRemote.destroy();
    if (!res.headersSent) {
      if (remoteUrl.match(/\.(png|jpg|jpeg|webp|avif|gif)$/i)) {
        const transparentPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=', 'base64');
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(transparentPng);
      } else {
        res.writeHead(504, { 'Content-Type': 'text/plain' });
        res.end('Gateway Timeout');
      }
    }
  });

  reqRemote.on('error', (err) => {
    console.error(`Proxy error for ${remoteUrl}:`, err.message);
    if (!res.headersSent) {
      if (remoteUrl.match(/\.(png|jpg|jpeg|webp|avif|gif)$/i)) {
        const transparentPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=', 'base64');
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(transparentPng);
      } else {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway');
      }
    }
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize trailing slash (except root)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // ==========================================
  // 1. API: AUTHENTICATION ROUTES
  // ==========================================
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendJson(res, 400, { success: false, error: 'Email and password are required' });
      }

      if (adminAuth.verifyCredentials(email, password)) {
        const session = adminAuth.createSession(email);
        const cookieHeader = `axel_admin_session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
        return sendJson(res, 200, {
          success: true,
          token: session.token,
          email: email
        }, { 'Set-Cookie': cookieHeader });
      } else {
        return sendJson(res, 401, { success: false, error: 'Invalid email or password' });
      }
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    if (token) adminAuth.destroySession(token);
    const clearCookie = `axel_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`;
    return sendJson(res, 200, { success: true }, { 'Set-Cookie': clearCookie });
  }

  if (pathname === '/api/admin/check-auth' && req.method === 'GET') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    return sendJson(res, 200, {
      authenticated: !!session,
      email: session ? session.email : null
    });
  }

  if (pathname === '/api/admin/change-password' && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (!session) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized: login required' });
    }
    try {
      const { oldPassword, newPassword } = await parseJsonBody(req);
      const result = adminAuth.updatePassword(oldPassword, newPassword);
      return sendJson(res, result.success ? 200 : 400, result);
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================
  // 2. API: CMS DATA ROUTES
  // ==========================================
  if (pathname === '/api/cms-data') {
    if (req.method === 'GET') {
      const data = cmsManager.getCmsData();
      return sendJson(res, 200, data);
    }
    if (req.method === 'POST') {
      const token = adminAuth.extractToken(req);
      const session = adminAuth.validateSession(token);
      if (!session) {
        return sendJson(res, 401, { success: false, error: 'Unauthorized: login required to save CMS data' });
      }
      try {
        const body = await parseJsonBody(req);
        const saved = cmsManager.saveCmsData(body);
        return sendJson(res, 200, { success: true, data: saved });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }
  }

  if (pathname === '/api/cms/reset' && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (!session) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized: login required' });
    }
    try {
      const resetData = cmsManager.resetCmsData();
      return sendJson(res, 200, { success: true, data: resetData });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================
  // 3. API: ASSET MANAGER ROUTES
  // ==========================================
  if (pathname === '/api/assets/list' && req.method === 'GET') {
    const category = parsedUrl.searchParams.get('category') || 'all';
    const search = parsedUrl.searchParams.get('search') || '';
    const page = parseInt(parsedUrl.searchParams.get('page')) || 1;
    const pageSize = parseInt(parsedUrl.searchParams.get('pageSize')) || 60;
    const list = cmsManager.listAssets(category, search, page, pageSize);
    return sendJson(res, 200, list);
  }

  if (pathname === '/api/assets/upload' && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (!session) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized: login required' });
    }
    try {
      const { filename, base64Data } = await parseJsonBody(req);
      if (!filename || !base64Data) {
        return sendJson(res, 400, { success: false, error: 'filename and base64Data required' });
      }
      const uploaded = cmsManager.saveUpload(filename, base64Data);
      return sendJson(res, 200, uploaded);
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  if (pathname === '/api/assets/replace' && req.method === 'POST') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (!session) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized: login required' });
    }
    try {
      const { targetPath, base64Data } = await parseJsonBody(req);
      if (!targetPath || !base64Data) {
        return sendJson(res, 400, { success: false, error: 'targetPath and base64Data required' });
      }
      const replaced = cmsManager.replaceAsset(targetPath, base64Data);
      return sendJson(res, 200, replaced);
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================
  // 4. ADMIN FRONTEND ROUTES
  // ==========================================
  if (pathname === '/admin/login' || pathname === '/admin/login.html') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (session) {
      res.writeHead(302, { 'Location': '/admin' });
      res.end();
      return;
    }
    const loginHtml = path.join(PUBLIC_DIR, 'admin', 'login.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    fs.createReadStream(loginHtml).pipe(res);
    return;
  }

  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/index.html') {
    const token = adminAuth.extractToken(req);
    const session = adminAuth.validateSession(token);
    if (!session) {
      res.writeHead(302, { 'Location': '/admin/login' });
      res.end();
      return;
    }
    const adminHtml = path.join(PUBLIC_DIR, 'admin', 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    fs.createReadStream(adminHtml).pipe(res);
    return;
  }

  // ==========================================
  // 5. PUBLIC WEBSITE STATIC & HTML ROUTES
  // ==========================================
  const localPath = getLocalFilePath(pathname);

  if (localPath && fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
    const ext = path.extname(localPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // If HTML file, process through CMS Engine to inject latest words, logos, assets, and scripts
    if (ext === '.html') {
      try {
        let htmlContent = fs.readFileSync(localPath, 'utf8');
        htmlContent = cmsManager.processHtml(htmlContent, pathname);
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(htmlContent);
        return;
      } catch (err) {
        console.error('Error processing HTML:', err);
      }
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.js' || ext === '.css' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400'
    });
    fs.createReadStream(localPath).pipe(res);
    return;
  }

  // Proxy missing assets to remote origin
  if (pathname.startsWith('/images/') || pathname.startsWith('/fonts/') || pathname.startsWith('/_astro/') || pathname.startsWith('/videos/')) {
    const targetLocal = path.join(PUBLIC_DIR, pathname);
    const remoteUrl = REMOTE_ORIGIN + pathname;
    proxyAndCache(remoteUrl, targetLocal, res);
    return;
  }

  // 404 fallback
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head><title>404 - Not Found</title></head>
      <body style="font-family: sans-serif; background: #0d0f12; color: #fff; text-align: center; padding: 100px 20px;">
        <h1 style="color: #03ecc5; font-size: 3rem; margin-bottom: 1rem;">Page Not Found</h1>
        <p style="font-size: 1.25rem; color: #94a3b8;">The requested page <code>${pathname}</code> was not found.</p>
        <p style="margin-top: 2rem;">
          <a href="/" style="color: #fcde2d; font-size: 1.25rem; text-decoration: none; margin-right: 1.5rem;">Return Home</a>
          <a href="/admin" style="color: #03ecc5; font-size: 1.25rem; text-decoration: none;">Admin Dashboard</a>
        </p>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  RISEVANA SCHOOL CMS SERVER RUNNING`);
  console.log(`  Local URL:        http://localhost:${PORT}`);
  console.log(`  Admin CMS Portal: http://localhost:${PORT}/admin`);
  console.log(`  Admin Login:      http://localhost:${PORT}/admin/login`);
  console.log(`  Admin Email:      nextech@gmail.com`);
  console.log(`  Admin Password:   axel@12345`);
  console.log(`------------------------------------------------------`);
  console.log(`  Public Pages:`);
  console.log(`    - Home:           http://localhost:${PORT}/`);
  console.log(`    - Our Programs:   http://localhost:${PORT}/programs`);
  console.log(`    - Our Teachers:   http://localhost:${PORT}/teachers`);
  console.log(`    - Donations/MoMo: http://localhost:${PORT}/donations`);
  console.log(`    - About Us:       http://localhost:${PORT}/about`);
  console.log(`    - Contact:        http://localhost:${PORT}/contact`);
  console.log(`======================================================\n`);
});

module.exports = server;
