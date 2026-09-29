// Risevana School Interactive Enhancement Script
document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordions();
  initMobileNavigation();
  initTeacherFilters();
  initCarouselControls();
});

/**
 * FAQ Accordion logic
 */
function initFaqAccordions() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[aria-controls^="faq-answer"]') || 
                e.target.closest('button:has(span:last-child)');
    
    if (!btn) return;
    const controlsId = btn.getAttribute('aria-controls');
    let answerEl = controlsId ? document.getElementById(controlsId) : null;
    
    if (!answerEl && btn.nextElementSibling && btn.nextElementSibling.tagName === 'DIV') {
      answerEl = btn.nextElementSibling;
    }
    
    if (!answerEl) return;

    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const newExpanded = !isExpanded;
    btn.setAttribute('aria-expanded', String(newExpanded));

    const plusSpan = Array.from(btn.querySelectorAll('span')).find(s => s.textContent.trim() === '+' || s.textContent.trim() === '×');

    if (newExpanded) {
      answerEl.style.maxHeight = (answerEl.scrollHeight + 32) + 'px';
      answerEl.style.opacity = '1';
      answerEl.style.transition = 'max-height 0.35s ease-out, opacity 0.3s ease-out';
      if (plusSpan) {
        plusSpan.style.transform = 'rotate(45deg)';
        plusSpan.style.transition = 'transform 0.3s ease-out';
      }
    } else {
      answerEl.style.maxHeight = '0px';
      answerEl.style.opacity = '0';
      answerEl.style.transition = 'max-height 0.3s ease-in, opacity 0.25s ease-in';
      if (plusSpan) {
        plusSpan.style.transform = 'rotate(0deg)';
        plusSpan.style.transition = 'transform 0.3s ease-out';
      }
    }
  });
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNavigation() {
  const menuBtn = document.querySelector('button[aria-label="Open navigation menu"]') || 
                  document.querySelector('button:has(svg path[d*="M4 7H20"])');

  if (!menuBtn) return;

  let mobileDrawer = document.getElementById('bina-custom-mobile-menu');
  if (!mobileDrawer) {
    mobileDrawer = document.createElement('div');
    mobileDrawer.id = 'bina-custom-mobile-menu';
    
    // Explicit inline styles to override any compiled CSS issues
    mobileDrawer.style.position = 'fixed';
    mobileDrawer.style.top = '0';
    mobileDrawer.style.left = '0';
    mobileDrawer.style.width = '100vw';
    mobileDrawer.style.height = '100vh';
    mobileDrawer.style.backgroundColor = '#121212';
    mobileDrawer.style.zIndex = '99999';
    mobileDrawer.style.display = 'flex';
    mobileDrawer.style.flexDirection = 'column';
    mobileDrawer.style.justifyContent = 'space-between';
    mobileDrawer.style.padding = '5rem 1.75rem 2.5rem 1.75rem';
    mobileDrawer.style.boxSizing = 'border-box';
    mobileDrawer.style.overflowY = 'auto';
    mobileDrawer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    mobileDrawer.style.opacity = '0';
    mobileDrawer.style.pointerEvents = 'none';
    mobileDrawer.style.transform = 'translateY(-10px)';
    
    mobileDrawer.innerHTML = `
      <button id="close-mobile-menu" type="button" aria-label="Close navigation menu" style="position: absolute; top: 1.25rem; right: 1.25rem; background: transparent; border: none; color: #fff; font-size: 2.2rem; cursor: pointer; line-height: 1; padding: 0.5rem; display: flex; align-items: center; justify-content: center;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06E1BD" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div style="display: flex; flex-direction: column; gap: 1rem; text-align: left; padding-top: 1rem;">
        <a href="/" style="font-family: 'Rund Display', sans-serif; font-size: 1.75rem; font-weight: 700; color: #fff; text-decoration: none; padding-bottom: 0.85rem; border-bottom: 1px solid #242424; transition: color 0.2s;">Home</a>
        <a href="/programs" style="font-family: 'Rund Display', sans-serif; font-size: 1.75rem; font-weight: 700; color: #fff; text-decoration: none; padding-bottom: 0.85rem; border-bottom: 1px solid #242424; transition: color 0.2s;">Programs</a>
        <a href="/contact" style="font-family: 'Rund Display', sans-serif; font-size: 1.75rem; font-weight: 700; color: #fff; text-decoration: none; padding-bottom: 0.85rem; border-bottom: 1px solid #242424; transition: color 0.2s;">Contact</a>
        <a href="/donations" style="font-family: 'Rund Display', sans-serif; font-size: 1.75rem; font-weight: 700; color: #fff; text-decoration: none; padding-bottom: 0.85rem; border-bottom: 1px solid #242424; transition: color 0.2s;">Donations</a>\n        <div style="background: #1c1c1c; border-radius: 12px; padding: 0.85rem 1rem; border: 1px solid #333; margin-top: 0.5rem;"><span style="color: #03CB5B; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; display: block;">Donate via MoMo</span><a href="tel:+250788749709" style="color: #F7D928; font-size: 1.25rem; font-weight: 900; text-decoration: none;">250788749709</a></div>
      </div>
      <div style="margin-top: auto; padding-top: 2rem;">
        <a href="/contact" style="display: block; width: 100%; text-align: center; padding: 1rem; border-radius: 9999px; font-family: 'Rund Display', sans-serif; font-size: 1.1rem; font-weight: 700; color: #000; background-color: #fcde2d; text-decoration: none; box-shadow: 0 6px 20px rgba(252, 222, 45, 0.25);">
          Start your risevana journey &rarr;
        </a>
      </div>
    `;
    document.body.appendChild(mobileDrawer);
  }

  let isOpen = false;
  const paths = menuBtn.querySelectorAll('svg path');

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    menuBtn.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      mobileDrawer.style.opacity = '1';
      mobileDrawer.style.pointerEvents = 'auto';
      mobileDrawer.style.transform = 'translateY(0)';
      document.body.style.overflow = 'hidden';
      if (paths.length === 3) {
        paths[0].style.transform = 'translateY(5px) rotate(45deg)';
        paths[1].style.opacity = '0';
        paths[2].style.transform = 'translateY(-5px) rotate(-45deg)';
      }
    } else {
      closeMenu();
    }
  });

  function closeMenu() {
    isOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.style.opacity = '0';
    mobileDrawer.style.pointerEvents = 'none';
    mobileDrawer.style.transform = 'translateY(-10px)';
    document.body.style.overflow = '';
    if (paths.length === 3) {
      paths[0].style.transform = 'translateY(0) rotate(0)';
      paths[1].style.opacity = '1';
      paths[2].style.transform = 'translateY(0) rotate(0)';
    }
  }

  // Close when clicking close button, backdrop, or any navigation link
  mobileDrawer.querySelector('#close-mobile-menu')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });
  mobileDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/**
 * Teachers Page Region Filter
 */
