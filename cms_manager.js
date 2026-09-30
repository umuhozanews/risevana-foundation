const fs = require('fs');
const path = require('path');

const IS_VERCEL = !!process.env.VERCEL;
const BASE_DIR = __dirname;
const PERSIST_DIR = IS_VERCEL ? path.join('/tmp', 'data') : path.join(BASE_DIR, 'data');
const BACKUPS_DIR = path.join(PERSIST_DIR, 'backups');
const CMS_DATA_PATH = path.join(PERSIST_DIR, 'cms_data.json');
const PUBLIC_DIR = path.join(BASE_DIR, 'public');
const UPLOADS_DIR = IS_VERCEL ? path.join('/tmp', 'uploads') : path.join(PUBLIC_DIR, 'uploads');

// In-memory cache
let inMemoryCmsData = null;

function safeMkdir(dir) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (_) {}
}

function ensureDirectories() {
  safeMkdir(PERSIST_DIR);
  safeMkdir(BACKUPS_DIR);
  safeMkdir(UPLOADS_DIR);
}

function getCmsData() {
  if (inMemoryCmsData) {
    return inMemoryCmsData;
  }

  ensureDirectories();

  // 1. Check runtime writable path (e.g. /tmp/data/cms_data.json)
  if (fs.existsSync(CMS_DATA_PATH)) {
    try {
      inMemoryCmsData = JSON.parse(fs.readFileSync(CMS_DATA_PATH, 'utf8'));
      return inMemoryCmsData;
    } catch (_) {}
  }

  // 2. Check bundled data directory
  const bundledPath = path.join(BASE_DIR, 'data', 'cms_data.json');
  if (fs.existsSync(bundledPath)) {
    try {
      inMemoryCmsData = JSON.parse(fs.readFileSync(bundledPath, 'utf8'));
      return inMemoryCmsData;
    } catch (_) {}
  }

  // 3. Check bundled defaults
  const defaultsPath = path.join(BASE_DIR, 'data', 'default_cms_data.json');
  if (fs.existsSync(defaultsPath)) {
    try {
      inMemoryCmsData = JSON.parse(fs.readFileSync(defaultsPath, 'utf8'));
      return inMemoryCmsData;
    } catch (_) {}
  }

  // 4. Fallback baseline data
  inMemoryCmsData = {
    branding: {
      schoolName: "Risevana Foundation",
      tagline: "Empowering Young Rural Minds in Rwanda",
      logoUrl: "/images/landing/logos/risevana-navbar-logo.svg",
      logoCardUrl: "/images/risevana/logo_card.png",
      faviconUrl: "/images/favicon.png?v=risevana",
      contactEmail: "nextech@gmail.com",
      contactPhone: "+250 788 749 709",
      momoNumber: "250788749709",
      momoAccountName: "Risevana Foundation",
      address: "Kigali & Rural Provinces, Rwanda",
      ctaButtonText: "Start your risevana journey",
      ctaButtonLink: "/contact"
    },
    home: {
      hero: {
        badge: "Online & Community School for Ages 4 to 15",
        title: "risevana",
        subtitle: "Risevana Foundation empowers young rural minds across Rwanda with early childhood education, daily nutrition, and digital learning outreach.",
        bgImage: "/images/landing/heroes/risevana-ecd-3.jpeg",
        ctaText: "Start your risevana journey",
        ctaLink: "/contact"
      }
    },
    assetOverrides: {}
  };

  return inMemoryCmsData;
}

function saveCmsData(newData) {
  ensureDirectories();
  newData.lastUpdated = new Date().toISOString();
  inMemoryCmsData = newData;

  try {
    if (fs.existsSync(CMS_DATA_PATH)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(BACKUPS_DIR, `cms_data_${timestamp}.json`);
      fs.copyFileSync(CMS_DATA_PATH, backupFile);
    }
  } catch (_) {}

  try {
    const tempPath = CMS_DATA_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(newData, null, 2), 'utf8');
    fs.renameSync(tempPath, CMS_DATA_PATH);
  } catch (_) {
    // If read-only or rename failed, attempt direct write
    try {
      fs.writeFileSync(CMS_DATA_PATH, JSON.stringify(newData, null, 2), 'utf8');
    } catch (_) {}
  }

  // Also update bundled file if not on Vercel
  if (!IS_VERCEL) {
    try {
      const localData = path.join(BASE_DIR, 'data', 'cms_data.json');
      fs.writeFileSync(localData, JSON.stringify(newData, null, 2), 'utf8');
    } catch (_) {}
  }

  return newData;
}

