"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Download, Film, Loader2, Twitter, MessageCircle, MapPin, Calendar } from "lucide-react";
import html2canvas from "html2canvas";

/* ─── Types ─── */
type MosqueVisit = {
    id: string;
    name: string;
    city: string;
    category: string;
    lat: number;
    lng: number;
    visitedAt: string;
    order: number;
};

type PassportCardProps = {
    userName: string;
    visits: MosqueVisit[];
    totalMosques: number;
};

/* ─── Coordinate Mapping ─── */
const LAT_MIN = -6.98, LAT_MAX = -6.82, LNG_MIN = 107.50, LNG_MAX = 107.78;
const SVG_W = 500, SVG_H = 500, PAD = 35;

function toSVG(lat: number, lng: number): [number, number] {
    return [
        PAD + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (SVG_W - PAD * 2),
        PAD + ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * (SVG_H - PAD * 2),
    ];
}

function buildPathD(visits: MosqueVisit[]): string {
    const pts = visits.map(m => toSVG(m.lat, m.lng));
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
        const [x, y] = pts[i], [px, py] = pts[i - 1];
        d += ` C ${px + (x - px) * 0.4} ${py}, ${px + (x - px) * 0.6} ${y}, ${x} ${y}`;
    }
    return d;
}

/* ─── Animation Variants ─── */
const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ── GIF Rendering ── */
const GIF_SIZE = 540;
const TOTAL_FRAMES = 36;
const FRAME_DELAY = 80;

function easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

