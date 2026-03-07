"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    if (pathname?.includes("-prototype")) {
        return null;
    }

    return (
        <div className="navbar-wrapper">
            <nav className="navbar glass-nav">
                <div className="navbar-container">
                    <Link href="/" className="navbar-brand">
                        <span className="navbar-icon">🕌</span>
                        <span className="navbar-title">Jejak Masjid</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="navbar-links">
                        <Link href="/map" className="navbar-link">
                            Explore
                        </Link>
                        <Link href="/passport" className="navbar-link">
                            Passport
                        </Link>
                        <Link href="/journey" className="navbar-link">
                            Journey
                        </Link>
                        {session ? (
                            <>
                                <Link href="/profile" className="navbar-link">
                                    Profile
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="navbar-link navbar-link--outline ml-2"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="navbar-link navbar-link--primary ml-2">
                                Masuk
                            </Link>
                        )}
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
                            Explore
                        </Link>
                        <Link href="/passport" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
                            Passport
                        </Link>
                        <Link href="/journey" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
                            Journey
                        </Link>
                        {session ? (
                            <>
                                <Link href="/profile" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
                                    Profile ({session.user?.name})
                                </Link>
                                <button
                                    onClick={() => { signOut({ callbackUrl: "/" }); setIsMenuOpen(false); }}
                                    className="navbar-mobile-link navbar-mobile-link--outline mt-4"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="navbar-mobile-link navbar-mobile-link--primary mt-4" onClick={() => setIsMenuOpen(false)}>
                                Masuk
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
}
