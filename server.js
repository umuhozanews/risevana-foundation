const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(__dirname, 'public');
const REMOTE_ORIGIN = 'https://thebinaschool.com';

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
  '/app.js': 'public/app.js'
};

function getLocalFilePath(pathname) {
  if (ROUTE_MAP[pathname]) {
    const target = ROUTE_MAP[pathname];
    return target.startsWith('public') ? path.join(ROOT_DIR, target) : path.join(ROOT_DIR, target);
  }
  if (pathname.startsWith('/public/')) {
    return path.join(ROOT_DIR, pathname);
  }
  if (pathname.startsWith('/fonts/') || pathname.startsWith('/_astro/') || pathname.startsWith('/images/') || pathname.startsWith('/videos/')) {
    return path.join(PUBLIC_DIR, pathname);
  }
  return null;
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
      // If image not found, return 1x1 transparent PNG fallback
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

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize trailing slash (except root)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Check if route or local file exists
  const localPath = getLocalFilePath(pathname);

  if (localPath && fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
    const ext = path.extname(localPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    fs.createReadStream(localPath).pipe(res);
    return;
  }

  // If requesting asset under /images/ or /fonts/ or /_astro/ that wasn't found locally, proxy & cache
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
      <body style="font-family: sans-serif; background: #000; color: #fff; text-align: center; padding: 100px 20px;">
        <h1 style="color: #03ecc5; font-size: 3rem;">Page Not Found</h1>
        <p style="font-size: 1.25rem;">The requested page <code>${pathname}</code> was not found.</p>
        <p style="margin-top: 2rem;"><a href="/" style="color: #fcde2d; font-size: 1.25rem;">Return Home</a></p>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  RISEVANA SCHOOL SERVER RUNNING`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Pages Available:`);
  console.log(`    - Home:           http://localhost:${PORT}/`);
  console.log(`    - Our Teachers:   http://localhost:${PORT}/teachers`);
  console.log(`    - Primary School: http://localhost:${PORT}/primary-school`);
  console.log(`    - Middle School:  http://localhost:${PORT}/middle-school`);
  console.log(`    - About Us:       http://localhost:${PORT}/about`);
  console.log(`    - Admissions:     http://localhost:${PORT}/admissions`);
  console.log(`    - Tuition:        http://localhost:${PORT}/tuition`);
  console.log(`    - Open House:     http://localhost:${PORT}/open-house`);
  console.log(`======================================================\n`);
});
