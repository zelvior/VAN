# VAN (Verified Anime News)
### “No Rumors. Only Sources.”

VAN is an elite, senior-designed full-stack anime news aggregation and intelligence platform. Unlike normal fan blogs, VAN is engineered specifically to combat unvetted leaks, mistranslated rumors, and speculation. It scores and verifies every announcement before adding it to public channels.

---

## ⚡ TECH STACK & HOSTING

- **Frontend Core:** React 19 (Latest) + Vite + TypeScript (Type-safe models).
- **Animations:** Framer Motion (`motion/react`) for layout transition micro-choreography.
- **Styling:** Tailwind CSS v4 supporting clean native parameters.
- **Services:**
  - **Firebase Auth:** Multi-role admin console lock screen.
  - **Firebase Firestore:** Low-latency real-time database subscription sync models.
  - **Jikan MAL API:** Direct, rate-limit buffered integration retrieving popular anime metrics.
  - **AniList GraphQL API:** GraphQL query client fetching studio data and banner assets.
  - **Reddit News API:** Automated Reddit parsing filter extracting verified subreddit links.
- **PWA Capabilities:** Fully installable, utilizing `/public/sw.js` service worker pre-caches for offline reading lists.
- **Host Compatibility:** **100% Static-Host Compatible** (perfectly optimized to run on **GitHub Pages** out-of-the-box).

---

## 📁 SYSTEM DIRECTORY STRUCTURE

```bash
/
├── .env.example                  # Environment Variable Documentation template
├── firebase-blueprint.json       # Intermediate Representation (IR) database schema description
├── firestore.rules               # Hardened ABAC Security Rules definitions for Firestore
├── index.html                    # SPA Static Entrypoint
├── package.json                  # Managed dependency packages and scripts
├── public/
│   └── sw.js                     # Progressive Web App offline asset cache Service Worker
├── src/
│   ├── App.tsx                   # Central Switchboard & Routing Maps (HashRouter-bound)
│   ├── index.css                 # Global CSS importing Inter/Outfit/JetBrains custom font themes
│   ├── main.tsx                  # Root renderer triggering runtime PWA activation
│   ├── components/               # High-Fidelity Shared UI Components
│   │   ├── Navbar.tsx            # Glossmorphic navigations with responsive drawers & authentications
│   │   ├── NewsCard.tsx          # Card listing with trust scoring meters, categories & report modals
│   │   ├── Skeleton.tsx          # Card/list layout stabilizers preventing layout cumulative shifts
│   │   └── TrendingSidebar.tsx   # Side rails listing MAL trending and database sources
│   ├── context/
│   │   └── AppContext.tsx        # Central context coordinates (State, Persistences, Admin triggers)
│   ├── data/
│   │   └── defaultNews.ts        # Default news datasets automatically seeding clean DB setups
│   ├── lib/
│   │   └── firebase.ts           # Firebase SDK initializers with custom query exception handlers
│   ├── services/
│   │   └── api.ts                # Jikan/AniList/Reddit queries, Jaccard intersections & scoring rules
│   └── types.ts                  # Central structured TypeScript definitions
└── tsconfig.json                 # Shared TS compiler maps
```

---

## 🛡️ CORE EXCLUSIVE FEATURES

### 1. Verification Status & badges
Every card displays color-coded badges indicating verification grade:
- **`VERIFIED` (Score >= 90):** Directly backed by official production committees, verified director socials, or legal publisher streams (Crunchyroll, Natalie, etc.).
- **`TRUSTED` (Score 70-80):** Confirmed by major established anime media outlets with historic veracity.
- **`PENDING` (Score 45-69):** Undergoing community and moderator audit analysis.
- **`RUMOR / UNCONFIRMED` (Score < 45):** Highlighted leaks or fan speculation, strictly warning readers to avoid treating it as fact.

### 2. Auto Trust-Score Calculation
Manual news entries trigger the api-service formula:
$$\text{Base Score} = 50$$
$$\text{Official Committee Press Filing} \rightarrow +45 \text{ points}$$
$$\text{Standard Trusted Outlet domain (natalie.mu, etc.)} \rightarrow +42 \text{ points}$$
$$\text{Rumor/Leak Categories} \rightarrow -45 \text{ points (strict penalty caps)}$$

### 3. Duplicate Jaccard Intersections
Prior to document save, title text undergoes Jaccard token analysis:
$$\text{Similarity Score} = \frac{|A \cap B|}{|A \cup B|}$$
Overlap exceeding **65%** triggers instant duplicate notices inside the news draft builder to prevent redundant announcements.

### 4. Zero-Trust Firestore Security
Admin panels are protected under strict ABAC (Attribute-Based Access Control) security rules. The linter enforces:
- Public readers can pull news databases statically under relative query checks.
- Only authenticated admins (such as `faizudemon@gmail.com`) can write news documents, update publisher scores, or edit campaigns.
- Any reader is allowed to instantly flag a news card, which pushes user reports securely to the Admin Inbox and triggers email verification parameters.

---

## 🚀 ASSEMBLY & DEV OPERATION

Follow these commands to deploy or debug locally:

### 1. Setup Local Environment Parameters
Duplicate the example parameters file and append credentials:
```bash
cp .env.example .env
```

### 2. Install Associated Dependencies
```bash
npm install
```

### 3. Start Local Cold Live Debug Server
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser. The application automatically checks if your Firestore is empty and seeds default news metadata so it works out of the box!

---

## 📦 GITHUB PAGES DEPLOYMENT INSTRUCTIONS

Because GitHub Pages serves static single-page websites, traditional routers (like BrowserRouter) will break and cause 404 errors when navigating sub-folders. VAN completely avoids this by adopting **HashRouter** and **relative build directories**.

Follow these simple steps to deploy:

### Step 1: Install `gh-pages` Dependency (Automated)
```bash
npm install --save-dev gh-pages
```

### Step 2: Configure Deployment Scripts inside `package.json`
Deploy scripts are pre-loaded in standard formats. Append these scripts if deploying directly from shell environments:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### Step 3: Run Deployment command
Trigger compilation and push files automatically to the your repository's `gh-pages` branch:
```bash
npm run deploy
```

Vite compiles optimized bundles (including `base: "./"` assets mapping inside ours `vite.config.ts`), and `gh-pages` automatically binds it to your custom page URL:
`https://<your-github-username>.github.io/<your-repository-name>/`
Your app will load perfectly, cache offline, and connect smoothly to Firebase Firestore.
