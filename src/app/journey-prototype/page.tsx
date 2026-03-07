"use client";

import Link from "next/link";
import { ArrowLeft, Map, Compass, Flame, ArrowRight, Camera } from "lucide-react";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ── Animated Counter Hook ── */
function useAnimatedCounter(target: number, duration = 1.5) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = target / (duration * 60); // ~60fps
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, target, duration]);

    return { count, ref };
}

/* ── Animated SVG Ring ── */
function AnimatedRing({ color, targetOffset, children }: { color: string; targetOffset: number; children: React.ReactNode }) {
    const ref = useRef<SVGCircleElement>(null);
    const isInView = useInView(ref as React.RefObject<Element>, { once: true });

    return (
        <div className="w-28 h-28 mb-4 rounded-full border-[6px] border-[var(--bg-surface)] flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
                <circle
                    ref={ref}
                    cx="48" cy="48" r="42"
                    className={`stroke-[6px] fill-transparent transition-all duration-[1.5s] ease-out`}
                    style={{
                        stroke: color,
                        strokeDasharray: 264,
                        strokeDashoffset: isInView ? targetOffset : 264,
                        strokeLinecap: "round",
                    }}
                />
            </svg>
            {children}
        </div>
    );
}

/* ── Variants ── */
const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function JourneyPrototypePage() {
    const mosques = useAnimatedCounter(12);
    const cities = useAnimatedCounter(4);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pb-24">

            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="sticky top-0 z-50 bg-[rgba(253,253,249,0.9)] backdrop-blur-xl border-b border-[var(--border-light)] px-6 py-4"
            >
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/home-prototype" className="w-10 h-10 bg-white rounded-full shadow-[var(--shadow-sm)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors border border-[var(--border-light)] shrink-0">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="title-font font-bold text-xl text-[var(--color-primary-dark)] leading-tight">My Journey</h1>
                        <p className="text-xs font-medium text-[var(--text-muted)] tracking-wider uppercase">Ramadan 1447H</p>
                    </div>
                </div>
            </motion.header>

            <main className="max-w-4xl mx-auto px-6 pt-10 flex flex-col gap-16">

                {/* ── Stats Section ── */}
                <motion.section
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <motion.h2 variants={fadeUp} className="title-font text-3xl font-bold text-[var(--text-primary)]">Overview</motion.h2>
                        <motion.div variants={fadeUp} className="px-4 py-1.5 bg-[var(--color-accent-light)]/20 text-[var(--color-accent-dark)] text-sm font-bold rounded-full border border-[var(--color-accent-light)]/40 flex items-center gap-2">
                            <Flame size={16} fill="currentColor" /> Day 5
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stat 1 — Animated ring + counter */}
                        <motion.div variants={fadeUp} className="bg-white p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] border border-[var(--border-light)] flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-transform duration-500">
                            <AnimatedRing color="var(--color-primary)" targetOffset={40}>
                                <span ref={mosques.ref} className="mono-font text-3xl font-bold text-[var(--color-primary-dark)]">{mosques.count}</span>
                            </AnimatedRing>
                            <h3 className="font-semibold text-lg text-[var(--text-primary)]">Mosques Visited</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-1">Goal: 30 during Ramadan</p>
                        </motion.div>

                        {/* Stat 2 */}
                        <motion.div variants={fadeUp} className="bg-white p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] border border-[var(--border-light)] flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-transform duration-500">
                            <AnimatedRing color="var(--color-accent)" targetOffset={180}>
                                <span ref={cities.ref} className="mono-font text-3xl font-bold text-[var(--color-accent-dark)]">{cities.count}</span>
                            </AnimatedRing>
                            <h3 className="font-semibold text-lg text-[var(--text-primary)]">Cities Explored</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-1">Across Indonesia</p>
                        </motion.div>

                        {/* Recap Banner — floating */}
                        <motion.div
                            variants={fadeUp}
                            className="bg-[var(--color-primary-dark)] p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] flex flex-col justify-between text-white relative overflow-hidden group"
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-12 -top-12 w-48 h-48 bg-[var(--color-primary-light)] blur-[60px] rounded-full opacity-30"
                            />
                            <div className="z-10">
                                <Camera size={32} className="mb-4 text-[var(--color-accent-light)]" />
                                <h3 className="title-font text-2xl font-bold mb-2">Generate Recap</h3>
                                <p className="text-white/70 text-sm leading-relaxed mb-6">Create a beautiful, shareable summary of your spiritual journey so far.</p>
                            </div>
                            <Link href="/recap-prototype" className="z-10 w-full py-3 bg-[var(--color-accent)] text-white font-bold rounded-full text-center hover:bg-[var(--color-accent-dark)] transition-colors shadow-[var(--shadow-md)] flex items-center justify-center gap-2">
                                View Card <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                </motion.section>

                {/* ── Passport Log — scroll-triggered ── */}
                <motion.section
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <motion.h2 variants={fadeUp} className="title-font text-3xl font-bold text-[var(--text-primary)]">Passport Log</motion.h2>
                        <motion.div variants={fadeUp}>
                            <Link href="/map-prototype" className="text-sm font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                                <Map size={16} /> View Map
                            </Link>
                        </motion.div>
                    </div>

                    <div className="relative pl-6">
                        <div className="absolute top-2 bottom-6 left-[11px] w-[2px] bg-gradient-to-b from-[var(--border-medium)] to-[var(--bg-main)]" />

                        {[
                            { time: "Today, 14:30 PM", name: "Istiqlal Grand Mosque", city: "Jakarta Pusat", img: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=300", tag: "Historic", active: true },
                            { time: "Yesterday, 19:00 PM", name: "Al-Azhar Great Mosque", city: "Jakarta Selatan", img: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=300", active: false },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                className="relative mb-10 pl-8"
                            >
                                <div className={`absolute left-[3px] top-1.5 w-[18px] h-[18px] bg-white border-4 ${item.active ? "border-[var(--color-primary)]" : "border-[var(--border-medium)]"} rounded-full shadow-[var(--shadow-sm)] z-10`} />
                                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">{item.time}</p>
                                <div className="bg-white p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border-light)] flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-[var(--shadow-md)] transition-shadow">
                                    <img src={item.img} alt="Masjid" className="w-full md:w-32 h-32 md:h-24 object-cover rounded-[var(--radius-md)]" />
                                    <div className="flex-1">
                                        <h3 className="title-font text-xl font-bold text-[var(--text-primary)] mb-1">{item.name}</h3>
                                        <p className="text-[var(--text-secondary)] text-sm flex items-center gap-2"><Compass size={14} /> {item.city}</p>
                                    </div>
                                    {item.tag && (
                                        <div className="px-4 py-2 bg-[var(--bg-main)] text-[var(--color-primary-dark)] text-xs font-bold rounded-full border border-[var(--border-light)]">
                                            {item.tag}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