function resetCmsData() {
  const defaultsPath = path.join(BASE_DIR, 'data', 'default_cms_data.json');
  if (fs.existsSync(defaultsPath)) {
    try {
      const defaults = JSON.parse(fs.readFileSync(defaultsPath, 'utf8'));
      return saveCmsData(defaults);
    } catch (_) {}
  }
  inMemoryCmsData = null;
  return getCmsData();
}

function categorizeAsset(relPath) {
  const norm = relPath.toLowerCase().replace(/\\/g, '/');
  if (norm.includes('/uploads/')) return 'Uploads';
  if (norm.includes('logo') || norm.includes('favicon')) return 'Logos';
  if (norm.includes('/heroes/') || norm.includes('/hero/') || norm.includes('hero-')) return 'Hero & Banners';
  if (norm.includes('teachers') || norm.includes('/teachers/')) return 'Teachers';
  if (norm.includes('ecd') || norm.includes('classroom') || norm.includes('mobile_slide')) return 'School & Classrooms';
  if (norm.includes('programs') || norm.includes('primary-school') || norm.includes('middle-school') || norm.includes('education')) return 'Programs';
  if (norm.includes('tuition') || norm.includes('donations')) return 'Donations & Tuition';
  if (norm.includes('about')) return 'About Us';
  if (norm.includes('open-house') || norm.includes('contact')) return 'Contact & Visit';
  if (norm.includes('decorations') || norm.includes('decorative')) return 'Decorations';
  if (norm.includes('social')) return 'Social Icons';
  return 'Other';
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function listAssets(category = 'all', search = '', page = 1, pageSize = 80) {
  ensureDirectories();
  const results = [];
  const validExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif', '.ico']);

  function scanDir(dir, baseRel) {
    if (!fs.existsSync(dir)) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of entries) {
        const fullPath = path.join(dir, ent.name);
        const relPath = path.join(baseRel, ent.name).replace(/\\/g, '/');
        if (ent.isDirectory()) {
          scanDir(fullPath, relPath);
        } else if (ent.isFile()) {
          const ext = path.extname(ent.name).toLowerCase();
          if (validExts.has(ext)) {
            let stat = { size: 0, mtimeMs: Date.now() };
            try { stat = fs.statSync(fullPath); } catch (_) {}
            const cat = categorizeAsset(relPath);

            if (category !== 'all' && cat.toLowerCase() !== category.toLowerCase()) {
              continue;
            }

            if (search) {
              const q = search.toLowerCase();
              if (!ent.name.toLowerCase().includes(q) && !relPath.toLowerCase().includes(q)) {
                continue;
              }
            }

            results.push({
              name: ent.name,
              path: relPath.startsWith('/') ? relPath : '/' + relPath,
              category: cat,
              size: formatBytes(stat.size),
              rawSize: stat.size,
              ext: ext.replace('.', ''),
              mtime: stat.mtimeMs
            });
          }
        }
      }
    } catch (_) {}
  }

  // Scan uploads & public images
  scanDir(UPLOADS_DIR, 'uploads');
  scanDir(path.join(PUBLIC_DIR, 'images'), 'images');

  results.sort((a, b) => {
    if (a.category === 'Uploads' && b.category !== 'Uploads') return -1;
    if (b.category === 'Uploads' && a.category !== 'Uploads') return 1;
    return b.mtime - a.mtime;
  });

  const total = results.length;
  const start = (page - 1) * pageSize;
  const pagedItems = results.slice(start, start + pageSize);

  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
    items: pagedItems
  };
}

