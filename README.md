# Bina — Online School for Ages 4 to 15

A full, faithful recreation of [thebinaschool.com](https://thebinaschool.com/) built with clean HTML5, Tailwind CSS, brand typography, interactive Astro island scripts, and an on-demand asset caching server.

---

## 🌟 Included Pages

| Route | File | Description |
|---|---|---|
| `/` | [`index.html`](file:///C:/Users/user/Desktop/AXEL%20SCHOOL/index.html) | Home page: "Your kid deserves to love Mondays" hero, accreditations, curriculum, day in the life, pricing, FAQ |
| `/teachers` | [`teachers.html`](file:///C:/Users/user/Desktop/AXEL%20SCHOOL/teachers.html) | Teachers page: Teacher roster, teacher qualifications, regional filters (Americas, Europe, Asia/Middle East) |
| `/primary-school` | [`primary-school.html`](file:///C:/Users/user/Desktop/AXEL%20SCHOOL/primary-school.html) | Primary School (Ages 4–11): Project-based learning, schedule overview, student outcomes |
| `/middle-school` | [`middle-school.html`](file:///C:/Users/user/Desktop/AXEL%20SCHOOL/middle-school.html) | Middle School (Ages 12–15): Teenager-focused curriculum, schedule, testimonials, FAQ |
| `/about` | [`about.html`](file:///C:/Users/user/Desktop/AXEL%20SCHOOL/about.html) | About Us: Mission, founder quote, core values, team & leadership |
| `/admissions` | [`admissions.html`](file:///C:/Users/user/Desktop/AXEL%20SCHOOL/admissions.html) | Admissions: Application steps, enrollment timeline, video walkthrough |
| `/tuition` | [`tuition.html`](file:///C:/Users/user/Desktop/AXEL%20SCHOOL/tuition.html) | Tuition & Fees: Payment plans, sibling discounts, what's included |
| `/open-house` | [`open-house.html`](file:///C:/Users/user/Desktop/AXEL%20SCHOOL/open-house.html) | Open House: Virtual open house registration, live Q&A preview |

---

## 🚀 Getting Started

### 1. Run with Node.js (Recommended)

Run the zero-dependency local development server:

```bash
npm start
# or
node server.js
```

Then visit:
👉 **[http://localhost:3000](http://localhost:3000)**

### 2. Standalone / Static Hosting

You can also host these files on GitHub Pages, Netlify, Vercel, or open any `.html` file directly in your browser.

---

## 🎨 Design & Architecture Highlights

1. **Brand Typography**:
   - All 20 original Rund Display & Rund Text fonts (Regular, Medium, SemiBold, Bold, Black in both `.woff2` and `.woff`) are packaged locally in `public/fonts/`.
2. **Interactive Elements (`public/app.js`)**:
   - **FAQ Accordions**: Expand and collapse questions smoothly with rotating `+` indicators.
   - **Mobile Drawer Menu**: Responsive animated hamburger menu with clean fullscreen drawer.
   - **Teacher Filtering**: Region selector buttons ("All", "Americas", "Europe", "Asia and Middle East").
   - **Carousels & Sliders**: Smooth scrolling controls for testimonial & showcase rails.
3. **59 Astro Hydration Bundles (`public/_astro/`)**:
   - Full island scripts downloaded for client interactivity matching the production build.
4. **Smart Auto-Caching Proxy Server (`server.js`)**:
   - Written using Node.js built-in `http`, `fs`, `https`, and `path` (no npm install needed).
   - Serves local files instantly. If any image isn't downloaded yet, it streams from the CDN and caches it to `public/images/` automatically.
5. **Cleaned & Privacy-Friendly**:
   - Removed third-party tracking scripts (Google Tag Manager, CookieYes, PostHog, Google Ads conversions) for fast and warning-free local browsing.
