"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, ArrowLeft, Twitter, MessageCircle, Film, Loader2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import html2canvas from "html2canvas";

/* ─────────────────────────────────────────────
   MOCK MOSQUE DATA (matches MosqueMapInner.tsx)
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

/* Coordinate mapping constants */
const LAT_MIN = -6.96;
const LAT_MAX = -6.84;
const LNG_MIN = 107.57;
const LNG_MAX = 107.72;
const SVG_W = 600;
const SVG_H = 600;
const PAD = 40;

function toSVG(lat: number, lng: number): [number, number] {
    const x = PAD + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (SVG_W - PAD * 2);
    const y = PAD + ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * (SVG_H - PAD * 2);
    return [x, y];
}

/* Build the journey polyline path */
function buildPathD(): string {
    const points = VISITED_MOSQUES.map((m) => toSVG(m.lat, m.lng));
    if (points.length < 2) return "";
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i];
        const [px, py] = points[i - 1];
        const cx1 = px + (x - px) * 0.4;
        const cy1 = py;
        const cx2 = px + (x - px) * 0.6;
        const cy2 = y;
        d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
    }
    return d;
}

/* ─────────────── Animation Variants ─────────────── */
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

/* ─────────────────────────────────────────────
   GIF RENDERER — draws frames to canvas
   ───────────────────────────────────────────── */
const GIF_SIZE = 540; // px (good balance of quality + file size)
const TOTAL_FRAMES = 36;
const FRAME_DELAY = 80; // ms per frame
const MARKER_POSITIONS = VISITED_MOSQUES.map((m) => ({ ...m, pos: toSVG(m.lat, m.lng) }));

// Scale factor: SVG_W → GIF_SIZE
const S = GIF_SIZE / SVG_W;

function easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

