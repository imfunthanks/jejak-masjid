"use client";

import Link from "next/link";
import { ArrowLeft, Map, Compass, Flame, ArrowRight, Camera } from "lucide-react";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import type { Mosque } from "@/lib/db/schema";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type CheckinData = {
    id: string;
    visitedAt: Date | null;
    mosque: Mosque;
};

/* ── Animated Counter Hook ── */
function useAnimatedCounter(target: number, duration = 1.5) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        if (target === 0) {
            setCount(0);
            return;
        }
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

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function JourneyClient({
    checkins,
    totalMosques,
    totalCities,
    userName
}: {
    checkins: CheckinData[],
    totalMosques: number,
    totalCities: number,
    userName: string
}) {
    const mosquesCounter = useAnimatedCounter(totalMosques);

    // Calculate ring offsets
    const mosqueProgress = Math.min((totalMosques / 30), 1);
    const mosqueOffset = 264 - (264 * mosqueProgress);

    // calculate current streak (naive implementation: count consecutive days backwards from easiest assumption)
    // for visual flair we just show "Active" or a simulated number if there are any checkins
    const streakCount = totalMosques > 0 ? "Active" : "None";

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
                    <Link href="/map" className="w-10 h-10 bg-white rounded-full shadow-[var(--shadow-sm)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors border border-[var(--border-light)] shrink-0">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="title-font font-bold text-xl text-[var(--color-primary-dark)] leading-tight">{userName}&apos;s Passport</h1>
                        <p className="text-xs font-medium text-[var(--text-muted)] tracking-wider uppercase">Spiritual Journey</p>
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
                            <Flame size={16} fill="currentColor" /> {streakCount}
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Stat 1 — Animated ring + counter */}
                        <motion.div variants={fadeUp} className="bg-transparent p-8 rounded-2xl border border-[var(--border-light)] flex flex-col items-center justify-center text-center transition-colors duration-500 hover:bg-white">
                            <AnimatedRing color="var(--color-primary)" targetOffset={mosqueOffset}>
                                <span ref={mosquesCounter.ref} className="font-serif text-4xl text-[var(--text-primary)]">{mosquesCounter.count}</span>
                            </AnimatedRing>
                            <h3 className="font-medium text-lg text-[var(--text-primary)]">Masjid Dikunjungi</h3>
                            <p className="text-sm text-[var(--text-secondary)] mt-1 font-light">Eksplorasi Bandung</p>
                        </motion.div>

                        {/* Recap Banner — minimal */}
                        <motion.div
                            variants={fadeUp}
                            className="bg-transparent p-8 rounded-2xl border border-[var(--border-light)] flex flex-col justify-center text-center transition-colors duration-500 hover:bg-white"
                        >
                            <Camera size={32} className="mx-auto mb-5 text-[var(--color-primary)] stroke-1" />
                            <h3 className="font-serif text-2xl font-normal mb-3 text-[var(--text-primary)] tracking-tight">Kilas Balik</h3>
                            <p className="text-[var(--text-secondary)] text-[0.95rem] font-light leading-relaxed mb-6 px-4">
                                Lihat cerita dari setiap langkah dan stempel paspor yang telah kamu kumpulkan.
                            </p>
                            <Link href="/wrapped" className="mx-auto w-max px-8 py-3 bg-[var(--text-primary)] text-white font-medium rounded-xl text-[0.95rem] hover:bg-black transition-colors flex items-center justify-center gap-2">
                                Buka Cerita <ArrowRight size={16} />
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
                            <Link href="/map" className="text-sm font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                                <Map size={16} /> View Map
                            </Link>
                        </motion.div>
                    </div>

                    <div className="relative pl-6">
                        <div className="absolute top-2 bottom-6 left-[11px] w-[2px] bg-gradient-to-b from-[var(--border-medium)] to-[var(--bg-main)]" />

                        {checkins.length === 0 ? (
                            <motion.div variants={fadeUp} className="text-center p-12 bg-white rounded-[var(--radius-xl)] border border-[var(--border-light)] relative z-10 ml-6">
                                <p className="text-[var(--text-secondary)] text-lg mb-4">Belum ada kunjungan masjid.</p>
                                <Link href="/map" className="btn btn-primary inline-flex">Cari Masjid Terdekat</Link>
                            </motion.div>
                        ) : (
                            checkins.map((item, i) => {
                                const visitDate = item.visitedAt ? new Date(item.visitedAt) : new Date();
                                const dateStr = format(visitDate, "PPP, HH:mm", { locale: id });
                                const isNewest = i === 0;

                                return (
                                    <motion.div
                                        key={item.id}
                                        variants={fadeUp}
                                        className="relative mb-10 pl-8"
                                    >
                                        <div className={`absolute left-[3px] top-1.5 w-[18px] h-[18px] bg-white border-4 ${isNewest ? "border-[var(--color-primary)]" : "border-[var(--border-medium)]"} rounded-full shadow-[var(--shadow-sm)] z-10`} />
                                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">{dateStr}</p>
                                        <div className="bg-white p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border-light)] flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-[var(--shadow-md)] transition-shadow relative overflow-hidden">
                                            {/* Passport Stamp Overlay Effect */}
                                            {isNewest && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 1.1 }}
                                                    animate={{ opacity: 0.05, scale: 1 }}
                                                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                                >
                                                    <div className="border border-[var(--text-primary)] text-[var(--text-primary)] rounded-full w-32 h-32 flex items-center justify-center font-medium text-lg uppercase tracking-[0.2em] border-[2px]">
                                                        VISITED
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="w-full md:w-32 h-32 md:h-24 bg-[var(--bg-surface)] flex items-center justify-center rounded-[var(--radius-md)] border border-white/40 shadow-inner">
                                                <span className="text-4xl drop-shadow-md">🕌</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="title-font text-xl font-bold text-[var(--text-primary)] mb-1">{item.mosque.name}</h3>
                                                <p className="text-[var(--text-secondary)] text-sm flex items-center gap-2"><Compass size={14} /> {item.mosque.city}, {item.mosque.province}</p>
                                            </div>
                                            {item.mosque.category && (
                                                <div className="px-4 py-2 bg-[var(--bg-main)] text-[var(--color-primary-dark)] text-xs font-bold rounded-full border border-[var(--border-light)] uppercase tracking-wide">
                                                    {item.mosque.category}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
