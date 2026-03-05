"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/" className="navbar-brand">
                    <span className="navbar-icon">🕌</span>
                    <span className="navbar-title">Jejak Masjid</span>
                </Link>

                {/* Desktop nav */}
                <div className="navbar-links">
                    <Link href="/map" className="navbar-link">
                        Peta Masjid
                    </Link>
                    <Link href="/journey" className="navbar-link">
                        Perjalanan
                    </Link>
                    <Link href="/login" className="navbar-link navbar-link--primary">
                        Masuk
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="navbar-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger ${isMenuOpen ? "hamburger--active" : ""}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="navbar-mobile">
                    <Link href="/map" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
                        Peta Masjid
                    </Link>
                    <Link href="/journey" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
                        Perjalanan
                    </Link>
                    <Link href="/login" className="navbar-mobile-link navbar-mobile-link--primary" onClick={() => setIsMenuOpen(false)}>
                        Masuk
                    </Link>
                </div>
            )}
        </nav>
    );
}