function saveUpload(filename, base64Data) {
  ensureDirectories();
  let cleanData = base64Data;
  if (cleanData.includes(';base64,')) {
    cleanData = cleanData.split(';base64,')[1];
  }

  const buffer = Buffer.from(cleanData, 'base64');
  const ext = path.extname(filename).toLowerCase() || '.png';
  const safeName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const finalFilename = `${safeName}_${Date.now()}${ext}`;
  const targetPath = path.join(UPLOADS_DIR, finalFilename);

  try {
    fs.writeFileSync(targetPath, buffer);
  } catch (_) {}

  const webPath = `/uploads/${finalFilename}`;
  return {
    success: true,
    url: webPath,
    filename: finalFilename,
    size: formatBytes(buffer.length)
  };
}

function replaceAsset(targetRelPath, base64Data) {
  ensureDirectories();
  let cleanData = base64Data;
  if (cleanData.includes(';base64,')) {
    cleanData = cleanData.split(';base64,')[1];
  }
  const buffer = Buffer.from(cleanData, 'base64');

  let normPath = targetRelPath.replace(/\\/g, '/');
  if (normPath.startsWith('/')) normPath = normPath.slice(1);

  const fullTarget = path.resolve(PUBLIC_DIR, normPath);

  try {
    if (fs.existsSync(fullTarget)) {
      const base = path.basename(fullTarget);
      const backupPath = path.join(BACKUPS_DIR, `${Date.now()}_${base}`);
      fs.copyFileSync(fullTarget, backupPath);
    } else {
      safeMkdir(path.dirname(fullTarget));
    }
    fs.writeFileSync(fullTarget, buffer);
  } catch (_) {}

  // Record override for dynamic client/server substitution
  const cmsData = getCmsData();
  if (!cmsData.assetOverrides) cmsData.assetOverrides = {};
  const webTarget = '/' + normPath;
  cmsData.assetOverrides[webTarget] = webTarget + '?v=' + Date.now();
  saveCmsData(cmsData);

  return {
    success: true,
    path: webTarget,
    size: formatBytes(buffer.length)
  };
}

function processHtml(html, reqPath) {
  const cmsData = getCmsData();
  if (!cmsData || !cmsData.branding) return html;

  let result = html;

  if (cmsData.branding.faviconUrl) {
    result = result.replace(
      /(<link\s+[^>]*rel=["']icon["'][^>]*href=["'])([^"']+)(["'][^>]*>)/gi,
      `$1${cmsData.branding.faviconUrl}$3`
    );
  }

  if (cmsData.branding.logoUrl) {
    result = result.replace(
      /\/images\/landing\/logos\/risevana-navbar-logo\.svg/g,
      cmsData.branding.logoUrl
    );
  }

  if (cmsData.branding.logoCardUrl) {
    result = result.replace(
      /\/images\/risevana\/logo_card\.png/g,
      cmsData.branding.logoCardUrl
    );
  }

  if (cmsData.branding.momoNumber) {
    result = result.replace(/250788749709/g, cmsData.branding.momoNumber);
  }

  if (cmsData.assetOverrides && Object.keys(cmsData.assetOverrides).length > 0) {
    for (const [orig, override] of Object.entries(cmsData.assetOverrides)) {
      if (orig && override) {
        const cleanOrig = orig.split('?')[0];
        result = result.split(cleanOrig).join(override);
      }
    }
  }

  const injection = `
    <!-- Risevana Managed CMS Dynamic State & Client Engine -->
    <script id="risevana-cms-state">
      window.__CMS_DATA__ = ${JSON.stringify(cmsData)};
    </script>
    <script defer src="/cms-client.js?v=${Date.now()}"></script>
  `;

  if (result.includes('</head>')) {
    result = result.replace('</head>', injection + '\n</head>');
  } else {
    result = injection + result;
  }

  return result;
}

module.exports = {
  getCmsData,
  saveCmsData,
  resetCmsData,
  listAssets,
  saveUpload,
  replaceAsset,
  processHtml,
  PERSIST_DIR,
  PUBLIC_DIR,
  UPLOADS_DIR
};
