# 💼 Dynamic Developer Portfolio — Web + Mobile (React, Express, Expo)

A fully dynamic, self-manageable portfolio platform. Instead of hardcoding projects, skills, and experience into the frontend, every section is powered by a REST API and PostgreSQL database — editable in real time from a custom, password + JWT-protected admin dashboard, with no redeploy required. The same backend also powers a **React Native (Expo) mobile companion app**, so the portfolio content stays in sync across web and mobile from a single source of truth.

---

## ✨ Key Features

### 🌐 Public Portfolio (React + Vite)
- Fully dynamic sections — **Projects, Skills, Experience, Education, Certifications** — all fetched live from the API, with graceful loading skeletons and error states for every section
- **Filterable Projects** (Personal / Freelance / Paid Freelance) and **Skills** (frontend / backend / mobile / database / tools) with expandable project detail cards (GitHub + live demo links, tech stack chips)
- Smooth-scroll, scroll-spy navbar that highlights the active section, with a responsive mobile hamburger menu
- Interactive contact section with click-to-call, click-to-copy email, and a custom email modal (no third-party form service)
- Profile photo, hero content, and all data — including the profile picture itself — served from the same dynamic API/database, editable from the admin panel

### 🔐 Admin Dashboard (protected SPA route)
- **Config-driven CRUD system** — a single `adminConfig.js` schema drives a generic `AdminSection` + `AdminModal` component, so adding a brand-new manageable content type (its fields, validation, input type — text/select/tags/list) requires no new UI code
- Supports rich field types: tag inputs (technologies), ordered bullet-point lists (responsibilities), dropdowns, and free text
- **Profile Photo Manager** — client-side image validation (2MB limit, image-type check) and Base64 upload straight into the settings table, with live before/after preview
- **JWT-based authentication** with a token stored client-side and auto-logout on 401 responses via a custom `auth-unauthorized` event
- Admin route path is configurable via environment variable (`VITE_ADMIN_PATH`) rather than hardcoded, so the login/dashboard URL isn't guessable from the source
- Fully responsive dashboard — collapsible sidebar on desktop, bottom tab bar on mobile

### ⚙️ Backend (Express + PostgreSQL)
- Clean **REST API** with public GET endpoints (read-only for visitors) and JWT-guarded POST/PUT/DELETE endpoints (admin only) for every resource: Projects, Skills, Experience, Education, Certifications, and a generic key-value `Settings` table (used for the profile photo and other site config)
- Server-side field validation with descriptive per-field error arrays returned to the client
- Middleware short-circuits auth checks automatically in the test environment, keeping the API easily testable
- **CI pipeline** (GitHub Actions) for automated checks on push

### 📱 Companion Mobile App (Expo / React Native)
- Built with **Expo**, mirroring the web portfolio's structure and design language
- Consumes the **exact same REST API** as the web app — projects, skills, experience, etc. are entered once in the admin dashboard and instantly reflected on both platforms
- No duplicate content management — a true single-source-of-truth architecture across web and mobile

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router |
| Mobile | Expo (React Native) |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken) |
| Testing | Jest, React Testing Library |
| CI/CD | GitHub Actions |
| Deployment | Render (API + DB), static hosting (frontend) |

---

## 🧩 Architecture Overview

```
backend/
 ├── app.js            → Express app: all REST routes (projects, skills, experience,
 │                        education, certifications, settings, admin login)
 ├── server.js          → Entry point
 ├── middleware/auth.js  → JWT verification middleware
 ├── db/                  → PostgreSQL connection pool
 └── __tests__/             → API test suite

frontend/
 ├── src/
 │   ├── api/client.js         → Centralized fetch wrapper (auth headers, 401 handling)
 │   ├── hooks/useFetch.js      → Reusable data-fetching hook with loading/error states
 │   ├── context/AuthContext.jsx → Global auth state (login/logout/isAuthenticated)
 │   ├── components/
 │   │   ├── Navbar, Projects, Skills, Exce (Experience + Certifications)
 │   │   └── admin/
 │   │       ├── adminConfig.js       → Schema driving all CRUD sections
 │   │       ├── AdminLayout.jsx        → Sidebar/mobile-tab dashboard shell
 │   │       ├── AdminSection.jsx        → Generic list + CRUD for any config entry
 │   │       ├── AdminModal.jsx           → Generic add/edit form (renders per field type)
 │   │       ├── ProfilePhotoManager.jsx   → Base64 image upload for hero photo
 │   │       ├── AdminLogin.jsx             → Password login → JWT
 │   │       └── ProtectedRoute.jsx          → Route guard for the admin path
 │   └── App.jsx                                → Public site composition
 └── public/_redirects                             → SPA routing fallback

mobile/ (Expo)
 └── Consumes the same backend API as the web frontend
```

### Core Flow
1. Visitor loads the site → each section independently calls the API via `useFetch` and renders once data resolves (skeleton loaders shown meanwhile)
2. Admin navigates to the configured admin path → logs in with a password → receives a JWT stored in `localStorage`
3. Admin dashboard reads `adminConfig.js` to render tabs/forms for every content type, calling the same generic `apiRequest` helper for all CRUD operations
4. Content changes are immediately live on both the website and the Expo mobile app, since both read from the identical API

---



## 📄 License
MIT
