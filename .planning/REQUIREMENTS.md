# Requirements: Jejak Masjid

**Defined:** 2026-03-05
**Core Value:** Users can discover mosques, check in visits, and see their Ramadan journey grow — creating a personal spiritual travel log.

## v1 Requirements

### Setup

- [ ] **SETUP-01**: Next.js project initialized with App Router, Tailwind CSS, and TypeScript
- [ ] **SETUP-02**: PostgreSQL database connected via Drizzle ORM with migration pipeline
- [ ] **SETUP-03**: Base layout with responsive navbar, footer, and container
- [ ] **SETUP-04**: Environment variables configured for database, auth, and app settings

### Authentication

- [ ] **AUTH-01**: User can create an account with email and password
- [ ] **AUTH-02**: User session persists across browser refresh
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: Protected routes redirect unauthenticated users to login

### Mosque Data

- [ ] **MOSQ-01**: Database seeded with 100 Indonesian mosques (name, city, province, lat/lng, category)
- [ ] **MOSQ-02**: API endpoint returns list of mosques with coordinates
- [ ] **MOSQ-03**: Mosques categorized as historic, iconic, or campus

### Map

- [ ] **MAP-01**: Interactive full-screen Leaflet map renders with OpenStreetMap tiles
- [ ] **MAP-02**: Mosque markers displayed on map with clustering for dense areas
- [ ] **MAP-03**: Clicking a marker opens a mosque info card (name, city, check-in button)
- [ ] **MAP-04**: Map centers on Indonesia by default

### Check-in

- [ ] **CHKN-01**: Authenticated user can check in to a mosque with one tap
- [ ] **CHKN-02**: Check-in records user ID, mosque ID, and timestamp
- [ ] **CHKN-03**: API endpoint creates check-in and returns updated stats
- [ ] **CHKN-04**: UI shows toast confirmation after successful check-in
- [ ] **CHKN-05**: User cannot double-check-in to the same mosque on the same day

### Journey Dashboard

- [ ] **JRNY-01**: Dashboard page shows total mosques visited count
- [ ] **JRNY-02**: Dashboard shows total cities explored count
- [ ] **JRNY-03**: Dashboard shows current visit streak (consecutive days)
- [ ] **JRNY-04**: Dashboard shows a visited-mosque map (highlighted markers)
- [ ] **JRNY-05**: Dashboard shows list of visited mosques with dates

### Recap Card

- [ ] **RCAP-01**: API generates PNG recap card image using Satori
- [ ] **RCAP-02**: Recap card displays: mosques visited, cities explored, longest streak
- [ ] **RCAP-03**: Recap card includes "jejakmasjid.com" branding
- [ ] **RCAP-04**: User can share recap card to X (Twitter)
- [ ] **RCAP-05**: User can share recap card to WhatsApp
- [ ] **RCAP-06**: User can download recap card as PNG

## v2 Requirements

### Gamification

- **GAME-01**: Mosque passport with collectible stamps
- **GAME-02**: Achievement badges (first check-in, 10 mosques, etc.)
- **GAME-03**: Leaderboard for most mosques visited

### Social

- **SOCL-01**: Public user profiles showing journey stats
- **SOCL-02**: Follow other users and see their journeys

### Data

- **DATA-01**: Global mosque database beyond Indonesia
- **DATA-02**: User-submitted mosque suggestions
- **DATA-03**: Mosque photos and reviews

### Platform

- **PLAT-01**: Progressive Web App (PWA) with offline support
- **PLAT-02**: Push notifications for streak reminders

## Out of Scope

| Feature | Reason |
|---------|--------|
| OAuth login (Google, GitHub) | Email/password sufficient for MVP, reduces complexity |
| Real-time features | No collaborative/live use cases in MVP |
| Admin panel | Seed data is sufficient, no UGC moderation needed |
| Mosque reviews/ratings | Adds moderation burden, not core journey tracking |
| Payment/premium features | Free open-source MVP first |
| Location-based auto-check-in (GPS) | Privacy concerns + adds significant complexity |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01 | Phase 1 | Pending |
| SETUP-02 | Phase 1 | Pending |
| SETUP-03 | Phase 1 | Pending |
| SETUP-04 | Phase 1 | Pending |
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| AUTH-03 | Phase 2 | Pending |
| AUTH-04 | Phase 2 | Pending |
| MOSQ-01 | Phase 2 | Pending |
| MOSQ-02 | Phase 2 | Pending |
| MOSQ-03 | Phase 2 | Pending |
| MAP-01 | Phase 3 | Pending |
| MAP-02 | Phase 3 | Pending |
| MAP-03 | Phase 3 | Pending |
| MAP-04 | Phase 3 | Pending |
| CHKN-01 | Phase 4 | Pending |
| CHKN-02 | Phase 4 | Pending |
| CHKN-03 | Phase 4 | Pending |
| CHKN-04 | Phase 4 | Pending |
| CHKN-05 | Phase 4 | Pending |
| JRNY-01 | Phase 5 | Pending |
| JRNY-02 | Phase 5 | Pending |
| JRNY-03 | Phase 5 | Pending |
| JRNY-04 | Phase 5 | Pending |
| JRNY-05 | Phase 5 | Pending |
| RCAP-01 | Phase 6 | Pending |
| RCAP-02 | Phase 6 | Pending |
| RCAP-03 | Phase 6 | Pending |
| RCAP-04 | Phase 6 | Pending |
| RCAP-05 | Phase 6 | Pending |
| RCAP-06 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-05*
*Last updated: 2026-03-05 after initialization*
