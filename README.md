# Risevana School — Website & Full CMS Management System

A production-ready, manageable website and administrative CMS for Risevana Foundation / School. Built with high performance zero-dependency Node.js, real-time live content hydration, integrated authentication, and full categorized control over every word, photo, logo, and digital asset.

---

## 🔑 Administrator Credentials

- **Admin CMS URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `nextech@gmail.com`
- **Password**: `axel@12345`

---

## 🚀 Quick Start

Start the server using Node.js (zero external dependencies required):

```bash
npm start
# or
node server.js
```

### URLs:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Management Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🛠 Features & Capabilities

### 1. Categorized Management
The Admin Dashboard organizes website control into clear, intuitive categories:

- **🎨 Brand & Logos**:
  - Primary Header / Navbar Logo (upload new file, pick from library, live preview)
  - Card & Secondary Logo
  - Website Favicon
  - School Name & Tagline
  - MoMo Donation Phone Number & Account Name (updates everywhere on the site)
  - Contact Email & Telephone
  - Social Media Links
- **🏠 Home Page**:
  - Hero headline, subtext, badge, CTA button text and link
  - Hero background photo (replace, upload, or pick from gallery)
  - Accreditations title & partner logos
  - "This is for you if..." 4 interactive cards (editable text, accent colors, illustrations)
  - Education feature cards (titles, descriptions, photos)
  - 100% Free School banner headline and description
- **📚 Programs & Education**:
  - Educational programs header & subtext
  - Full CRUD for programs (Early Childhood Development, Mobile Classroom, Nutrition, Teacher Training)
  - Add new program, edit title, age badge, description, photo, or delete program
- **👩‍🏫 Teachers & Team**:
  - Hero headline & subtext
  - 4 Key Teaching Statistics (Masters %, years of experience, nationalities, retention %)
  - Complete Teacher Roster CRUD (Add educator, edit name, role, timezone, region filter, bio, photo)
- **💛 Donations & Tuition**:
  - MoMo donation phone number, instructions, and account details
  - 4 Pillars of Free Education (Tuition, Nutrition, Laptops, Care) with editable photos and descriptions
- **📖 About Us & Founder**:
  - Founding story headline and narrative paragraphs
  - Founder profile: Name, title, biography, and Founder Portrait Photo
- **📞 Contact & Visit**:
  - Campus address, telephone, email, and visiting hours

### 2. Complete Media Asset Manager ("Change Any Asset")
- Browse all **1,700+ assets** stored in `public/images/` and `public/uploads/`.
- Filter by category: **Logos**, **Hero Banners**, **School & Classrooms**, **Teachers**, **Programs**, **Uploads**, or search by keyword.
- **In-Place Asset Replacement**: Click **Replace** on ANY asset to upload a file that directly overwrites the file on disk (with automated backup in `data/backups/`). The live site reflects the change immediately.
- **Upload New Asset**: Drag-and-drop or select any PNG, JPG, JPEG, WEBP, AVIF, or SVG.
- **Copy Asset URL**: 1-click clipboard copy of web-ready paths (e.g., `/images/...` or `/uploads/...`).

### 3. Dual-Layer Live Integration Engine
- **Server-Side Injection**: When serving pages, `server.js` dynamically replaces primary logos, favicons, MoMo numbers, and assets in the HTML output, ensuring zero layout shift and SEO-friendly rendering.
- **Client-Side Hydration (`public/cms-client.js`)**: Real-time hydration engine binds CMS changes directly to DOM elements.
- **Admin Floating Quick Pill**: When logged in as admin, visiting the public website shows a discreet floating badge at the bottom corner with direct 1-click navigation back to the CMS editor.

---

## 🔒 Security & Data Persistence
- Passwords verified with PBKDF2 cryptographic hashing with unique random salts.
- Sessions stored with secure random 32-byte tokens and 7-day expiration.
- Auto-backup engine in `data/backups/` saves revision snapshots whenever CMS data is saved or assets are replaced.
- "Restore Factory Defaults" button restores original content if needed.
- "Export JSON Backup" button lets administrators download a complete offline snapshot anytime.
