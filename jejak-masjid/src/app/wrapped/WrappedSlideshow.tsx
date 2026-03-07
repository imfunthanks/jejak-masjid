"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import { Camera, Download, Film, Loader2, Twitter, MessageCircle } from "lucide-react";
import html2canvas from "html2canvas";

/* ─────────────────────────────────────────────
   MOCK MOSQUE DATA (journey map — same as recap)
   ───────────────────────────────────────────── */
const VISITED_MOSQUES = [
    { id: "m1", name: "Masjid Raya Bandung", lat: -6.9218, lng: 107.607, order: 1 },
    { id: "m2", name: "Masjid Salman ITB", lat: -6.8934, lng: 107.6102, order: 2 },
    { id: "m3", name: "Pusdai Jawa Barat", lat: -6.8996, lng: 107.6322, order: 3 },
    { id: "m4", name: "Masjid Al-Ukhuwwah", lat: -6.9126, lng: 107.608, order: 4 },
    { id: "m5", name: "Masjid Cipaganti", lat: -6.908, lng: 107.6015, order: 5 },
    { id: "m6", name: "Masjid Istiqamah", lat: -6.9046, lng: 107.6163, order: 6 },
    { id: "m7", name: "Masjid Al-Imtizaj", lat: -6.9185, lng: 107.6054, order: 7 },
    { id: "m8", name: "Masjid Lautze 2", lat: -6.9189, lng: 107.6186, order: 8 },
    { id: "m9", name: "Masjid Trans Studio", lat: -6.9261, lng: 107.6366, order: 9 },
    { id: "m10", name: "Masjid Al-Lathiif", lat: -6.9056, lng: 107.6318, order: 10 },
    { id: "m11", name: "Masjid Daarut Tauhiid", lat: -6.8654, lng: 107.5898, order: 11 },
    { id: "m12", name: "Masjid Al-Furqon UPI", lat: -6.8601, lng: 107.5902, order: 12 },
];

/* Coordinate mapping */
const LAT_MIN = -6.96, LAT_MAX = -6.84, LNG_MIN = 107.57, LNG_MAX = 107.72;
const SVG_W = 400, SVG_H = 400, PAD = 30;

function toSVG(lat: number, lng: number): [number, number] {
    return [
        PAD + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (SVG_W - PAD * 2),
        PAD + ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * (SVG_H - PAD * 2),
    ];
}

function buildPathD(): string {
    const pts = VISITED_MOSQUES.map(m => toSVG(m.lat, m.lng));
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
        const [x, y] = pts[i], [px, py] = pts[i - 1];
        d += ` C ${px + (x - px) * 0.4} ${py}, ${px + (x - px) * 0.6} ${y}, ${x} ${y}`;
    }
    return d;
}

/* ── Animation Variants ── */
const slideVariants: Variants = {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: "easeIn" } },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.25, delayChildren: 0.3 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Counter Hook ── */
function useCountUp(target: number, duration: number, active: boolean) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!active) { setValue(0); return; }
        const start = Date.now();
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration, active]);
    return value;
}

/* ─────────────────────────────────────────────
   COMPONENT PROPS
   ───────────────────────────────────────────── */
type Badge = { emoji: string; title: string; desc: string };

type WrappedSlideshowProps = {
    userName: string;
    totalMosques: number;
    totalCities: number;
    topMosque: { name: string; city: string; count: number } | null;
    streakCount: number;
    badges: Badge[];
};

const TOTAL_SLIDES = 7;

/* ═══════════════════════════════════════════════
   WRAPPED SLIDESHOW
   ═══════════════════════════════════════════════ */
