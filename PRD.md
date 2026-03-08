# Product Requirements Document (PRD)

## Project Name: Jejak Masjid
**Version:** 1.0 (MVP)
**Target Launch:** Ramadan

---

### 1. Product Overview & Vision
Jejak Masjid is an application built for exploring the spiritual journey of visiting mosques during Ramadan. The application provides progress tracking and community inspiration, transforming a simple mosque database into a vibrant social platform. Our goal is to offer a minimal but highly polished MVP that allows users to discover local mosques, check in when they visit, share their experiences, and track their personal Ramadan journey.

### 2. Target Audience
- **Muslims** seeking to document and track their spiritual journey during Ramadan.
- **Community Explorers** looking to discover new and historic mosques in their area.
- Individuals looking to stay motivated by tracking daily streaks and sharing their progress with friends and family.

### 3. Core Features & User Flow
**Primary User Flow:**
Open Website & Authenticate → View Mosque Map or Social Feed → Select a Mosque → Check-in (Add Photo/Caption) → View Journey Dashboard → Generate & Share Recap Card.

**Key Features:**
1. **Interactive Mosque Map:** Discover mosques on an interactive Leaflet map using OpenStreetMap data, featuring clustered pins and mosque detail cards.
2. **Social Feed:** Discover recent mosque visits from the community with user photos, custom captions, and interactive reactions.
3. **Mosque Check-ins:** Allows users to log their visit to a specific mosque seamlessly, complete with optional photo uploads to Vercel Blob.
4. **Journey Dashboard:** A personal dashboard displaying stats like total mosques visited, unique cities explored, and the current check-in streak.
5. **Shareable Recap Card:** A feature that dynamic generates a beautifully designed, downloadable, and shareable PNG summarizing the user's Ramadan journey metrics.

### 4. Functional Requirements
- **Authentication:** Users must be able to log in securely (via NextAuth).
- **Map View:** 
  - Render an interactive, clustered map of mosques.
  - Clicking a marker opens a mosque card with details (Name, City) and a "Check-in" button.
- **Social Feed:**
  - View a paginated feed of global user check-ins.
  - Support for photo uploads and caption texts during check-in.
  - Users can react to feed posts.
- **Check-ins:**
  - API endpoint must accept user ID, mosque ID, timestamp, and optional photo URL / caption.
  - UI provides an immediate success toast / visual confirmation.
- **Journey Tracking:**
  - Real-time calculation of total mosques visited, unique cities, and visit streak logic.
- **Recap Card Generation:**
  - Dynamic generation of a shareable image featuring user stats and the Jejak Masjid branding (via Vercel OG).
  - Provide quick actions to Share to X (Twitter), WhatsApp, and Download Image.

### 5. Technical Stack & Architecture
- **Frontend Framework:** Next.js (App Router), React
- **Styling:** Tailwind CSS, Framer Motion
- **Maps:** Leaflet, React-Leaflet
- **Backend/API:** Next.js API Routes (Serverless)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** NextAuth.js
- **Storage/File Uploads:** Vercel Blob
- **Image Generation (Recaps)::** Vercel OG / Satori
- **Deployment:** Vercel / Docker (optional)

### 6. Data Model
* **Users Table:** `id`, `email`, `name`, `avatar`, `created_at`
* **Mosques Table:** `id`, `name`, `city`, `province`, `latitude`, `longitude`, `category`
* **Checkins Table:** `id`, `user_id`, `mosque_id`, `visited_at`, `photo_url`, `caption`

### 7. Go-To-Market & Success Metrics (MVP)
**Launch Strategy:**
- Marketed as a 100% open-source tool tailored for Ramadan.
- Distributed on platforms such as GitHub, X (Twitter), Reddit, and Islamic tech communities.

**MVP Target Metrics:**
- **Acquisition:** 100 active users.
- **Engagement:** 1,000 total mosque check-ins (average check-ins per user).
- **Virality:** Volume of recap cards generated and shared to social media.

### 8. Post-MVP Future Roadmap
- Digital Mosque Passport
- Achievement Badges & Gamification
- Public User Profiles
- Expansion to a Global Mosque Database
- Native Mobile App / Fully Offline Progressive Web App (PWA)
