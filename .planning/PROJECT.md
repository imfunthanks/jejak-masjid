# Jejak Masjid

## What This Is

Jejak Masjid is a Ramadan mosque journey tracker that lets Muslims discover mosques on a map, check in their visits, track their Ramadan progress, and share their journey as a visual recap card. It's a blend of spiritual exploration, progress tracking, and community inspiration — not just a mosque database. Built as an open-source MVP targeting 48-hour development.

## Core Value

Users can discover mosques, check in visits, and see their Ramadan journey grow — creating a personal spiritual travel log that motivates daily mosque visits.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Interactive mosque map with markers and clustering
- [ ] Mosque check-in system with one-tap recording
- [ ] Journey dashboard showing visit stats (mosques visited, cities explored, streak)
- [ ] Shareable Ramadan recap card (PNG image generation)
- [ ] User authentication (sign up, login, session management)
- [ ] Mosque seed data (100 Indonesian mosques across categories)
- [ ] Share journey recap to X, WhatsApp, or download

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Mosque passport / achievements system — post-MVP enhancement
- Public user profiles — not needed for MVP, adds complexity
- Global mosque database — MVP focuses on Indonesian mosques only
- Mobile native app — web-first (PWA consideration for post-MVP)
- Real-time multiplayer features — not relevant for MVP
- Admin panel / mosque management UI — seed data is sufficient for MVP

## Context

- **Domain**: Islamic lifestyle / Ramadan engagement tool
- **Target audience**: Indonesian Muslims who visit mosques regularly during Ramadan
- **Growth loop**: Check-in → Journey stats → Recap card → Share on social → New users discover
- **Viral feature**: The shareable recap card (Satori-generated PNG) is the primary growth mechanism
- **Timing**: Must launch before or during Ramadan for maximum impact
- **Open source**: Repository will be public with contributing guidelines

## Constraints

- **Timeline**: 48 hours target development time — keep scope tight
- **Tech Stack**: Next.js (App Router), Tailwind CSS, Leaflet + OpenStreetMap, PostgreSQL, Drizzle ORM, NextAuth, Satori
- **Budget**: Zero infrastructure cost preferred (free tiers, OSM instead of Google Maps)
- **Data**: Seed 100 mosques initially; no user-submitted mosque data in MVP
- **Auth**: NextAuth with email/password — no OAuth in MVP

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Leaflet + OpenStreetMap over Google Maps | Free, no API key required, good enough for MVP | — Pending |
| Drizzle ORM over Prisma | Lighter, SQL-like syntax, better TypeScript types | — Pending |
| Satori for image generation | Runs on edge, no external service needed, generates from JSX | — Pending |
| NextAuth over custom auth | Battle-tested, quick setup, good Next.js integration | — Pending |
| PostgreSQL over SQLite | Scalable, Drizzle supports it well, free tiers available (Neon/Supabase) | — Pending |
| 100 seed mosques | Enough for MVP launch, avoids UGC complexity | — Pending |

---
*Last updated: 2026-03-05 after initialization*
