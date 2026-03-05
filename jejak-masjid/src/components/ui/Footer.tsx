import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <span className="footer-icon">🕌</span>
                    <span className="footer-title">Jejak Masjid</span>
                    <p className="footer-tagline">
                        Spiritual exploration + Progress tracking + Community inspiration
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h3 className="footer-heading">Navigasi</h3>
                        <Link href="/map" className="footer-link">Peta Masjid</Link>
                        <Link href="/journey" className="footer-link">Perjalanan</Link>
                    </div>
                    <div className="footer-column">
                        <h3 className="footer-heading">Open Source</h3>
                        <a href="https://github.com" className="footer-link" target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                        <a href="https://github.com" className="footer-link" target="_blank" rel="noopener noreferrer">
                            Kontribusi
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Jejak Masjid. 100% Open Source.</p>
                    <p className="footer-url">jejakmasjid.com</p>
                </div>
            </div>
        </footer>
    );
}