export default function WrappedSlideshow({ userName, totalMosques, totalCities, topMosque, streakCount, badges }: WrappedSlideshowProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [gifProgress, setGifProgress] = useState<number | null>(null);


    const isLastSlide = currentSlide === TOTAL_SLIDES - 1;

    const nextSlide = useCallback(() => {
        if (currentSlide < TOTAL_SLIDES - 1) setCurrentSlide(prev => prev + 1);
    }, [currentSlide]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => Math.max(0, prev - 1));
    }, []);

    /* Counter for slide 1 */
    const mosqueCount = useCountUp(totalMosques, 1800, currentSlide === 1);
    const cityCount = useCountUp(totalCities, 1200, currentSlide === 4);
    const streakCountAnim = useCountUp(streakCount, 1200, currentSlide === 4);

    /* ── Download current slide as PNG ── */
    const handleDownloadPNG = useCallback(async () => {
        const el = document.getElementById("wrapped-export-area");
        if (!el) return;
        try {
            const canvas = await html2canvas(el, { scale: 3, backgroundColor: null, useCORS: true, logging: false });
            const link = document.createElement("a");
            link.download = `jejak-wrapped-${userName.toLowerCase().replace(/\s+/g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) { console.error("Export failed:", err); }
    }, [userName]);

    /* ── Download animated GIF ── */
    const handleDownloadGIF = useCallback(async () => {
        if (gifProgress !== null) return;
        setGifProgress(0);
        try {
            const el = document.getElementById("wrapped-export-area");
            if (!el) throw new Error("No export area");

            const GIF = (await import("gif.js")).default;
            const gif = new GIF({ workers: 2, quality: 10, width: 540, height: 540, workerScript: "/gif.worker.js" });

            // Capture current slide as static GIF frames (hold for 3s)
            const canvas = await html2canvas(el, { scale: 540 / el.offsetWidth, backgroundColor: null, useCORS: true, logging: false });
            // Add as multiple frames for a short animated hold
            for (let i = 0; i < 20; i++) {
                gif.addFrame(canvas, { copy: true, delay: 150 });
                setGifProgress(Math.round((i / 20) * 80));
            }

            gif.on("progress", (p: number) => setGifProgress(80 + Math.round(p * 20)));
            gif.on("finished", (blob: Blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = `jejak-wrapped-${userName.toLowerCase().replace(/\s+/g, "-")}.gif`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                setGifProgress(null);
            });
            gif.render();
        } catch (err) { console.error("GIF export failed:", err); setGifProgress(null); }
    }, [userName, gifProgress]);

    /* ── Share ── */
    const handleShareX = useCallback(() => {
        const text = encodeURIComponent(`Ramadan ini, aku sudah mengunjungi ${totalMosques} masjid! 🕌✨ Lihat perjalanan Ramadanku!\n\n#JejakRamadan #JejakMasjid`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, "_blank");
    }, [totalMosques]);

    const handleShareWA = useCallback(() => {
        const text = encodeURIComponent(`Ramadan ini, aku sudah mengunjungi ${totalMosques} masjid! 🕌✨ #JejakRamadan\n${window.location.href}`);
        window.open(`https://wa.me/?text=${text}`, "_blank");
    }, [totalMosques]);

    const pathD = buildPathD();
    const markers = VISITED_MOSQUES.map(m => ({ ...m, pos: toSVG(m.lat, m.lng) }));

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex flex-col">
            {/* ── Progress Bars ── */}
            <div className="absolute top-5 left-5 right-5 flex gap-1.5 z-50 max-w-xl mx-auto">
                {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                    <div key={i} className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden" style={{ background: currentSlide === 0 ? "rgba(255,255,255,0.2)" : "var(--border-medium)" }}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: currentSlide === 0 ? "rgba(255,255,255,0.8)" : "var(--color-primary)" }}
                            initial={{ width: 0 }}
                            animate={{ width: i <= currentSlide ? "100%" : "0%" }}
                            transition={{ duration: i === currentSlide && !isLastSlide ? 6 : 0.4, ease: "linear" }}
                            onAnimationComplete={() => {
                                if (i === currentSlide && !isLastSlide) nextSlide();
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* ── Tap Navigation ── */}
            <div className="absolute inset-0 z-40 flex">
                <div className="w-1/3 h-full cursor-pointer" onClick={prevSlide} />
                <div className="w-2/3 h-full cursor-pointer" onClick={isLastSlide ? undefined : nextSlide} />
            </div>

            <AnimatePresence initial={false} mode="wait">
                {/* ═══════════════════════════════════════
                    SLIDE 0: WELCOME (Dark Emerald)
                ═══════════════════════════════════════ */}
                {currentSlide === 0 && (
                    <motion.div
                        key="s0" id="wrapped-export-area"
                        variants={slideVariants} initial="enter" animate="center" exit="exit"
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                        style={{ background: "linear-gradient(160deg, #0a2e1f 0%, #0f4430 40%, #154d38 100%)" }}
                    >
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-md relative z-10">
                            <motion.div variants={fadeUp} className="mb-8">
                                <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/15 text-emerald-300/80 bg-white/5 backdrop-blur-sm">
                                    Ramadan 1447H
                                </span>
                            </motion.div>
                            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-normal mb-5 leading-[1.1] tracking-tight text-white">
                                Assalamualaikum,<br />{userName}.
                            </motion.h1>
                            <motion.p variants={fadeUp} className="text-lg md:text-xl text-emerald-200/70 font-light leading-relaxed">
                                Mari sejenak melihat kembali perjalanan spiritualmu bulan ini.
                            </motion.p>
                            {/* Decorative dots */}
                            <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-2">
                                {[0, 1, 2].map(i => (
                                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400/40" />
                                ))}
                            </motion.div>
                        </motion.div>
                        {/* Subtle radial glow */}
                        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(16, 185, 129, 0.06) 0%, transparent 70%)" }} />
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════
                    SLIDE 1: MOSQUE COUNT (Big Number)
                ═══════════════════════════════════════ */}
                {currentSlide === 1 && (
                    <motion.div
                        key="s1" id="wrapped-export-area"
                        variants={slideVariants} initial="enter" animate="center" exit="exit"
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[var(--bg-main)] text-center"
                    >
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-sm relative z-10">
                            <motion.p variants={fadeUp} className="text-base text-[var(--text-secondary)] mb-3 font-light">
                                Kamu telah singgah di
                            </motion.p>
                            <motion.div
                                variants={scaleIn}
                                className="font-serif text-[120px] md:text-[160px] font-normal leading-none text-[var(--color-primary)] mb-2 tracking-tight"
                            >
                                {mosqueCount}
                            </motion.div>
                            <motion.h2 variants={fadeUp} className="text-2xl font-semibold text-[var(--text-primary)] mb-8">
                                Masjid Berbeda
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-sm text-[var(--text-muted)] font-light leading-relaxed max-w-xs mx-auto">
                                Setiap langkah menuju masjid adalah ibadah yang terukir dalam perjalananmu.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════
                    SLIDE 2: TOP MOSQUE (Featured Card)
                ═══════════════════════════════════════ */}
                {currentSlide === 2 && (
                    <motion.div
                        key="s2" id="wrapped-export-area"
                        variants={slideVariants} initial="enter" animate="center" exit="exit"
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[var(--bg-surface)] text-center"
                    >
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-md relative z-10 w-full">
                            <motion.p variants={fadeUp} className="text-[11px] mb-8 font-bold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
                                Masjid Paling Sering Dikunjungi
                            </motion.p>
                            {topMosque ? (
                                <motion.div variants={scaleIn} className="bg-white rounded-[24px] p-8 shadow-[var(--shadow-md)] border border-[var(--border-light)] mx-auto max-w-sm">
                                    <div className="text-5xl mb-5">🕌</div>
                                    <h2 className="font-serif text-3xl md:text-4xl font-normal mb-3 leading-tight text-[var(--text-primary)] tracking-tight">
                                        {topMosque.name}
                                    </h2>
                                    <p className="text-base text-[var(--text-secondary)] font-light mb-6">
                                        📍 {topMosque.city}
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold">
                                        {topMosque.count}× Kunjungan
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.p variants={fadeUp} className="font-serif text-2xl text-[var(--text-secondary)]">
                                    Belum ada masjid favorit.
                                </motion.p>
                            )}
                        </motion.div>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════
                    SLIDE 3: JOURNEY MAP (Strava Style)
                ═══════════════════════════════════════ */}
                {currentSlide === 3 && (
                    <motion.div
                        key="s3" id="wrapped-export-area"
                        variants={slideVariants} initial="enter" animate="center" exit="exit"
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[var(--bg-main)] text-center"
                    >
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-sm w-full relative z-10">
                            <motion.p variants={fadeUp} className="text-[11px] mb-5 font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                                Peta Perjalananmu
                            </motion.p>

                            {/* SVG Map */}
                            <motion.div variants={scaleIn} className="bg-[#EDECE8] rounded-[20px] overflow-hidden shadow-[var(--shadow-md)] border border-[var(--border-light)] mb-5">
                                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full">
                                    <rect width={SVG_W} height={SVG_H} fill="#EDECE8" />
                                    {/* Grid */}
                                    {Array.from({ length: 9 }).map((_, i) => (
                                        <g key={i}>
                                            <line x1={i * (SVG_W / 8)} y1={0} x2={i * (SVG_W / 8)} y2={SVG_H} stroke="#D9D8D4" strokeWidth={0.5} opacity={0.4} />
                                            <line x1={0} y1={i * (SVG_H / 8)} x2={SVG_W} y2={i * (SVG_H / 8)} stroke="#D9D8D4" strokeWidth={0.5} opacity={0.4} />
                                        </g>
                                    ))}
                                    {/* Roads */}
                                    <path d="M 0 220 Q 100 190, 200 210 T 400 195" stroke="#CBC9C4" strokeWidth={2} fill="none" opacity={0.35} />
                                    <path d="M 60 0 Q 90 140, 140 280 T 250 400" stroke="#CBC9C4" strokeWidth={1.5} fill="none" opacity={0.3} />
                                    {/* Heatmap */}
                                    <defs>
                                        <radialGradient id="hg2"><stop offset="0%" stopColor="#059669" stopOpacity={0.5} /><stop offset="100%" stopColor="#059669" stopOpacity={0} /></radialGradient>
                                    </defs>
                                    {markers.slice(0, 4).map((m, i) => (
                                        <circle key={`h-${i}`} cx={m.pos[0]} cy={m.pos[1]} r={35 + i * 4} fill="url(#hg2)" opacity={0.12} />
                                    ))}
                                    {/* Journey Path */}
                                    <motion.path
                                        d={pathD}
                                        fill="none" stroke="#059669" strokeWidth={2} strokeLinecap="round" opacity={0.7}
                                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                        transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
                                    />
                                    {/* Markers */}
                                    {markers.map((m, i) => (
                                        <motion.g key={m.id}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.8 + i * 0.15, duration: 0.35, type: "spring", stiffness: 300, damping: 20 }}
                                            style={{ transformOrigin: `${m.pos[0]}px ${m.pos[1]}px` }}
                                        >
                                            <circle cx={m.pos[0]} cy={m.pos[1]} r={10} fill="#059669" stroke="#fff" strokeWidth={2} />
                                            <text x={m.pos[0]} y={m.pos[1] + 1} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={m.order > 9 ? 7 : 8} fontWeight={700} fontFamily="Inter, system-ui, sans-serif">{m.order}</text>
                                        </motion.g>
                                    ))}
                                    <text x={SVG_W - 10} y={SVG_H - 10} textAnchor="end" fill="#A3A39E" fontSize={9} fontWeight={600} fontFamily="Inter, system-ui" opacity={0.5}>BANDUNG</text>
                                </svg>
                            </motion.div>

                            <motion.p variants={fadeUp} className="text-sm text-[var(--text-secondary)] font-light">
                                {totalMosques} masjid di {totalCities} kota
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════
                    SLIDE 4: STREAK & STATS
                ═══════════════════════════════════════ */}
                {currentSlide === 4 && (
                    <motion.div
                        key="s4" id="wrapped-export-area"
                        variants={slideVariants} initial="enter" animate="center" exit="exit"
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                        style={{ background: "#F2F4EF" }}
                    >
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-md w-full relative z-10">
                            <motion.h2 variants={fadeUp} className="font-serif text-4xl font-normal mb-10 leading-tight text-[var(--text-primary)] tracking-tight">
                                Menjaga Konsistensi
                            </motion.h2>

                            {/* Streak Hero */}
                            <motion.div variants={scaleIn} className="bg-white rounded-[20px] p-6 shadow-[var(--shadow-sm)] border border-[var(--border-light)] mb-4 flex items-center justify-between">
                                <div className="text-left">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">Streak Kunjungan</div>
                                    <div className="font-serif text-5xl text-[var(--color-accent-dark)]">{streakCountAnim}</div>
                                </div>
                                <span className="text-5xl">🔥</span>
                            </motion.div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div variants={fadeUp} className="bg-white rounded-[16px] p-5 shadow-[var(--shadow-sm)] border border-[var(--border-light)] text-left">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">Kota Dieksplorasi</div>
                                    <div className="font-serif text-4xl text-[var(--color-primary)]">{cityCount}</div>
                                </motion.div>
                                <motion.div variants={fadeUp} className="bg-white rounded-[16px] p-5 shadow-[var(--shadow-sm)] border border-[var(--border-light)] text-left">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">Total Kunjungan</div>
                                    <div className="font-serif text-4xl text-[var(--text-primary)]">{totalMosques}</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════
                    SLIDE 5: BADGES / ACHIEVEMENTS
                ═══════════════════════════════════════ */}
                {currentSlide === 5 && (
                    <motion.div
                        key="s5" id="wrapped-export-area"
                        variants={slideVariants} initial="enter" animate="center" exit="exit"
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[var(--bg-main)] text-center"
                    >
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-md w-full relative z-10">
                            <motion.p variants={fadeUp} className="text-[11px] mb-3 font-bold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
                                Pencapaianmu
                            </motion.p>
                            <motion.h2 variants={fadeUp} className="font-serif text-3xl font-normal mb-8 text-[var(--text-primary)] tracking-tight">
                                Badges yang Kamu Raih
                            </motion.h2>

                            <div className="grid grid-cols-2 gap-3">
                                {badges.map((badge, i) => (
                                    <motion.div
                                        key={i}
                                        variants={scaleIn}
                                        className="wrapped-badge bg-white rounded-[16px] p-5 shadow-[var(--shadow-sm)] text-left"
                                    >
                                        <span className="text-3xl mb-3 block">{badge.emoji}</span>
                                        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-0.5">{badge.title}</h3>
                                        <p className="text-xs text-[var(--text-muted)] font-light">{badge.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════
                    SLIDE 6: OUTRO + SHARE
                ═══════════════════════════════════════ */}
                {currentSlide === 6 && (
                    <motion.div
                        key="s6" id="wrapped-export-area"
                        variants={slideVariants} initial="enter" animate="center" exit="exit"
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                        style={{ background: "linear-gradient(160deg, #0a2e1f 0%, #0f4430 40%, #154d38 100%)" }}
                    >
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-md w-full relative z-50 flex flex-col items-center">
                            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-normal mb-3 leading-tight text-white tracking-tight">
                                Jejakmu, Ceritamu.
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-base text-emerald-200/70 font-light mb-10">
                                Bagikan perjalanan spiritualmu ke dunia.
                            </motion.p>

                            {/* Share buttons */}
                            <motion.div variants={fadeUp} className="w-full max-w-xs flex flex-col gap-3 pointer-events-auto">
                                {/* Recap CTA */}
                                <Link href="/recap" className="w-full py-3.5 bg-white text-[#0f4430] rounded-2xl font-semibold flex items-center justify-center gap-2.5 hover:bg-emerald-50 transition-colors text-sm">
                                    <Camera size={16} />
                                    Lihat Recap Card
                                </Link>

                                {/* Download row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={handleDownloadPNG} className="py-3 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-medium flex items-center justify-center gap-2 border border-white/10 transition-colors text-sm cursor-pointer">
                                        <Download size={14} />
                                        PNG
                                    </button>
                                    <button onClick={handleDownloadGIF} disabled={gifProgress !== null} className="py-3 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-white rounded-2xl font-medium flex items-center justify-center gap-2 border border-white/10 transition-colors text-sm cursor-pointer">
                                        {gifProgress !== null ? <><Loader2 size={14} className="animate-spin" />{gifProgress}%</> : <><Film size={14} />GIF</>}
                                    </button>
                                </div>

                                {/* Social share */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={handleShareX} className="py-3 bg-transparent text-white/80 hover:text-white rounded-2xl font-medium flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 transition-all text-sm cursor-pointer">
                                        <Twitter size={14} />
                                        Share to X
                                    </button>
                                    <button onClick={handleShareWA} className="py-3 bg-transparent text-white/80 hover:text-white rounded-2xl font-medium flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 transition-all text-sm cursor-pointer">
                                        <MessageCircle size={14} />
                                        WhatsApp
                                    </button>
                                </div>
                            </motion.div>

                            {/* Decorative bottom */}
                            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-2">
                                <span className="text-lg">🕌</span>
                                <span className="text-sm text-emerald-300/50 font-semibold tracking-wide">Jejak Masjid</span>
                            </motion.div>
                        </motion.div>
                        {/* Glow */}
                        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(16, 185, 129, 0.06) 0%, transparent 70%)" }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
