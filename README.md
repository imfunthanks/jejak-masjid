<div align="center">
  <h1>🕌 Jejak Masjid</h1>
  <p><strong>Explore mosques. Track your spiritual journey.</strong></p>
  <p>A calm, map-based web application to explore mosques, check in visits, and visualize your spiritual journey during Ramadan.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-Black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="MIT License" />
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  </p>
</div>

<br />

## 📱 Project Preview

Jejak Masjid offers a serene and engaging user interface designed for spiritual reflection. 

* **Map Exploration:** A beautifully rendered interactive map highlighting mosques around Bandung.
* **Mosque Passport:** A digital logbook that records each of your visits.
* **Ramadan Recap Page:** A beautifully generated summary of your spiritual journey throughout the holy month.

Users can effortlessly navigate the map to discover new mosques, click to "check in" upon visiting, and look back at a tangible record of their spiritual path.

---

## 💡 Why This Project Exists

During Ramadan, many people make the effort to visit different mosques—seeking new atmospheres for Taraweeh, Itikaf, or daily prayers. However, they rarely have a way to reflect on or visualize this beautiful journey.

Jejak Masjid was built to solve this. It provides a peaceful, personal space for Muslims to track their mosque visits and meaningfully reflect on their spiritual exploration across the city.

---

## ✨ Features

* 🌍 **Explore mosques** around Bandung on a highly interactive map
* 📍 **Check in** easily when visiting a new or familiar mosque
* 🔢 **Visualize your mosque journey** with distinct numbered map markers
* 🗓️ **Plan future mosque visits** based on location and proximity
* 🛂 **Track mosque visits** with a beautifully designed passport-style log
* 📇 **Generate Ramadan journey recap cards** to commemorate your achievements
* 🔗 **Share your progress** and meaningful moments with friends

---

## 🛠️ Tech Stack

Built with modern, robust, and performant technologies:

* **Next.js** - React framework for production
* **TypeScript** - Static typing for reliable code
* **Tailwind CSS** - Utility-first styling for a serene UI
* **Leaflet** - Open-source interactive map integration
* **PostgreSQL** - Powerful, open-source relational database
* **Drizzle ORM** - TypeScript ORM for type-safe database access

---

## 🏗️ Project Architecture

Jejak Masjid keeps the architecture simple, clean, and scalable:

* **Frontend** → Built with Next.js (React) using Server Components for speed and SEO.
* **API Layer** → Next.js Server routes handle secure data fetching and logic.
* **Database** → PostgreSQL (managed schema via Drizzle ORM) stores user journeys and mosque data.

---

## 🚀 Getting Started

Follow these steps to run Jejak Masjid locally on your machine.

1. **Clone the repository**
   ```bash
   git clone https://github.com/imfunthanks/jejak-masjid.git
   cd jejak-masjid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example environment file and configure your database variables.
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 🗺️ Roadmap

We are continuously improving Jejak Masjid to make it more meaningful for the community. Here are our upcoming focuses:

* [ ] Mosque passport system improvements (digital stamps, visit streaks)
* [ ] Ramadan journey recap storytelling (shareable Spotify-wrapped style summaries)
* [ ] Global mosque dataset (expanding beyond Bandung)

---

## 🤝 Contributing

We welcome all contributions! Whether it's adding new features, fixing bugs, or improving documentation, your help makes a difference.

If you have a feature idea or found a bug, please open an issue. Pull requests are highly encouraged. Jejak Masjid is an open-source project built *by* the community, *for* the community.

---

## 🕌 Community Purpose

Jejak Masjid is more than just an app; it is a community initiative intended to help people reconnect with their local mosques and reflect deeply on their spiritual journeys. As an open-source project, it represents our shared commitment to building technology that serves a higher purpose.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
