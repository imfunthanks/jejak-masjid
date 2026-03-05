# Roadmap: Jejak Masjid

**Created:** 2026-03-05
**Phases:** 6
**Requirements covered:** 30/30 ✓
**Granularity:** Standard

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Project Setup | Working Next.js app with database | SETUP-01..04 | 4 |
| 2 | Auth & Data | Users can sign up and mosque data available | AUTH-01..04, MOSQ-01..03 | 5 |
| 3 | Mosque Map | Interactive map with mosque markers | MAP-01..04 | 4 |
| 4 | Check-in System | Users can check in to mosques | CHKN-01..05 | 4 |
| 5 | Journey Dashboard | Users can view their journey stats | JRNY-01..05 | 4 |
| 6 | Recap & Share | Users can generate and share recap cards | RCAP-01..06 | 4 |

---

## Phase 1: Project Setup

**Goal:** Working Next.js application with database connection and base layout.

**Requirements:** SETUP-01, SETUP-02, SETUP-03, SETUP-04

**Success Criteria:**
1. `npm run dev` launches the Next.js app successfully on localhost
2. Database migrations run without errors and tables are created
3. Base layout (navbar, footer, container) renders on all pages
4. Environment variables load correctly for database and app settings

**Dependencies:** None (foundation phase)

---

## Phase 2: Auth & Mosque Data

**Goal:** Users can create accounts, log in, and mosque seed data is available in the database.

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, MOSQ-01, MOSQ-02, MOSQ-03

**Success Criteria:**
1. User can sign up with email/password and see their session persist after refresh
2. Protected routes redirect to login page for unauthenticated users
3. Seed script populates 100 mosques with correct categories
4. `GET /api/mosques` returns mosque list with coordinates
5. User can log out and be redirected to home page

**Dependencies:** Phase 1 (project structure, database)

---

## Phase 3: Mosque Map

**Goal:** Interactive map displays all seeded mosques with clickable markers.

**Requirements:** MAP-01, MAP-02, MAP-03, MAP-04

**Success Criteria:**
1. Leaflet map renders full-screen with OpenStreetMap tiles centered on Indonesia
2. All 100 mosque markers are visible, with marker clustering in dense areas
3. Clicking a marker shows mosque name, city, and a check-in button
4. Map is responsive and works on desktop and mobile viewports

**Dependencies:** Phase 2 (mosque data API)

---

## Phase 4: Check-in System

**Goal:** Authenticated users can check in to mosques and see confirmation.

**Requirements:** CHKN-01, CHKN-02, CHKN-03, CHKN-04, CHKN-05

**Success Criteria:**
1. Clicking check-in button on mosque card creates a check-in record
2. Toast notification confirms "Check-in recorded!" after success
3. Same-day duplicate check-ins to the same mosque are prevented
4. Check-in API returns updated visit stats

**Dependencies:** Phase 2 (auth), Phase 3 (map UI with check-in button)

---

## Phase 5: Journey Dashboard

**Goal:** Users can view their personal journey stats and visited mosque history.

**Requirements:** JRNY-01, JRNY-02, JRNY-03, JRNY-04, JRNY-05

**Success Criteria:**
1. Dashboard shows correct count of mosques visited and cities explored
2. Current streak calculation is accurate (consecutive days with check-ins)
3. Visited mosques are highlighted on a mini-map
4. List of visited mosques shows mosque name, city, and visit date

**Dependencies:** Phase 4 (check-in data)

---

## Phase 6: Recap Card & Sharing

**Goal:** Users can generate a visual recap card and share their Ramadan journey.

**Requirements:** RCAP-01, RCAP-02, RCAP-03, RCAP-04, RCAP-05, RCAP-06

**Success Criteria:**
1. `/api/recap` generates a styled PNG image with user's journey stats
2. Recap card includes mosques visited, cities explored, longest streak, and branding
3. Share to X (Twitter) opens pre-filled tweet with recap image
4. Share to WhatsApp opens pre-filled message with recap image

**Dependencies:** Phase 5 (journey stats data)

---

## Build Order

```
Phase 1 (Setup) → Phase 2 (Auth & Data) → Phase 3 (Map) → Phase 4 (Check-in) → Phase 5 (Dashboard) → Phase 6 (Recap)
```

Phases are sequential — each depends on the previous. Parallelization is not recommended for this project due to tight dependencies.

---
*Roadmap created: 2026-03-05*
*Last updated: 2026-03-05 after initialization*
