/**
 * Risevana School / Foundation - Live CMS Hydration Engine
 * Dynamically binds CMS data to site DOM elements, ensuring instant reflection
 * of all text, logo, photo, and asset changes across all pages.
 */
(function initRisevanaCMS() {
  function applyCms(data) {
    if (!data || !data.branding) return;

    // 1. Branding & Logos
    if (data.branding.logoUrl) {
      document.querySelectorAll('img[src*="risevana-navbar-logo"], img[src*="logo_navbar"], img[alt*="risevana logo" i], [data-cms="navbar-logo"]').forEach(img => {
        img.src = data.branding.logoUrl;
      });
    }

    if (data.branding.logoCardUrl) {
      document.querySelectorAll('img[src*="logo_card"], [data-cms="card-logo"]').forEach(img => {
        img.src = data.branding.logoCardUrl;
      });
    }

    if (data.branding.faviconUrl) {
      document.querySelectorAll('link[rel*="icon"]').forEach(link => {
        link.href = data.branding.faviconUrl;
      });
    }

    // MoMo Donation Number & Phone across all pages
    if (data.branding.momoNumber) {
      // Find elements containing previous phone or label
      document.querySelectorAll('a[href*="250788749709"]').forEach(a => {
        a.href = 'tel:+' + data.branding.momoNumber.replace(/[^0-9]/g, '');
        a.textContent = data.branding.momoNumber;
      });

      // Walk text nodes for momo number replacement
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.includes('250788749709')) {
          node.nodeValue = node.nodeValue.replace(/250788749709/g, data.branding.momoNumber);
        }
      }
    }

    // 2. Global Asset Overrides
    if (data.assetOverrides && typeof data.assetOverrides === 'object') {
      for (const [orig, override] of Object.entries(data.assetOverrides)) {
        if (!orig || !override) continue;
        const cleanOrig = orig.split('?')[0];
        document.querySelectorAll(`img[src*="${cleanOrig}"]`).forEach(img => {
          img.src = override;
        });
        document.querySelectorAll(`source[srcset*="${cleanOrig}"]`).forEach(src => {
          src.srcset = override;
        });
      }
    }

    // Path check
    const path = window.location.pathname.toLowerCase();

    // 3. Home Page Hydration
    if (path === '/' || path === '/index' || path === '/index.html' || path === '') {
      hydrateHomePage(data);
    }

    // 4. Programs / Primary School Page Hydration
    if (path.includes('programs') || path.includes('primary-school')) {
      hydrateProgramsPage(data);
    }

    // 5. Teachers Page Hydration
    if (path.includes('teachers')) {
      hydrateTeachersPage(data);
    }

    // 6. Tuition / Donations Page Hydration
    if (path.includes('tuition') || path.includes('donations')) {
      hydrateDonationsPage(data);
    }

    // 7. About Page Hydration
    if (path.includes('about')) {
      hydrateAboutPage(data);
    }

    // 8. Contact / Open House Hydration
    if (path.includes('contact') || path.includes('open-house')) {
      hydrateContactPage(data);
    }

    // Check admin session and render admin quick badge
    checkAdminBadge();
  }

  function hydrateHomePage(data) {
    if (!data.home) return;

    // Hero title & subtitle
    const heroH1 = document.querySelector('#hero h1') || document.querySelector('h1');
    if (heroH1 && data.home.hero && data.home.hero.title) {
      heroH1.textContent = data.home.hero.title;
    }

    const heroSub = document.querySelector('#hero p') || document.querySelector('main p');
    if (heroSub && data.home.hero && data.home.hero.subtitle) {
      heroSub.textContent = data.home.hero.subtitle;
    }

    // Hero Background Photo
    if (data.home.hero && data.home.hero.bgImage) {
      const heroImgs = document.querySelectorAll('#hero img[src*="ecd"], #hero img[src*="hero"], #hero picture img');
      heroImgs.forEach(img => {
        img.src = data.home.hero.bgImage;
      });
      document.querySelectorAll('#hero picture source').forEach(source => {
        source.srcset = data.home.hero.bgImage;
      });
    }

    // Hero CTA
    if (data.home.hero && data.home.hero.ctaText) {
      const heroCta = document.querySelector('#hero a[data-hero-cta="true"], #hero a[href*="contact"], #hero a[href*="form"]');
      if (heroCta) {
        const span = heroCta.querySelector('span');
        if (span) span.textContent = data.home.hero.ctaText;
        if (data.home.hero.ctaLink) heroCta.href = data.home.hero.ctaLink;
      }
    }

    // Accreditations title
    if (data.home.accreditations && data.home.accreditations.title) {
      const accH2 = document.querySelector('h2');
      if (accH2 && accH2.textContent.toLowerCase().includes('accreditation')) {
        accH2.textContent = data.home.accreditations.title;
      }
    }

    // "This is for you if..." Cards
    if (data.home.thisIsForYou && data.home.thisIsForYou.cards) {
      const cards = document.querySelectorAll('#about [style*="border-radius:30px"], #about [style*="border-radius: 30px"]');
      cards.forEach((cardEl, idx) => {
        const cardData = data.home.thisIsForYou.cards[idx];
        if (!cardData) return;
        const p = cardEl.querySelector('p');
        if (p && cardData.title) p.textContent = cardData.title;
        const img = cardEl.querySelector('img');
        if (img && cardData.image) img.src = cardData.image;
        if (cardData.color) cardEl.style.backgroundColor = cardData.color;
      });
    }

    // Education feature cards
    if (data.home.education && data.home.education.cards) {
      const featH2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Transforming'));
      if (featH2 && data.home.education.title) {
        featH2.textContent = data.home.education.title;
      }
      const featCards = document.querySelectorAll('#education [class*="rounded-"]');
      featCards.forEach((cardEl, idx) => {
        const cData = data.home.education.cards[idx];
        if (!cData) return;
        const h3 = cardEl.querySelector('h3, h4, [class*="text-"]');
        if (h3 && cData.title) h3.textContent = cData.title;
        const img = cardEl.querySelector('img');
        if (img && cData.image) img.src = cData.image;
      });
    }

    // 100% Free School banner
    if (data.home.freeSchoolBanner) {
      const freeH2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('100% Free'));
      if (freeH2 && data.home.freeSchoolBanner.title) {
        freeH2.textContent = data.home.freeSchoolBanner.title;
      }
    }
  }

  function hydrateProgramsPage(data) {
    if (!data.programs) return;
    const h1 = document.querySelector('h1');
    if (h1 && data.programs.hero && data.programs.hero.title) {
      h1.textContent = data.programs.hero.title;
    }
    const sub = document.querySelector('h1 + p') || document.querySelector('main p');
    if (sub && data.programs.hero && data.programs.hero.subtitle) {
      sub.textContent = data.programs.hero.subtitle;
    }

    if (data.programs.list && Array.isArray(data.programs.list)) {
      const cards = document.querySelectorAll('.risevana-program-card, div:has(> img[src*="why-"]), article');
      cards.forEach((cardEl, idx) => {
        const item = data.programs.list[idx];
        if (!item) return;
        const heading = cardEl.querySelector('h3, h4, strong');
        if (heading && item.title) heading.textContent = item.title;
        const desc = cardEl.querySelector('p');
        if (desc && item.description) desc.textContent = item.description;
        const img = cardEl.querySelector('img');
        if (img && item.image) img.src = item.image;
      });
    }
  }

  function hydrateTeachersPage(data) {
    if (!data.teachers) return;
    const h1 = document.querySelector('h1');
    if (h1 && data.teachers.hero && data.teachers.hero.title) {
      h1.textContent = data.teachers.hero.title;
    }

    // Stats blocks
    if (data.teachers.stats && Array.isArray(data.teachers.stats)) {
      const statEls = document.querySelectorAll('astro-island[component-url*="TeachersStatsIsland"] section span, section[style*="background:#1B1B1B"] span[style*="font-size:clamp(3.5rem"]');
      statEls.forEach((span, idx) => {
        const stat = data.teachers.stats[idx];
        if (span && stat && stat.value) {
          span.textContent = stat.value;
        }
      });
    }

    // Teacher cards
    if (data.teachers.teachersList && Array.isArray(data.teachers.teachersList)) {
      const teacherCards = document.querySelectorAll('astro-island[component-url*="TeachersCarouselIsland"] article, article:has(img[src*="/teachers/"])');
      teacherCards.forEach((cardEl, idx) => {
        const t = data.teachers.teachersList[idx];
        if (!t) return;
        const nameEl = cardEl.querySelector('span.capitalize') || cardEl.querySelector('span[style*="font-weight:700"]');
        if (nameEl && t.name) nameEl.textContent = t.name;
        const descEl = cardEl.querySelector('p');
        if (descEl && t.experience) descEl.textContent = t.experience;
        const img = cardEl.querySelector('img');
        if (img && t.photo) img.src = t.photo;
        const tzEl = cardEl.querySelector('span:has(text*="Timezone")') || cardEl.querySelector('div span:last-child');
        if (tzEl && t.timezone) tzEl.textContent = `Timezone: ${t.timezone}`;
      });
    }
  }

  function hydrateDonationsPage(data) {
    if (!data.donations) return;
    const h1 = document.querySelector('h1');
    if (h1 && data.donations.hero && data.donations.hero.title) {
      h1.textContent = data.donations.hero.title;
    }
    const sub = document.querySelector('h1 + p') || document.querySelector('p');
    if (sub && data.donations.hero && data.donations.hero.subtitle) {
      sub.textContent = data.donations.hero.subtitle;
    }

    // MoMo merchant details
    if (data.donations.momo && data.donations.momo.number) {
      document.querySelectorAll('a[href*="tel:"]').forEach(a => {
        if (a.href.includes('250788749709') || a.textContent.includes('250788749709')) {
          a.textContent = data.donations.momo.number;
          a.href = 'tel:+' + data.donations.momo.number.replace(/[^0-9]/g, '');
        }
      });
    }
  }

  function hydrateAboutPage(data) {
    if (!data.about) return;
    const h1 = document.querySelector('h1');
    if (h1 && data.about.hero && data.about.hero.title) {
      h1.textContent = data.about.hero.title;
    }

    // Founder portrait & bio
    if (data.about.founder) {
      const founderImgs = document.querySelectorAll('img[src*="founder"], img[src*="noam"]');
      founderImgs.forEach(img => {
        if (data.about.founder.photo) img.src = data.about.founder.photo;
      });
      document.querySelectorAll('source[srcset*="founder"], source[srcset*="noam"]').forEach(s => {
        if (data.about.founder.photo) s.srcset = data.about.founder.photo;
      });
    }
  }

  function hydrateContactPage(data) {
    if (!data.contact) return;
    const h1 = document.querySelector('h1');
    if (h1 && data.contact.hero && data.contact.hero.title) {
      h1.textContent = data.contact.hero.title;
    }
  }

  /**
   * Check if current user is logged in as admin, and render a discreet floating quick pill
   */
  async function checkAdminBadge() {
    try {
      const token = localStorage.getItem('axel_admin_token');
      const headers = {};
      if (token) headers['Authorization'] = 'Bearer ' + token;
      const res = await fetch('/api/admin/check-auth', {
        headers,
        credentials: 'include'
      });
      const auth = await res.json();
      if (auth && auth.authenticated) {
        if (document.getElementById('risevana-admin-floating-pill')) return;

        const pill = document.createElement('div');
        pill.id = 'risevana-admin-floating-pill';
        pill.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999999;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(18, 18, 18, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(3, 236, 197, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
          padding: 8px 16px;
          border-radius: 9999px;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        `;
        pill.innerHTML = `
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#03ecc5;box-shadow:0 0 8px #03ecc5;"></span>
          <span style="color:#03ecc5;">Admin Active</span>
          <a href="/admin" style="background:#fcde2d;color:#000000;padding:4px 12px;border-radius:9999px;text-decoration:none;font-weight:700;font-size:12px;transition:opacity 0.2s;">
            Manage Site &rarr;
          </a>
        `;
        pill.addEventListener('mouseenter', () => { pill.style.transform = 'translateY(-2px)'; });
        pill.addEventListener('mouseleave', () => { pill.style.transform = 'translateY(0)'; });
        document.body.appendChild(pill);
      }
    } catch (_) {}
  }

  // Pre-load from localStorage cache if available for instant hydration
  try {
    const cachedCms = localStorage.getItem('risevana_cms_data');
    if (cachedCms) {
      const parsed = JSON.parse(cachedCms);
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyCms(parsed));
      } else {
        applyCms(parsed);
      }
    }
  } catch (_) {}

  // Hydrate from window or server
  if (window.__CMS_DATA__) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => applyCms(window.__CMS_DATA__));
    } else {
      applyCms(window.__CMS_DATA__);
    }
  } else {
    fetch('/api/cms-data')
      .then(r => r.json())
      .then(d => {
        window.__CMS_DATA__ = d;
        try { localStorage.setItem('risevana_cms_data', JSON.stringify(d)); } catch (_) {}
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => applyCms(d));
        } else {
          applyCms(d);
        }
      })
      .catch(() => {});
  }
})();
