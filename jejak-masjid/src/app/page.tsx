import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <span className="hero-badge">
          🌙 Ramadan Edition
        </span>
        <h1 className="hero-title">
          Jejak{" "}
          <span className="hero-title-highlight">Masjid</span>
        </h1>
        <p className="hero-subtitle">
          Jelajahi masjid, catat kunjunganmu, dan bagikan perjalanan Ramadanmu.
          Spiritual exploration meets progress tracking.
        </p>
        <div className="hero-actions">
          <Link href="/map" className="btn btn-primary">
            🗺️ Jelajahi Peta
          </Link>
          <Link href="/journey" className="btn btn-secondary">
            📊 Perjalananku
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">🗺️</span>
          <h3 className="feature-title">Peta Masjid</h3>
          <p className="feature-desc">
            Temukan masjid-masjid di Indonesia dalam peta interaktif. Dari masjid bersejarah
            hingga masjid kampus.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">✅</span>
          <h3 className="feature-title">Check-in</h3>
          <p className="feature-desc">
            Catat setiap kunjunganmu dengan satu tap. Bangun koleksi jejak masjidmu
            sepanjang Ramadan.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3 className="feature-title">Journey Dashboard</h3>
          <p className="feature-desc">
            Lihat statistik perjalananmu — masjid dikunjungi, kota dijelajahi,
            dan streak harianmu.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">🎴</span>
          <h3 className="feature-title">Recap Card</h3>
          <p className="feature-desc">
            Buat kartu recap perjalanan Ramadanmu yang cantik dan bagikan
            ke teman-temanmu.
          </p>
        </div>
      </section>
    </>
  );
}
