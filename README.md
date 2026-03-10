<div align="center">

# 🕌 Jejak Masjid

**Lacak Perjalanan Masjid Ramadanmu — Track Your Ramadan Mosque Journey**

An open-source, map-based web app for exploring mosques, checking in visits, and visualizing your spiritual journey during Ramadan in Bandung, Indonesia.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-jejak--masjid-1B6B4A?style=for-the-badge)](https://jejak-masjid-62zo.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

[🌐 Live Demo](https://jejak-masjid-62zo.vercel.app/) · [📖 Documentation](#-getting-started) · [🐛 Report Bug](https://github.com/imfunthanks/jejak-masjid/issues) · [💡 Request Feature](https://github.com/imfunthanks/jejak-masjid/issues)

</div>

---

## � Preview

| Peta Masjid Interaktif | Passport & Check-in | Ramadan Recap |
|:---:|:---:|:---:|
| ![Map](Map%20Prototype%20Final.jpg) | ![Journey](Journey%20Prototype%20Final.jpg) | ![Recap](Recap%20Prototype%20Final.jpg) |

---

## ❓ What is Jejak Masjid?

**Jejak Masjid** (literally "Mosque Footprint") is a free, open-source web application that helps Muslims in Bandung track their mosque visits during Ramadan. It combines an interactive map with a personal travel journal, creating a meaningful digital record of your spiritual exploration.

> **"Jejak Masjid is an open-source Ramadan mosque tracker that helps Muslims visualize their spiritual journey across Bandung's mosques."**

### Key Capabilities

- 🗺️ **Interactive Mosque Map** — Explore 100+ mosques across Bandung with detailed information
- 📍 **One-Tap Check-in** — Record visits instantly when you arrive at a mosque
- 🛂 **Digital Mosque Passport** — Beautiful stamp-style logbook of all your visits
- 📊 **Ramadan Journey Dashboard** — Visualize your mosque exploration progress
- 🎁 **Ramadan Wrapped** — Spotify-style yearly summary of your mosque visits
- 📷 **Community Feed** — Share photos and experiences from your mosque visits
- 🗓️ **Visit Planning** — Plan future mosque visits based on location
- 🌐 **Crowdsourced Data** — Community-driven mosque database with GPS contributions

---

## 💡 Why Jejak Masjid?

During Ramadan, many Muslims visit different mosques for Tarawih, Itikaf, and daily prayers. But there's no easy way to track or reflect on this spiritual journey.

**Jejak Masjid solves this by providing:**
1. A peaceful, personal space to record mosque visits
2. Visual maps showing your journey across the city
3. Beautiful recap cards to share with friends and family
4. A community-driven mosque database that grows with each user

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | [Next.js 16](https://nextjs.org/) | React framework with App Router & Server Components |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| **Maps** | [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/) | Interactive map rendering |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Relational data storage |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | Type-safe database queries |
| **Auth** | [NextAuth.js v5](https://authjs.dev/) | Authentication & sessions |
| **Storage** | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | Photo upload storage |
| **Hosting** | [Vercel](https://vercel.com/) | Serverless deployment |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | Smooth UI transitions |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **PostgreSQL** database (local or hosted, e.g., [Neon](https://neon.tech/), [Supabase](https://supabase.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/imfunthanks/jejak-masjid.git
cd jejak-masjid

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and NEXTAUTH_SECRET

# 4. Set up the database
npm run db:push
npm run db:seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Random secret for auth sessions | ✅ |
| `NEXTAUTH_URL` | App URL (e.g., `http://localhost:3000`) | ✅ |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | Optional |

---

## 🏗️ Project Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (checkin, mosques, feed)
│   ├── artikel/            # SEO content pages
│   ├── map/                # Interactive mosque map
│   ├── journey/            # Journey dashboard
│   ├── passport/           # Digital mosque passport
│   ├── recap/              # Ramadan recap generator
│   ├── wrapped/            # Wrapped-style summary
│   ├── feed/               # Community photo feed
│   ├── tentang/            # About page (E-E-A-T)
│   ├── robots.ts           # SEO robots.txt
│   ├── sitemap.ts          # SEO sitemap.xml
│   └── layout.tsx          # Root layout with JSON-LD schemas
├── components/
│   ├── home/               # Homepage components
│   ├── map/                # Map-related components
│   └── ui/                 # Shared UI (Navbar, Footer, Breadcrumbs)
├── db/                     # Database schema & connection
└── lib/                    # Utilities & helpers
```

---

## 🗺️ Roadmap

- [x] Interactive mosque map with 100+ locations
- [x] One-tap check-in system
- [x] Digital mosque passport
- [x] Ramadan Wrapped recap
- [x] Community photo feed
- [x] Crowdsourced mosque additions (GPS)
- [x] SEO optimization (robots.txt, sitemap, JSON-LD)
- [ ] Mosque passport digital stamps & visit streaks
- [ ] Global mosque dataset (expanding beyond Bandung)
- [ ] Multi-language support (English + Arabic)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are what make the open-source community amazing. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 🕌 Community & Purpose

Jejak Masjid is more than just an app — it's a community initiative to help Muslims reconnect with their local mosques and reflect on their spiritual journeys. As an open-source project, it represents our shared commitment to building technology that serves a higher purpose.

**Built with ❤️ for the Muslim community in Bandung, Indonesia.**

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 🔗 Links

- **Live App:** [jejak-masjid-62zo.vercel.app](https://jejak-masjid-62zo.vercel.app/)
- **GitHub:** [github.com/imfunthanks/jejak-masjid](https://github.com/imfunthanks/jejak-masjid)
- **Issues:** [Report a Bug](https://github.com/imfunthanks/jejak-masjid/issues)

---

<div align="center">
  <sub>Built with 🕌 by <a href="https://github.com/imfunthanks">imfunthanks</a> — Open Source for the Ummah</sub>
</div>
