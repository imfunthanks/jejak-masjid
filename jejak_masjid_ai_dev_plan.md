# AI Development Execution Plan

## Project: Jejak Masjid -- Ramadan MVP

## 1. Development Goal

Build a **minimal but polished MVP** that allows users to:

1.  Discover mosques on a map\
2.  Check in mosque visits\
3.  Track their Ramadan mosque journey\
4.  Share their journey as a recap card

**Target development time:** 48 hours

Architecture must remain **simple, scalable, and open-source friendly**.

------------------------------------------------------------------------

# 2. High-Level System Architecture

System layers:

Frontend → API Layer → Database → Image Generation Service

### Tech Stack

**Frontend** - Next.js (App Router)

**Styling** - Tailwind CSS

**Map** - Leaflet + OpenStreetMap

**Database** - PostgreSQL

**ORM** - Drizzle ORM

**Authentication** - NextAuth

**Image Generation** - Vercel OG / Satori

**Deployment** - Docker (optional)

------------------------------------------------------------------------

# 3. Repository Structure

    jejak-masjid/
    │
    ├── app/                  # Next.js app router
    │   ├── page.tsx
    │   ├── map/
    │   ├── journey/
    │   ├── profile/
    │
    ├── components/
    │   ├── map/
    │   ├── mosque/
    │   ├── journey/
    │   ├── ui/
    │
    ├── lib/
    │   ├── db/
    │   ├── auth/
    │   ├── utils/
    │
    ├── server/
    │   ├── api/
    │   ├── services/
    │
    ├── scripts/
    │   ├── seedMosques.ts
    │
    ├── public/
    │
    └── drizzle/

------------------------------------------------------------------------

# 4. Development Phases

Development will happen in **5 phases**.

------------------------------------------------------------------------

# Phase 1 --- Project Setup

### Tasks

Initialize Next.js project

    npx create-next-app

Install dependencies

    tailwind
    leaflet
    drizzle
    postgres
    next-auth

Configure:

-   Tailwind
-   Environment variables
-   Project structure

Create base layout:

-   Navbar
-   Footer
-   Container

**Output:** Working Next.js app.

------------------------------------------------------------------------

# Phase 2 --- Database Setup

### Tables

**Users**

    id
    email
    name
    avatar
    created_at

**Mosques**

    id
    name
    city
    province
    latitude
    longitude
    category

**Checkins**

    id
    user_id
    mosque_id
    visited_at

### Tasks

1.  Setup PostgreSQL connection
2.  Configure Drizzle ORM
3.  Define schema
4.  Create migrations
5.  Run migrations

### Seed Data

Create seed script:

    scripts/seedMosques.ts

Seed:

    100 mosques

Example categories:

-   historic
-   iconic
-   campus

------------------------------------------------------------------------

# Phase 3 --- Mosque Map Feature

This is the **core UI**.

### Tasks

Create map component

    components/map/MosqueMap.tsx

Features:

-   render Leaflet map
-   load mosque markers
-   cluster markers
-   clickable markers

Marker click:

    open mosque card

Mosque card includes:

    mosque name
    city
    check-in button

### API Endpoint

    GET /api/mosques

Returns:

    list of mosques

------------------------------------------------------------------------

# Phase 4 --- Check-in System

### User Flow

User clicks mosque → Press Check-in → Check-in saved → UI confirmation

### API Endpoint

    POST /api/checkin

Payload:

    mosque_id
    user_id
    timestamp

### Response

    success
    updated stats

### UI Feedback

Toast message:

    Check-in recorded!

------------------------------------------------------------------------

# Phase 5 --- Journey Dashboard

Create page:

    /journey

Display user stats.

### Stats

Calculate:

    mosques visited
    cities explored
    current streak

### UI Layout

    Journey Stats
    Visited Map
    Mosque List

Example UI:

    My Ramadan Journey

    12 mosques visited
    4 cities explored
    🔥 5 day streak

------------------------------------------------------------------------

# Phase 6 --- Journey Recap Card

This is the **viral feature**.

### Generate Image

Use:

    Satori

Endpoint:

    /api/recap

Input:

    user stats

Output:

    PNG image

### Card Content

Example:

    My Ramadan Mosque Journey

    12 mosques visited
    4 cities explored
    Longest streak: 5 days

Include:

    jejakmasjid.com

### Share Buttons

    Share to X
    Share to WhatsApp
    Download image

------------------------------------------------------------------------

# 5. UX Flow

Primary user flow:

Open website → View mosque map → Click mosque → Check-in → Progress
updated → Generate journey recap → Share

This creates the **growth loop**.

------------------------------------------------------------------------

# 6. Open Source Readiness

Before launch ensure:

README includes:

-   project overview
-   installation
-   contributing guide
-   roadmap

Create:

    CONTRIBUTING.md

Add labels:

    good first issue
    feature request
    bug

------------------------------------------------------------------------

# 7. Launch Strategy (Ramadan)

Launch message example:

Track your mosque journey this Ramadan.

-   Discover mosques
-   Check in your visits
-   See your Ramadan progress
-   Share your journey

100% open source.

Platforms:

-   GitHub
-   X
-   Reddit
-   Islamic tech communities

------------------------------------------------------------------------

# 8. Success Metrics

For MVP launch:

Target:

    100 users

Activity:

    1000 mosque check-ins

Key metrics:

    check-ins per user
    recap shares

------------------------------------------------------------------------

# 9. Post-MVP Improvements

Future roadmap:

-   Mosque passport
-   Achievements
-   Public profiles
-   Global mosque database
-   Mobile PWA

------------------------------------------------------------------------

# Final Principle

Jejak Masjid should feel like:

**Spiritual exploration + Progress tracking + Community inspiration**

Not just a mosque database.