function initTeacherFilters() {
  const filterBtns = Array.from(document.querySelectorAll('button')).filter(b => {
    const txt = b.textContent.trim();
    return ['All', 'Americas', 'Europe', 'Asia and Middle East'].includes(txt);
  });

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.style.backgroundColor = 'transparent';
        b.style.color = '#fff';
      });
      btn.style.backgroundColor = '#03ecc5';
      btn.style.color = '#000';
    });
  });
}

/**
 * Carousel Controls (Prev/Next buttons)
 */
function initCarouselControls() {
  document.querySelectorAll('button:has(svg)').forEach(btn => {
    const carouselContainer = btn.closest('.relative')?.querySelector('.overflow-x-auto, .snap-x');
    if (carouselContainer) {
      btn.addEventListener('click', () => {
        const isNext = btn.querySelector('svg')?.innerHTML.includes('rotate') || btn.classList.contains('next');
        const scrollAmount = 350;
        carouselContainer.scrollBy({
          left: isNext ? scrollAmount : -scrollAmount,
          behavior: 'smooth'
        });
      });
    }
  });
}


// Value Props, Hero, All-Pages Anti-Collision & Donation Polish
(function initVisualPolish() {
  const styleEl = document.createElement('style');
  styleEl.id = 'risevana-visual-polish';
  styleEl.textContent = `
    /* 1. Hide Day in Life section across all pages (Home, Programs, Primary School) */
    #day-in-life,
    [id*="day-in-life"],
    #primary-school-day,
    [id*="primary-school-day"],
    astro-island[component-url*="LandingDayInLifeIsland"],
    astro-island[component-url*="PrimarySchoolDayIsland"] {
      display: none !important;
    }

    /* 2. Hero Background & Overlay (Grayscale Black and White) */
    #hero img[src*="risevana-ecd-3"] {
      filter: grayscale(100%) contrast(108%) !important;
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      object-position: center 35% !important;
      z-index: 0 !important;
    }
    
    #hero img[src*="hero-kids"],
    #hero img[src*="hero-sky"],
    #hero img[src*="hero-field"],
    #hero img[src*="dandelion"],
    #hero img[src*="clover"],
    #hero img[src*="bird"] {
      display: none !important;
    }

    /* 3. "This is for you if..." Cards Fixes */
    #about [style*="border-radius:30px"],
    #about [style*="border-radius: 30px"] {
      display: flex !important;
      flex-direction: column !important;
      box-sizing: border-box !important;
    }

    #about [style*="border-radius:30px"] > div,
    #about [style*="border-radius: 30px"] > div {
      display: flex !important;
      flex-direction: column !important;
      height: 100% !important;
      width: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }

    #about [style*="border-radius:30px"] p,
    #about [style*="border-radius: 30px"] p,
    #about p {
      position: static !important;
      flex-shrink: 0 !important;
      margin: 0 !important;
      padding: 10px 14px 6px 14px !important;
      font-size: clamp(1.05rem, 1.4vw, 1.35rem) !important;
      font-weight: 700 !important;
      line-height: 1.25 !important;
      text-align: center !important;
      text-wrap: balance !important;
      overflow: visible !important;
      white-space: normal !important;
    }

    #about [style*="border-radius:30px"] div:has(> img[src*="lovepoint-card"]),
    #about [style*="border-radius: 30px"] div:has(> img[src*="lovepoint-card"]),
    #about [style*="border-radius:30px"] div:has(> picture > img[src*="lovepoint-card"]),
    #about [style*="border-radius: 30px"] div:has(> picture > img[src*="lovepoint-card"]) {
      position: relative !important;
      top: auto !important;
      bottom: auto !important;
      left: auto !important;
      right: auto !important;
      height: auto !important;
      flex: 1 1 0% !important;
      min-height: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 20px !important;
      overflow: hidden !important;
      background-color: rgba(0, 0, 0, 0.08) !important;
      margin-top: 4px !important;
    }

    #about img[src*="lovepoint-card"] {
      object-fit: contain !important;
      object-position: center center !important;
      width: 100% !important;
      height: 100% !important;
      max-height: 100% !important;
      border-radius: 18px !important;
    }

    /* 4. Global Anti-Collision: Ensure NO words override photos across ALL pages */

    /* A. Feature Cards on Homepage (#education) */
    #education [class*="rounded-"] {
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-sizing: border-box !important;
    }
    #education [class*="rounded-"] > div:first-child {
      position: relative !important;
      z-index: 10 !important;
      flex-shrink: 0 !important;
      padding-bottom: 0.5rem !important;
    }
    #education [class*="rounded-"] img {
      position: relative !important;
      inset: auto !important;
      transform: none !important;
      max-height: 52% !important;
      width: 100% !important;
      object-fit: contain !important;
      margin-top: auto !important;
    }

    /* B. SectionContentCards (Open House, Contact) */
    .oh-wa-card, .oh-why-card, .oh-right-card,
    div[class*="oh-wa-card"],
    div:has(> h3 + div + img),
    div:has(> h3 + img) {
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-sizing: border-box !important;
    }
    .oh-wa-card h3, .oh-why-card h3, .oh-right-card h3,
    div[class*="oh-wa-card"] h3 {
      position: relative !important;
      z-index: 10 !important;
      flex-shrink: 0 !important;
      margin-bottom: auto !important;
      padding-bottom: 0.75rem !important;
    }
    .oh-wa-card1-art, .oh-wa-card2-art, .oh-wa-card3-art,
    .oh-wa-card img, .oh-why-card img, .oh-right-card img,
    div[class*="oh-wa-card"] img {
      position: relative !important;
      inset: auto !important;
      max-height: 50% !important;
      width: auto !important;
      object-fit: contain !important;
      margin-top: auto !important;
      align-self: flex-end !important;
    }

    /* C. Tuition / Donations Cards (#tuition-learning, #tuition-support, #tuition-tools, #tuition-friendship) */
    #tuition-learning [class*="min-h-"],
    #tuition-support [class*="min-h-"],
    #tuition-tools [class*="min-h-"],
    #tuition-friendship [class*="min-h-"] {
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-sizing: border-box !important;
    }
    #tuition-learning h4,
    #tuition-support h4,
    #tuition-tools h4,
    #tuition-friendship h4 {
      position: relative !important;
      z-index: 10 !important;
      flex-shrink: 0 !important;
      padding-bottom: 0.75rem !important;
    }
    #tuition-learning img,
    #tuition-support img,
    #tuition-tools img,
    #tuition-friendship img {
      position: relative !important;
      inset: auto !important;
      max-height: 50% !important;
      width: 100% !important;
      height: auto !important;
      object-fit: contain !important;
      object-position: bottom center !important;
      margin-top: auto !important;
    }

    /* D. Middle School Difference Cards */
    #middle-school-difference article,
    #middle-school-difference [class*="card"] {
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
    }
    #middle-school-difference img {
      position: relative !important;
      inset: auto !important;
      max-height: 48% !important;
      object-fit: contain !important;
      margin-top: auto !important;
    }

    /* E. Programs Page Core Cards Anti-Collision & Zero-Cropping */
    .risevana-program-card,
    div:has(> img[src*="why-"]),
    div:has(> picture > img[src*="why-"]) {
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }

    .risevana-program-card > div:first-child,
    div:has(> img[src*="why-"]) > div:first-child,
    div:has(> picture > img[src*="why-"]) > div:first-child {
      position: relative !important;
      z-index: 5 !important;
      flex-shrink: 0 !important;
      width: 100% !important;
    }

    .risevana-photo-frame,
    div:has(> img[src*="why-"]) div:has(> img),
    div:has(> picture > img[src*="why-"]) div:has(> picture) {
      position: relative !important;
      flex: 1 1 0% !important;
      min-height: 180px !important;
      width: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 1.25rem !important;
      overflow: hidden !important;
      background: rgba(0, 0, 0, 0.06) !important;
      padding: 6px !important;
      margin-top: 0.75rem !important;
    }

    img[src*="why-live-every-day"],
    img[src*="why-school-from-anywhere"],
    img[src*="why-tiny-classes"],
    img[src*="why-beyond-textbook"] {
      position: relative !important;
      inset: auto !important;
      left: auto !important;
      right: auto !important;
      top: auto !important;
      bottom: auto !important;
      width: 100% !important;
      height: 100% !important;
      max-height: 260px !important;
      object-fit: contain !important;
      object-position: center center !important;
      border-radius: 1rem !important;
      margin: 0 !important;
      display: block !important;
    }

    /* F. Primary School Hero Safeguard */
    #primary-school-hero img[src*="hero-kids"] {
      max-height: 42svh !important;
      object-fit: contain !important;
      object-position: bottom center !important;
    }

    /* G. General safeguard for any card with image + heading/paragraph */
    article:has(> img + div),
    div[class*="rounded"]:has(> img + div),
    div[class*="rounded"]:has(> div > img) {
      box-sizing: border-box !important;
    }

    /* H. Accreditation logo badges */
    div:has(> picture > img[src*="/logos/"]),
    div:has(> img[src*="/logos/"]) {
      background-color: #ffffff !important;
      border-radius: 1rem !important;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }
  `;
  document.head.appendChild(styleEl);
})();
