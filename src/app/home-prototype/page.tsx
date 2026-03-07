"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

/* ── Animation Variants ── */
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    }),
};

const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const cardReveal: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function HomePrototype() {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">

            {/* ── Floating Nav ── */}
            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-4 w-[90%] max-w-5xl bg-[rgba(253,253,249,0.85)] backdrop-blur-xl border border-[var(--border-light)] rounded-[var(--radius-pill)] shadow-[var(--shadow-md)]"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🕌</span>
                    <span className="font-bold text-xl title-font text-[var(--color-primary-dark)] tracking-tight">Jejak Masjid</span>
                </div>
                <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[var(--text-secondary)]">
                    <Link href="/home-prototype" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
                    <Link href="/map-prototype" className="hover:text-[var(--color-primary)] transition-colors">Map Explore</Link>
                    <Link href="/journey-prototype" className="hover:text-[var(--color-primary)] transition-colors">My Journey</Link>
                </div>
                <div className="flex items-center">
                    <Link href="/map-prototype" className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[var(--radius-pill)] font-semibold text-sm hover:translate-y-[-2px] hover:shadow-[var(--shadow-floating)] transition-all duration-300">
                        Launch
                    </Link>
                </div>
            </motion.nav>

            {/* ── Massive Hero Section ── */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
                {/* Animated background glow */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-accent-light)] blur-[120px] rounded-full pointer-events-none"
                />

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    {/* Badge */}
                    <motion.span
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--border-light)] shadow-[var(--shadow-sm)] text-[var(--color-accent-dark)] font-bold text-xs uppercase tracking-widest mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                        Ramadan Collection
                    </motion.span>

                    {/* Headline */}
                    <motion.h1
                        custom={1}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="title-font text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] text-[var(--color-primary-dark)] tracking-tight mb-8"
                    >
                        How many mosques will you{" "}
                        <span className="italic font-light text-[var(--color-accent-dark)]">visit</span>{" "}
                        this Ramadan?
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        custom={2}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mb-12 leading-relaxed"
                    >
                        Track your mosque visits, explore beautiful architecture, and share your spiritual journey in a calm space.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        custom={3}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row items-center gap-6"
                    >
                        <Link href="/map-prototype" className="px-8 py-4 bg-[var(--color-primary)] text-white rounded-[var(--radius-pill)] font-semibold text-lg hover:-translate-y-1 hover:shadow-[var(--shadow-floating)] transition-all duration-400 flex items-center gap-3 group">
                            Start Your Journey
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link href="/journey-prototype" className="px-8 py-4 bg-white text-[var(--text-primary)] rounded-[var(--radius-pill)] font-semibold text-lg hover:-translate-y-1 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-400 border border-[var(--border-light)]">
                            View Dashboard
                        </Link>
                    </motion.div>
                </div>

                {/* Map Preview Teaser — scroll-triggered */}
                <motion.div
                    initial={{ opacity: 0, y: 60, rotate: -2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-24 relative w-full max-w-6xl mx-auto rounded-[var(--radius-xl)] bg-white p-2 shadow-[var(--shadow-lg)] border border-[var(--border-light)]"
                >
                    <div className="w-full aspect-[21/9] bg-[#eef1ed] rounded-[var(--radius-lg)] overflow-hidden relative border border-[var(--border-light)] flex items-center justify-center">
                        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#eef1ed] z-10 pointer-events-none" />
                        {/* Animated map pins */}
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[30%] left-[40%] bg-white p-1 rounded-full shadow-[var(--shadow-md)] z-20">
                            <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full" />
                        </motion.div>
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-[60%] left-[60%] bg-white p-1 rounded-full shadow-[var(--shadow-md)] z-20">
                            <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full" />
                        </motion.div>
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[45%] left-[20%] bg-white p-1 rounded-full shadow-[var(--shadow-md)] z-20">
                            <div className="w-3 h-3 bg-[var(--text-muted)] rounded-full" />
                        </motion.div>
                        <div className="relative z-30 px-6 py-4 bg-white/80 backdrop-blur-md border border-white/50 shadow-[var(--shadow-sm)] rounded-2xl text-[var(--color-primary-dark)] font-medium text-lg">
                            Explore 100+ Historic Mosques
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── Features Grid — Scroll-triggered stagger ── */}
            <section className="py-24 px-6 bg-white">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {[
                        { num: "1", title: "Explore & Discover", desc: "Find beautiful mosques near you on an interactive, distraction-free map." },
                        { num: "2", title: "Check In", desc: "Record your visits with a single satisfying tap. Build a timeline of your spiritual journey.", offset: true },
                        { num: "3", title: "Track Progress", desc: "View your Ramadan streaks and total cities explored in beautifully crafted metrics." },
                        { num: "4", title: "Share Recap", desc: "Generate a gorgeous geometric card detailing your accomplishments for social media.", offset: true },
                    ].map((card) => (
                        <motion.div
                            key={card.num}
                            variants={cardReveal}
                            className={`flex flex-col gap-4 p-8 rounded-[var(--radius-lg)] bg-[var(--bg-main)] border border-[var(--border-light)] hover:-translate-y-2 hover:shadow-[var(--shadow-md)] transition-all duration-500 ${card.offset ? "lg:translate-y-6" : ""}`}
                        >
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[var(--shadow-sm)] text-2xl font-serif text-[var(--color-primary)]">
                                {card.num}
                            </div>
                            <h3 className="title-font text-xl font-bold text-[var(--text-primary)]">{card.title}</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">{card.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── Calm Footer ── */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="py-16 text-center border-t border-[var(--border-light)] bg-[var(--bg-main)]"
            >
                <div className="flex items-center justify-center gap-2 text-2xl opacity-60 hover:opacity-100 transition-opacity mb-4">🕌</div>
                <p className="title-font text-[var(--color-primary-dark)] text-lg font-medium">Jejak Masjid</p>
                <p className="text-[var(--text-muted)] text-sm mt-2">Built for the global Muslim community. Ramadan 1447H.</p>
            </motion.footer>

        </div>
    );
}