function drawGifFrame(ctx: CanvasRenderingContext2D, frameIndex: number, totalFrames: number, visits: MosqueVisit[], userName: string) {
    const progress = frameIndex / (totalFrames - 1);
    const w = GIF_SIZE, h = GIF_SIZE;
    const S = GIF_SIZE / SVG_W;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = "#EDECE8";
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "#D9D8D4";
    ctx.lineWidth = 0.5 * S;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 12; i++) {
        const pos = i * (w / 11);
        ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(w, pos); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Road curves
    ctx.strokeStyle = "#CBC9C4";
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2 * S;
    ctx.beginPath();
    ctx.moveTo(0, 320 * S); ctx.quadraticCurveTo(150 * S, 280 * S, 300 * S, 310 * S); ctx.quadraticCurveTo(450 * S, 340 * S, 600 * S, 290 * S);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Journey path
    const markerPositions = visits.map(m => ({ ...m, pos: toSVG(m.lat, m.lng) }));
    const pathProgress = easeOut(Math.min(progress * 2, 1));
    if (pathProgress > 0 && markerPositions.length > 1) {
        const points = markerPositions.map(m => m.pos);
        const totalSegments = points.length - 1;
        const segmentsToDraw = pathProgress * totalSegments;
        ctx.strokeStyle = "#059669";
        ctx.lineWidth = 2.5 * S;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(points[0][0] * S, points[0][1] * S);
        for (let i = 0; i < totalSegments; i++) {
            if (i >= segmentsToDraw) break;
            const segProgress = Math.min(segmentsToDraw - i, 1);
            const [px, py] = points[i];
            const [nx, ny] = points[i + 1];
            if (segProgress >= 1) {
                const cx1 = px + (nx - px) * 0.4;
                const cy1 = py;
                const cx2 = px + (nx - px) * 0.6;
                const cy2 = ny;
                ctx.bezierCurveTo(cx1 * S, cy1 * S, cx2 * S, cy2 * S, nx * S, ny * S);
            } else {
                const endX = px + (nx - px) * segProgress;
                const endY = py + (ny - py) * segProgress;
                ctx.lineTo(endX * S, endY * S);
            }
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    // Markers
    const markerStartProgress = 0.25;
    const markerEndProgress = 0.75;
    markerPositions.forEach((m, i) => {
        const markerT = (progress - markerStartProgress - (i / markerPositions.length) * (markerEndProgress - markerStartProgress));
        const markerProgress = Math.max(0, Math.min(1, markerT / 0.08));
        if (markerProgress <= 0) return;
        const scale = easeOut(markerProgress);
        const cx = m.pos[0] * S, cy = m.pos[1] * S;
        ctx.globalAlpha = scale;
        ctx.fillStyle = "#059669";
        ctx.beginPath(); ctx.arc(cx, cy, 12 * S * scale, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5 * S;
        ctx.beginPath(); ctx.arc(cx, cy, 12 * S * scale, 0, Math.PI * 2); ctx.stroke();
        if (markerProgress > 0.5) {
            ctx.globalAlpha = Math.min(1, (markerProgress - 0.5) * 4);
            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${(m.order > 9 ? 9 : 10) * S}px Inter, system-ui, sans-serif`;
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(String(m.order), cx, cy + 1 * S);
        }
    });

    ctx.globalAlpha = 1;

    // Watermark
    ctx.fillStyle = "#A3A39E";
    ctx.globalAlpha = 0.6;
    ctx.font = `600 ${11 * S}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "end";
    ctx.fillText("BANDUNG, INDONESIA", (SVG_W - 16) * S, (SVG_H - 16) * S);

    // Overlay card
    const overlayProgress = easeOut(Math.max(0, (progress - 0.7) / 0.3));
    if (overlayProgress > 0) {
        const cardX = 16 * S, cardY = h - 130 * S + (20 * S * (1 - overlayProgress));
        const cardW = w - 32 * S, cardH = 110 * S, r = 20 * S;
        ctx.globalAlpha = 0.88 * overlayProgress;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(cardX + r, cardY); ctx.lineTo(cardX + cardW - r, cardY);
        ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
        ctx.lineTo(cardX + cardW, cardY + cardH - r);
        ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
        ctx.lineTo(cardX + r, cardY + cardH);
        ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
        ctx.lineTo(cardX, cardY + r);
        ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
        ctx.closePath(); ctx.fill();

        ctx.globalAlpha = overlayProgress;
        ctx.font = `bold ${11 * S}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = "#164e36"; ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText("🕌  JEJAK MASJID", cardX + 20 * S, cardY + 16 * S);
        ctx.font = `normal ${16 * S}px Georgia, serif`;
        ctx.fillStyle = "#242422";
        ctx.fillText(`Paspor Masjid ${userName}`, cardX + 20 * S, cardY + 36 * S);
        ctx.font = `500 ${12 * S}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = "#6B6B66";
        ctx.fillText(`${visits.length} masjid dikunjungi`, cardX + 20 * S, cardY + 68 * S);
    }
    ctx.globalAlpha = 1;
}

/* ═══════════════════════════════════════════
   PASSPORT CARD COMPONENT
   ═══════════════════════════════════════════ */
export default function PassportCard({ userName, visits, totalMosques }: PassportCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);
    const [gifProgress, setGifProgress] = useState<number | null>(null);

    useEffect(() => {
        if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
    }, []);

    const pathD = buildPathD(visits);
    const markers = visits.map(m => ({ ...m, pos: toSVG(m.lat, m.lng) }));

    /* ── Download PNG ── */
    const handleDownloadPNG = useCallback(async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null, useCORS: true, logging: false });
            const link = document.createElement("a");
            link.download = `jejak-paspor-${userName.toLowerCase().replace(/\s+/g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) { console.error("Export failed:", err); }
    }, [userName]);

    /* ── Download animated GIF ── */
    const handleDownloadGIF = useCallback(async () => {
        if (gifProgress !== null) return;
        setGifProgress(0);
        try {
            const GIF = (await import("gif.js")).default;
            const gif = new GIF({ workers: 2, quality: 10, width: GIF_SIZE, height: GIF_SIZE, workerScript: "/gif.worker.js" });
            const offscreen = document.createElement("canvas");
            offscreen.width = GIF_SIZE; offscreen.height = GIF_SIZE;
            const ctx = offscreen.getContext("2d")!;

            for (let i = 0; i < TOTAL_FRAMES; i++) {
                drawGifFrame(ctx, i, TOTAL_FRAMES, visits, userName);
                gif.addFrame(ctx, { copy: true, delay: FRAME_DELAY });
                setGifProgress(Math.round((i / TOTAL_FRAMES) * 80));
            }
            // Hold frames
            for (let i = 0; i < 8; i++) {
                drawGifFrame(ctx, TOTAL_FRAMES - 1, TOTAL_FRAMES, visits, userName);
                gif.addFrame(ctx, { copy: true, delay: FRAME_DELAY });
            }

            gif.on("progress", (p: number) => setGifProgress(80 + Math.round(p * 20)));
            gif.on("finished", (blob: Blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = `jejak-paspor-${userName.toLowerCase().replace(/\s+/g, "-")}.gif`;
                link.href = url; link.click();
                URL.revokeObjectURL(url);
                setGifProgress(null);
            });
            gif.render();
        } catch (err) { console.error("GIF export failed:", err); setGifProgress(null); }
    }, [userName, visits, gifProgress]);

    /* ── Share ── */
    const handleShareX = useCallback(() => {
        const text = encodeURIComponent(`Aku sudah mengunjungi ${visits.length} masjid di Bandung! 🕌✨ Lihat paspor masjidku!\n\n#JejakMasjid #JejakRamadan`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, "_blank");
    }, [visits.length]);

    const handleShareWA = useCallback(() => {
        const text = encodeURIComponent(`Aku sudah mengunjungi ${visits.length} masjid di Bandung! 🕌✨ #JejakMasjid\n${window.location.href}`);
        window.open(`https://wa.me/?text=${text}`, "_blank");
    }, [visits.length]);

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
        } catch { return dateStr; }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col items-center pt-6 pb-24 px-4 relative">
            {/* Back nav */}
            <motion.div
                initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="w-full max-w-[520px] mb-5 flex items-center justify-between relative z-10"
            >
                <Link href="/map" className="w-9 h-9 bg-white rounded-full shadow-[var(--shadow-sm)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors border border-[var(--border-light)]">
                    <ArrowLeft size={18} />
                </Link>
                <span className="text-xs font-semibold text-[var(--text-muted)] tracking-[0.15em] uppercase">
                    Paspor Masjid
                </span>
                <div className="w-9" />
            </motion.div>

            {/* ═══ SHAREABLE MAP CARD ═══ */}
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="relative z-10 w-full max-w-[520px] bg-[#F7F6F3] rounded-[28px] overflow-hidden"
                style={{ boxShadow: "0 12px 48px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)" }}
            >
                {/* SVG Map */}
                <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
                    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <rect width={SVG_W} height={SVG_H} fill="#EDECE8" />
                        {/* Grid */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <g key={`grid-${i}`}>
                                <line x1={i * (SVG_W / 11)} y1={0} x2={i * (SVG_W / 11)} y2={SVG_H} stroke="#D9D8D4" strokeWidth={0.5} opacity={0.5} />
                                <line x1={0} y1={i * (SVG_H / 11)} x2={SVG_W} y2={i * (SVG_H / 11)} stroke="#D9D8D4" strokeWidth={0.5} opacity={0.5} />
                            </g>
                        ))}
                        {/* Roads */}
                        <path d="M 0 320 Q 150 280, 300 310 T 600 290" stroke="#CBC9C4" strokeWidth={2.5} fill="none" opacity={0.4} />
                        <path d="M 80 0 Q 120 200, 200 400 T 350 600" stroke="#CBC9C4" strokeWidth={2} fill="none" opacity={0.35} />
                        <path d="M 400 0 Q 380 150, 420 350 T 500 600" stroke="#CBC9C4" strokeWidth={1.8} fill="none" opacity={0.3} />

                        {/* Heatmap zones */}
                        <defs>
                            <radialGradient id="heatGradPassport">
                                <stop offset="0%" stopColor="#059669" stopOpacity={0.5} />
                                <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                            </radialGradient>
                        </defs>
                        {markers.slice(0, 5).map((m, i) => (
                            <circle key={`heat-${i}`} cx={m.pos[0]} cy={m.pos[1]} r={45 + i * 5} fill="url(#heatGradPassport)" opacity={0.15} />
                        ))}

                        {/* Journey path */}
                        <path
                            ref={pathRef}
                            d={pathD}
                            fill="none" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.7}
                            style={pathLength ? { strokeDasharray: pathLength, strokeDashoffset: 0, animation: "drawPath 2.5s ease-out forwards" } : undefined}
                        />

                        {/* Mosque markers */}
                        {markers.map((m, i) => (
                            <g key={m.id}>
                                <motion.circle cx={m.pos[0]} cy={m.pos[1]} r={18} fill="rgba(5, 150, 105, 0.08)"
                                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8 + i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ transformOrigin: `${m.pos[0]}px ${m.pos[1]}px` }}
                                />
                                <motion.circle cx={m.pos[0]} cy={m.pos[1]} r={12} fill="#059669" stroke="#ffffff" strokeWidth={2.5}
                                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.85 + i * 0.12, duration: 0.35, type: "spring", stiffness: 300, damping: 20 }}
                                    style={{ transformOrigin: `${m.pos[0]}px ${m.pos[1]}px` }}
                                />
                                <motion.text x={m.pos[0]} y={m.pos[1] + 1} textAnchor="middle" dominantBaseline="central" fill="white"
                                    fontSize={m.order > 9 ? 9 : 10} fontWeight={700} fontFamily="Inter, system-ui, sans-serif"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 + i * 0.12 }}
                                >{m.order}</motion.text>
                            </g>
                        ))}

                        <text x={SVG_W - 16} y={SVG_H - 16} textAnchor="end" fill="#A3A39E" fontSize={11} fontWeight={600}
                            fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.08em" opacity={0.6}>
                            BANDUNG, INDONESIA
                        </text>
                    </svg>

                    {/* Overlay Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
                        className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-[20px] p-5 border border-white/60"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">🕌</span>
                            <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.12em]">Jejak Masjid</span>
                        </div>
                        <h2 className="font-serif text-xl text-[var(--text-primary)] tracking-tight leading-tight mb-2">
                            Paspor Masjid {userName}
                        </h2>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-[#059669]" />
                                <span className="font-bold text-[var(--text-primary)]">{visits.length}</span>
                                <span className="text-[var(--text-secondary)]">dari {totalMosques} masjid</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Journey Strip */}
                <motion.div
                    variants={stagger} initial="hidden" animate="visible"
                    className="px-4 py-4 border-t border-[#E5E4E0] overflow-x-auto flex gap-2"
                >
                    {visits.map((m) => (
                        <motion.div key={m.id} variants={fadeUp}
                            className="flex items-center gap-2 shrink-0 bg-white rounded-full pl-1.5 pr-3.5 py-1.5 border border-[var(--border-light)] shadow-[var(--shadow-sm)]"
                        >
                            <span className="w-6 h-6 rounded-full bg-[#059669] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{m.order}</span>
                            <span className="text-xs font-medium text-[var(--text-primary)] whitespace-nowrap">{m.name}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* ═══ PASSPORT HISTORY ═══ */}
            <motion.div
                variants={stagger} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="w-full max-w-[520px] mt-10"
            >
                <motion.h2 variants={fadeUp} className="font-serif text-2xl font-normal text-[var(--text-primary)] mb-6 tracking-tight">
                    Riwayat Stempel
                </motion.h2>

                {visits.length === 0 ? (
                    <motion.div variants={fadeUp} className="text-center py-12 bg-white rounded-2xl border border-[var(--border-light)]">
                        <p className="text-[var(--text-secondary)] mb-4">Belum ada kunjungan masjid.</p>
                        <Link href="/map" className="text-[var(--color-primary)] font-semibold hover:underline">Mulai Eksplorasi →</Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {visits.map((visit) => (
                            <motion.div key={`${visit.id}-${visit.order}`} variants={fadeUp}
                                className="bg-white rounded-2xl p-4 border border-[var(--border-light)] flex items-center gap-4 hover:shadow-[var(--shadow-sm)] transition-shadow"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    {visit.order}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">{visit.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-0.5">
                                        <span className="flex items-center gap-1"><MapPin size={10} /> {visit.city}</span>
                                        <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(visit.visitedAt)}</span>
                                    </div>
                                </div>
                                <div className="px-2.5 py-1 bg-[var(--bg-surface)] text-[var(--color-primary-dark)] text-[10px] font-bold rounded-full uppercase">
                                    {visit.category}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* ═══ SHARE BUTTONS ═══ */}
            <motion.div
                variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="w-full max-w-[520px] mt-8 flex flex-col gap-3 relative z-10"
            >
                <div className="grid grid-cols-2 gap-3">
                    <motion.button onClick={handleDownloadPNG} variants={fadeUp}
                        className="py-3.5 bg-[var(--text-primary)] text-white hover:bg-black rounded-2xl font-medium shadow-[var(--shadow-sm)] flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm">
                        <Download size={15} /> Gambar (.png)
                    </motion.button>
                    <motion.button onClick={handleDownloadGIF} disabled={gifProgress !== null} variants={fadeUp}
                        className="py-3.5 bg-[#059669] text-white hover:bg-[#047857] disabled:opacity-70 disabled:cursor-wait rounded-2xl font-medium shadow-[var(--shadow-sm)] flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm">
                        {gifProgress !== null ? (<><Loader2 size={15} className="animate-spin" />{gifProgress}%</>) : (<><Film size={15} />Animasi (.gif)</>)}
                    </motion.button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <motion.button onClick={handleShareX} variants={fadeUp}
                        className="py-3.5 bg-white text-[var(--text-primary)] rounded-2xl font-medium flex items-center justify-center gap-2 border border-[var(--border-light)] hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-sm)] transition-all cursor-pointer text-sm">
                        <Twitter size={15} /> Share to X
                    </motion.button>
                    <motion.button onClick={handleShareWA} variants={fadeUp}
                        className="py-3.5 bg-white text-[var(--text-primary)] rounded-2xl font-medium flex items-center justify-center gap-2 border border-[var(--border-light)] hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-sm)] transition-all cursor-pointer text-sm">
                        <MessageCircle size={15} /> WhatsApp
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
