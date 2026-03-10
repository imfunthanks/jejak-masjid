"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    if (pathname?.includes("-prototype")) {
        return null;
    }

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <span className="footer-icon">🕌</span>
                    <span className="footer-title">Jejak Masjid</span>
                    <p className="footer-tagline">
                        Platform eksplorasi masjid dan pelacakan perjalanan spiritual Ramadan. 100% open source.
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h3 className="footer-heading">Navigasi</h3>
                        <Link href="/map" className="footer-link">Peta Masjid</Link>
                        <Link href="/feed" className="footer-link">Feed Komunitas</Link>
                        <Link href="/passport" className="footer-link">Passport</Link>
                        <Link href="/journey" className="footer-link">Perjalanan</Link>
                        <Link href="/recap" className="footer-link">Recap Ramadan</Link>
                        <Link href="/tentang" className="footer-link">Tentang</Link>
                    </div>
                    <div className="footer-column">
                        <h3 className="footer-heading">Open Source</h3>
                        <a href="https://github.com/imfunthanks/jejak-masjid" className="footer-link" target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                        <a href="https://github.com/imfunthanks/jejak-masjid/issues" className="footer-link" target="_blank" rel="noopener noreferrer">
                            Kontribusi
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Jejak Masjid. 100% Open Source.</p>
                    <p className="footer-url">jejak-masjid-62zo.vercel.app</p>
                </div>
            </div>
        </footer>
    );
}