function drawGifFrame(ctx: CanvasRenderingContext2D, frameIndex: number, totalFrames: number, overlay: {
    userName: string; totalMosques: number; streakCount: number; totalCities: number; mostVisited: string;
}) {
    const progress = frameIndex / (totalFrames - 1); // 0 → 1
    const w = GIF_SIZE;
    const h = GIF_SIZE;

    ctx.clearRect(0, 0, w, h);

    // ── Background ──
    ctx.fillStyle = "#EDECE8";
    ctx.fillRect(0, 0, w, h);

    // ── Grid lines ──
    ctx.strokeStyle = "#D9D8D4";
    ctx.lineWidth = 0.5 * S;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 12; i++) {
        const pos = i * (w / 11);
        ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(w, pos); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ── Road curves ──
    ctx.strokeStyle = "#CBC9C4";
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2 * S;
    // Simplified road curves
    ctx.beginPath();
    ctx.moveTo(0, 320 * S);
    ctx.quadraticCurveTo(150 * S, 280 * S, 300 * S, 310 * S);
    ctx.quadraticCurveTo(450 * S, 340 * S, 600 * S, 290 * S);
    ctx.stroke();
    ctx.lineWidth = 1.5 * S;
    ctx.beginPath();
    ctx.moveTo(80 * S, 0);
    ctx.quadraticCurveTo(120 * S, 200 * S, 200 * S, 400 * S);
    ctx.quadraticCurveTo(280 * S, 600 * S, 350 * S, 600 * S);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── Heatmap zones ──
    MARKER_POSITIONS.slice(0, 5).forEach((m, i) => {
        const grad = ctx.createRadialGradient(m.pos[0] * S, m.pos[1] * S, 0, m.pos[0] * S, m.pos[1] * S, (45 + i * 5) * S);
        grad.addColorStop(0, "rgba(5, 150, 105, 0.08)");
        grad.addColorStop(1, "rgba(5, 150, 105, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.pos[0] * S, m.pos[1] * S, (45 + i * 5) * S, 0, Math.PI * 2);
        ctx.fill();
    });

    // ── Journey path (progressive draw) ──
    const pathProgress = easeOut(Math.min(progress * 2, 1)); // draw path in first half
    if (pathProgress > 0) {
        const points = VISITED_MOSQUES.map((m) => toSVG(m.lat, m.lng));
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
            const cx1 = px + (nx - px) * 0.4;
            const cy1 = py;
            const cx2 = px + (nx - px) * 0.6;
            const cy2 = ny;

            if (segProgress >= 1) {
                ctx.bezierCurveTo(cx1 * S, cy1 * S, cx2 * S, cy2 * S, nx * S, ny * S);
            } else {
                // Partial segment — approximate with lerp
                const t = segProgress;
                const endX = px + (nx - px) * t;
                const endY = py + (ny - py) * t;
                ctx.lineTo(endX * S, endY * S);
            }
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    // ── Markers (appear sequentially in second half of animation) ──
    const markerStartProgress = 0.25; // markers start appearing at 25%
    const markerEndProgress = 0.75;   // all markers visible at 75%

    MARKER_POSITIONS.forEach((m, i) => {
        const markerT = (progress - markerStartProgress - (i / MARKER_POSITIONS.length) * (markerEndProgress - markerStartProgress));
        const markerProgress = Math.max(0, Math.min(1, markerT / 0.08));

        if (markerProgress <= 0) return;

        const scale = easeOut(markerProgress);
        const cx = m.pos[0] * S;
        const cy = m.pos[1] * S;

        // Glow ring
        ctx.globalAlpha = 0.08 * scale;
        ctx.fillStyle = "#059669";
        ctx.beginPath();
        ctx.arc(cx, cy, 18 * S * scale, 0, Math.PI * 2);
        ctx.fill();

        // Marker circle
        ctx.globalAlpha = scale;
        ctx.fillStyle = "#059669";
        ctx.beginPath();
        ctx.arc(cx, cy, 12 * S * scale, 0, Math.PI * 2);
        ctx.fill();

        // White border
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5 * S;
        ctx.beginPath();
        ctx.arc(cx, cy, 12 * S * scale, 0, Math.PI * 2);
        ctx.stroke();

        // Number
        if (markerProgress > 0.5) {
            ctx.globalAlpha = Math.min(1, (markerProgress - 0.5) * 4);
            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${(m.order > 9 ? 9 : 10) * S}px Inter, system-ui, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(m.order), cx, cy + 1 * S);
        }
    });

    ctx.globalAlpha = 1;

    // ── "BANDUNG, INDONESIA" watermark ──
    ctx.fillStyle = "#A3A39E";
    ctx.globalAlpha = 0.6;
    ctx.font = `600 ${11 * S}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "end";
    ctx.textBaseline = "alphabetic";
    ctx.letterSpacing = "0.08em";
    ctx.fillText("BANDUNG, INDONESIA", (SVG_W - 16) * S, (SVG_H - 16) * S);
    ctx.globalAlpha = 1;

    // ── Overlay card (fades in last 30% of animation) ──
    const overlayProgress = easeOut(Math.max(0, (progress - 0.7) / 0.3));
    if (overlayProgress > 0) {
        const cardX = 16 * S;
        const cardY = h - 170 * S + (20 * S * (1 - overlayProgress));
        const cardW = w - 32 * S;
        const cardH = 150 * S;
        const r = 20 * S;

        ctx.globalAlpha = 0.88 * overlayProgress;
        ctx.fillStyle = "#ffffff";

        // Rounded rect
        ctx.beginPath();
        ctx.moveTo(cardX + r, cardY);
        ctx.lineTo(cardX + cardW - r, cardY);
        ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
        ctx.lineTo(cardX + cardW, cardY + cardH - r);
        ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
        ctx.lineTo(cardX + r, cardY + cardH);
        ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
        ctx.lineTo(cardX, cardY + r);
        ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
        ctx.closePath();
        ctx.fill();

        // Card shadow
        ctx.shadowColor = "rgba(0,0,0,0.06)";
        ctx.shadowBlur = 24 * S;
        ctx.shadowOffsetY = 4 * S;
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.globalAlpha = overlayProgress;

        // "🕌 JEJAK MASJID"
        ctx.font = `bold ${11 * S}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = "#164e36";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("🕌  JEJAK MASJID", cardX + 20 * S, cardY + 16 * S);

        // Title
        ctx.font = `normal ${18 * S}px Georgia, serif`;
        ctx.fillStyle = "#242422";
        ctx.fillText(`Perjalanan Ramadan ${overlay.userName}`, cardX + 20 * S, cardY + 36 * S);

        // Stats
        ctx.font = `500 ${12 * S}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = "#6B6B66";
        const statsText = `${overlay.totalMosques} masjid  ·  🔥 ${overlay.streakCount} hari streak  ·  ${overlay.totalCities} kota`;
        ctx.fillText(statsText, cardX + 20 * S, cardY + 68 * S);

        // Divider
        ctx.strokeStyle = "#EBEBE8";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cardX + 20 * S, cardY + 90 * S);
        ctx.lineTo(cardX + cardW - 20 * S, cardY + 90 * S);
        ctx.stroke();

        // Masjid favorit label
        ctx.font = `600 ${9 * S}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = "#A3A39E";
        ctx.fillText("MASJID FAVORIT", cardX + 20 * S, cardY + 102 * S);

        // Masjid favorit value
        ctx.font = `bold ${13 * S}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = "#242422";
        ctx.fillText(overlay.mostVisited, cardX + 20 * S, cardY + 120 * S);
    }

    ctx.globalAlpha = 1;
}

/* ─────────────────────────────────────────────
   COMPONENT PROPS
   ───────────────────────────────────────────── */
type RecapProps = {
    userName: string;
    totalMosques: number;
    totalCities: number;
    streakCount: number;
    mostVisited: string;
};

/* ═══════════════════════════════════════════════
   RECAP CLIENT
   ═══════════════════════════════════════════════ */
export default function RecapClient({ userName, totalMosques, totalCities, streakCount, mostVisited }: RecapProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);
    const [gifProgress, setGifProgress] = useState<number | null>(null); // null = idle, 0-100 = progress

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    /* ── Download PNG ── */
    const handleDownloadPNG = useCallback(async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 3,
                backgroundColor: null,
                useCORS: true,
                logging: false,
                width: cardRef.current.offsetWidth,
                height: cardRef.current.offsetHeight,
            });
            const link = document.createElement("a");
            link.download = `jejak-ramadan-${userName.toLowerCase().replace(/\s+/g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("Export failed:", err);
        }
    }, [userName]);

    /* ── Download animated GIF ── */
    const handleDownloadGIF = useCallback(async () => {
        if (gifProgress !== null) return; // already in progress
        setGifProgress(0);

        try {
            // Dynamic import gif.js
            const GIF = (await import("gif.js")).default;

            const gif = new GIF({
                workers: 2,
                quality: 10,
                width: GIF_SIZE,
                height: GIF_SIZE,
                workerScript: "/gif.worker.js",
            });

            const offscreen = document.createElement("canvas");
            offscreen.width = GIF_SIZE;
            offscreen.height = GIF_SIZE;
            const ctx = offscreen.getContext("2d")!;

            const overlayData = { userName, totalMosques, streakCount, totalCities, mostVisited };

            // Render each frame
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                drawGifFrame(ctx, i, TOTAL_FRAMES, overlayData);
                gif.addFrame(ctx, { copy: true, delay: FRAME_DELAY });
                setGifProgress(Math.round((i / TOTAL_FRAMES) * 80));
            }

            // Add a few "hold" frames at the end showing the final state
            for (let i = 0; i < 8; i++) {
                drawGifFrame(ctx, TOTAL_FRAMES - 1, TOTAL_FRAMES, overlayData);
                gif.addFrame(ctx, { copy: true, delay: FRAME_DELAY });
            }

            gif.on("progress", (p: number) => {
                setGifProgress(80 + Math.round(p * 20));
            });

            gif.on("finished", (blob: Blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = `jejak-ramadan-${userName.toLowerCase().replace(/\s+/g, "-")}.gif`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                setGifProgress(null);
            });

            gif.render();
        } catch (err) {
            console.error("GIF export failed:", err);
            setGifProgress(null);
        }
    }, [userName, totalMosques, totalCities, streakCount, mostVisited, gifProgress]);

    /* ── Share to X ── */
    const handleShareX = useCallback(() => {
        const text = encodeURIComponent(
            `Ramadan ini, aku sudah mengunjungi ${totalMosques} masjid di Bandung! 🕌✨\n\n#JejakRamadan #JejakMasjid`
        );
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    }, [totalMosques]);

    /* ── Share to WhatsApp ── */
    const handleShareWA = useCallback(() => {
        const text = encodeURIComponent(
            `Ramadan ini, aku sudah mengunjungi ${totalMosques} masjid di Bandung! 🕌✨ #JejakRamadan\n${window.location.href}`
        );
        window.open(`https://wa.me/?text=${text}`, "_blank");
    }, [totalMosques]);

    const pathD = buildPathD();
    const markerPositions = VISITED_MOSQUES.map((m) => ({ ...m, pos: toSVG(m.lat, m.lng) }));

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col items-center pt-6 pb-24 px-4 relative">
            {/* ── Back nav ── */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[520px] mb-5 flex items-center justify-between relative z-10"
            >
                <Link
                    href="/wrapped"
                    className="w-9 h-9 bg-white rounded-full shadow-[var(--shadow-sm)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors border border-[var(--border-light)]"
                >
                    <ArrowLeft size={18} />
                </Link>
                <span className="text-xs font-semibold text-[var(--text-muted)] tracking-[0.15em] uppercase">
                    Your Journey Recap
                </span>
                <div className="w-9" />
            </motion.div>

            {/* ═══════════════════════════════════════════
                THE MAP SHARE CARD (export target)
            ═══════════════════════════════════════════ */}
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="recap-map-canvas relative z-10 w-full max-w-[520px] bg-[#F7F6F3] rounded-[28px] overflow-hidden"
                style={{ boxShadow: "0 12px 48px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)" }}
            >
                {/* ── SVG MAP LAYER ── */}
                <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
                    <svg
                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Background */}
                        <rect width={SVG_W} height={SVG_H} fill="#EDECE8" />

                        {/* Subtle grid lines for cartographic feel */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <line
                                key={`vg-${i}`}
                                x1={i * (SVG_W / 11)}
                                y1={0}
                                x2={i * (SVG_W / 11)}
                                y2={SVG_H}
                                stroke="#D9D8D4"
                                strokeWidth={0.5}
                                opacity={0.5}
                            />
                        ))}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <line
                                key={`hg-${i}`}
                                x1={0}
                                y1={i * (SVG_H / 11)}
                                x2={SVG_W}
                                y2={i * (SVG_H / 11)}
                                stroke="#D9D8D4"
                                strokeWidth={0.5}
                                opacity={0.5}
                            />
                        ))}

                        {/* Faint "road" curves for realism */}
                        <path
                            d="M 0 320 Q 150 280, 300 310 T 600 290"
                            stroke="#CBC9C4"
                            strokeWidth={2.5}
                            fill="none"
                            opacity={0.4}
                        />
                        <path
                            d="M 80 0 Q 120 200, 200 400 T 350 600"
                            stroke="#CBC9C4"
                            strokeWidth={2}
                            fill="none"
                            opacity={0.35}
                        />
                        <path
                            d="M 400 0 Q 380 150, 420 350 T 500 600"
                            stroke="#CBC9C4"
                            strokeWidth={1.8}
                            fill="none"
                            opacity={0.3}
                        />
                        <path
                            d="M 0 150 Q 200 180, 400 140 T 600 160"
                            stroke="#CBC9C4"
                            strokeWidth={1.5}
                            fill="none"
                            opacity={0.3}
                        />
                        <path
                            d="M 0 480 Q 150 460, 350 490 T 600 470"
                            stroke="#CBC9C4"
                            strokeWidth={1.5}
                            fill="none"
                            opacity={0.25}
                        />

                        {/* Heatmap zones — subtle green radials */}
                        {markerPositions.slice(0, 5).map((m, i) => (
                            <circle
                                key={`heat-${i}`}
                                cx={m.pos[0]}
                                cy={m.pos[1]}
                                r={45 + i * 5}
                                fill="url(#heatGrad)"
                                opacity={0.15}
                            />
                        ))}
                        <defs>
                            <radialGradient id="heatGrad">
                                <stop offset="0%" stopColor="#059669" stopOpacity={0.5} />
                                <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                            </radialGradient>
                        </defs>

                        {/* Journey path */}
                        <path
                            ref={pathRef}
                            d={pathD}
                            fill="none"
                            stroke="#059669"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={0.7}
                            className="recap-journey-path"
                            style={
                                pathLength
                                    ? {
                                        strokeDasharray: pathLength,
                                        strokeDashoffset: 0,
                                        animation: `drawPath 2s ease-out forwards`,
                                    }
                                    : undefined
                            }
                        />

                        {/* Mosque markers */}
                        {markerPositions.map((m, i) => (
                            <g key={m.id}>
                                {/* Outer glow ring */}
                                <motion.circle
                                    cx={m.pos[0]}
                                    cy={m.pos[1]}
                                    r={18}
                                    fill="rgba(5, 150, 105, 0.08)"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8 + i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ transformOrigin: `${m.pos[0]}px ${m.pos[1]}px` }}
                                />
                                {/* Marker circle */}
                                <motion.circle
                                    cx={m.pos[0]}
                                    cy={m.pos[1]}
                                    r={12}
                                    fill="#059669"
                                    stroke="#ffffff"
                                    strokeWidth={2.5}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.85 + i * 0.12, duration: 0.35, type: "spring", stiffness: 300, damping: 20 }}
                                    style={{ transformOrigin: `${m.pos[0]}px ${m.pos[1]}px` }}
                                />
                                {/* Number label */}
                                <motion.text
                                    x={m.pos[0]}
                                    y={m.pos[1] + 1}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="white"
                                    fontSize={m.order > 9 ? 9 : 10}
                                    fontWeight={700}
                                    fontFamily="Inter, system-ui, sans-serif"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.95 + i * 0.12 }}
                                >
                                    {m.order}
                                </motion.text>
                            </g>
                        ))}

                        {/* "Bandung" label watermark */}
                        <text
                            x={SVG_W - 16}
                            y={SVG_H - 16}
                            textAnchor="end"
                            fill="#A3A39E"
                            fontSize={11}
                            fontWeight={600}
                            fontFamily="Inter, system-ui, sans-serif"
                            letterSpacing="0.08em"
                            opacity={0.6}
                        >
                            BANDUNG, INDONESIA
                        </text>
                    </svg>

                    {/* ── OVERLAY ACTIVITY CARD ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
                        className="absolute bottom-4 left-4 right-4 recap-overlay rounded-[20px] p-5"
                    >
                        {/* Header */}
                        <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-base">🕌</span>
                                <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.12em]">
                                    Jejak Masjid
                                </span>
                            </div>
                            <h2 className="font-serif text-xl text-[var(--text-primary)] tracking-tight leading-tight">
                                Perjalanan Ramadan {userName}
                            </h2>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-3 mb-3 text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-[#059669]" />
                                <span className="font-bold text-[var(--text-primary)]">{totalMosques}</span>
                                <span className="text-[var(--text-secondary)]">masjid</span>
                            </div>
                            <span className="text-[var(--border-medium)]">·</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-base">🔥</span>
                                <span className="font-bold text-[var(--text-primary)]">{streakCount}</span>
                                <span className="text-[var(--text-secondary)]">hari streak</span>
                            </div>
                            <span className="text-[var(--border-medium)]">·</span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[var(--text-primary)]">{totalCities}</span>
                                <span className="text-[var(--text-secondary)]">kota</span>
                            </div>
                        </div>

                        {/* Most visited */}
                        <div className="pt-3 border-t border-[var(--border-light)]">
                            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.15em] font-semibold mb-1">
                                Masjid favorit
                            </div>
                            <div className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
                                {mostVisited}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── JOURNEY PREVIEW STRIP ── */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="px-4 py-4 border-t border-[#E5E4E0] overflow-x-auto flex gap-2 recap-strip-scroll"
                >
                    {VISITED_MOSQUES.map((m) => (
                        <motion.div
                            key={m.id}
                            variants={fadeUp}
                            className="recap-strip-item flex items-center gap-2 shrink-0 bg-white rounded-full pl-1.5 pr-3.5 py-1.5 border border-[var(--border-light)] shadow-[var(--shadow-sm)]"
                        >
                            <span className="w-6 h-6 rounded-full bg-[#059669] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                {m.order}
                            </span>
                            <span className="text-xs font-medium text-[var(--text-primary)] whitespace-nowrap">
                                {m.name}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* ═══════════════════════════════════════════
                SHARE BUTTONS
            ═══════════════════════════════════════════ */}
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full max-w-[520px] mt-8 flex flex-col gap-3 relative z-10"
            >
                {/* Download row */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        onClick={handleDownloadPNG}
                        variants={fadeUp}
                        className="py-3.5 bg-[var(--text-primary)] text-white hover:bg-black rounded-2xl font-medium shadow-[var(--shadow-sm)] flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
                    >
                        <Download size={15} />
                        Gambar (.png)
                    </motion.button>
                    <motion.button
                        onClick={handleDownloadGIF}
                        disabled={gifProgress !== null}
                        variants={fadeUp}
                        className="py-3.5 bg-[#059669] text-white hover:bg-[#047857] disabled:opacity-70 disabled:cursor-wait rounded-2xl font-medium shadow-[var(--shadow-sm)] flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
                    >
                        {gifProgress !== null ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                {gifProgress}%
                            </>
                        ) : (
                            <>
                                <Film size={15} />
                                Animasi (.gif)
                            </>
                        )}
                    </motion.button>
                </div>

                {/* X + WhatsApp */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        onClick={handleShareX}
                        variants={fadeUp}
                        className="py-3.5 bg-white text-[var(--text-primary)] rounded-2xl font-medium flex items-center justify-center gap-2 border border-[var(--border-light)] hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-sm)] transition-all cursor-pointer text-sm"
                    >
                        <Twitter size={15} />
                        Share to X
                    </motion.button>
                    <motion.button
                        onClick={handleShareWA}
                        variants={fadeUp}
                        className="py-3.5 bg-white text-[var(--text-primary)] rounded-2xl font-medium flex items-center justify-center gap-2 border border-[var(--border-light)] hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-sm)] transition-all cursor-pointer text-sm"
                    >
                        <MessageCircle size={15} />
                        WhatsApp
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
