const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const CMS_DATA_PATH = path.join(DATA_DIR, 'cms_data.json');
const CMS_DEFAULTS_PATH = path.join(DATA_DIR, 'default_cms_data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function getCmsData() {
  ensureDirectories();
  if (fs.existsSync(CMS_DATA_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CMS_DATA_PATH, 'utf8'));
    } catch (e) {
      console.error('Error reading cms_data.json:', e);
    }
  }

  if (fs.existsSync(CMS_DEFAULTS_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(CMS_DEFAULTS_PATH, 'utf8'));
      fs.writeFileSync(CMS_DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
      return data;
    } catch (e) {
      console.error('Error reading default_cms_data.json:', e);
    }
  }

  return {};
}

function saveCmsData(newData) {
  ensureDirectories();
  newData.lastUpdated = new Date().toISOString();

  // Create an automatic backup of the previous data
  if (fs.existsSync(CMS_DATA_PATH)) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(BACKUPS_DIR, `cms_data_${timestamp}.json`);
      fs.copyFileSync(CMS_DATA_PATH, backupFile);

      // Keep only last 15 backups
      const allBackups = fs.readdirSync(BACKUPS_DIR)
        .filter(f => f.startsWith('cms_data_') && f.endsWith('.json'))
        .sort()
        .reverse();

      if (allBackups.length > 15) {
        allBackups.slice(15).forEach(oldFile => {
          try { fs.unlinkSync(path.join(BACKUPS_DIR, oldFile)); } catch (_) {}
        });
      }
    } catch (err) {
      console.warn('Backup creation failed:', err.message);
    }
  }

  // Write atomically
  const tempPath = CMS_DATA_PATH + '.tmp';
  fs.writeFileSync(tempPath, JSON.stringify(newData, null, 2), 'utf8');
  fs.renameSync(tempPath, CMS_DATA_PATH);

  return newData;
}

function resetCmsData() {
  ensureDirectories();
  if (fs.existsSync(CMS_DEFAULTS_PATH)) {
    const defaults = JSON.parse(fs.readFileSync(CMS_DEFAULTS_PATH, 'utf8'));
    return saveCmsData(defaults);
  }
  throw new Error('Default CMS data not found');
}

/**
 * Categorize a file based on its relative path
 */
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
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Scan assets in public/images and public/uploads
 */
function listAssets(category = 'all', search = '', page = 1, pageSize = 80) {
  ensureDirectories();
  const results = [];
  const validExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif', '.ico']);

  function scanDir(dir, baseRel) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      const relPath = path.join(baseRel, ent.name).replace(/\\/g, '/');
      if (ent.isDirectory()) {
        scanDir(fullPath, relPath);
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (validExts.has(ext)) {
          let stat;
          try { stat = fs.statSync(fullPath); } catch (_) { continue; }
          const cat = categorizeAsset(relPath);

          // Filtering
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
  }

  // Scan uploads first (so newest uploads appear first)
  scanDir(UPLOADS_DIR, 'uploads');
  scanDir(path.join(PUBLIC_DIR, 'images'), 'images');

  // Sort: Uploads first, then recently modified
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
    totalPages: Math.ceil(total / pageSize),
    items: pagedItems
  };
}

/**
 * Save new uploaded file
 */
function saveUpload(filename, base64Data) {
  ensureDirectories();
  // Strip data:image/...;base64, prefix if present
  let cleanData = base64Data;
  if (cleanData.includes(';base64,')) {
    cleanData = cleanData.split(';base64,')[1];
  }

  const buffer = Buffer.from(cleanData, 'base64');
  const ext = path.extname(filename).toLowerCase() || '.png';
  const safeName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const finalFilename = `${safeName}_${timestamp}${ext}`;
  const targetPath = path.join(UPLOADS_DIR, finalFilename);

  fs.writeFileSync(targetPath, buffer);
  const webPath = `/uploads/${finalFilename}`;

  return {
    success: true,
    url: webPath,
    filename: finalFilename,
    size: formatBytes(buffer.length)
  };
}

/**
 * Replace existing asset in place
 */
function replaceAsset(targetRelPath, base64Data) {
  ensureDirectories();
  let cleanData = base64Data;
  if (cleanData.includes(';base64,')) {
    cleanData = cleanData.split(';base64,')[1];
  }
  const buffer = Buffer.from(cleanData, 'base64');

  // Normalize path
  let normPath = targetRelPath.replace(/\\/g, '/');
  if (normPath.startsWith('/')) normPath = normPath.slice(1);

  // Security check: ensure path is within public/
  const fullTarget = path.resolve(PUBLIC_DIR, normPath);
  if (!fullTarget.startsWith(PUBLIC_DIR)) {
    throw new Error('Access denied: target path is outside public directory');
  }

  // Create backup of old file if it exists
  if (fs.existsSync(fullTarget)) {
    try {
      const base = path.basename(fullTarget);
      const backupPath = path.join(BACKUPS_DIR, `${Date.now()}_${base}`);
      fs.copyFileSync(fullTarget, backupPath);
    } catch (err) {
      console.warn('Could not backup old asset:', err.message);
    }
  } else {
    fs.mkdirSync(path.dirname(fullTarget), { recursive: true });
  }

  // Write new file
  fs.writeFileSync(fullTarget, buffer);

  // Also record in cms_data.json assetOverrides for dynamic resolution & cache busting
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

/**
 * Server-side HTML Processor: Injects CMS values directly into served HTML strings
 */
function processHtml(html, reqPath) {
  const cmsData = getCmsData();
  if (!cmsData || !cmsData.branding) return html;

  let result = html;

  // 1. Favicon override
  if (cmsData.branding.faviconUrl) {
    result = result.replace(
      /(<link\s+[^>]*rel=["']icon["'][^>]*href=["'])([^"']+)(["'][^>]*>)/gi,
      `$1${cmsData.branding.faviconUrl}$3`
    );
  }

  // 2. Primary Navbar Logo replacement
  if (cmsData.branding.logoUrl) {
    result = result.replace(
      /\/images\/landing\/logos\/risevana-navbar-logo\.svg/g,
      cmsData.branding.logoUrl
    );
  }

  // 3. Card Logo replacement
  if (cmsData.branding.logoCardUrl) {
    result = result.replace(
      /\/images\/risevana\/logo_card\.png/g,
      cmsData.branding.logoCardUrl
    );
  }

  // 4. MoMo number replacement
  if (cmsData.branding.momoNumber) {
    result = result.replace(/250788749709/g, cmsData.branding.momoNumber);
  }

  // 5. Asset Overrides
  if (cmsData.assetOverrides && Object.keys(cmsData.assetOverrides).length > 0) {
    for (const [orig, override] of Object.entries(cmsData.assetOverrides)) {
      if (orig && override) {
        const cleanOrig = orig.split('?')[0];
        result = result.split(cleanOrig).join(override);
      }
    }
  }

  // 6. Inject client CMS script and state before </head>
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
  DATA_DIR,
  PUBLIC_DIR,
  UPLOADS_DIR
};
