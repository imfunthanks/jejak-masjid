"use client";

import { motion } from "framer-motion";
import { Check, Square, MapPin } from "lucide-react";

export default function HeroIllustration() {
    return (
        <div className="w-full h-[480px] lg:h-[520px] relative overflow-visible">

            {/* SVG map background layer */}
            <svg
                viewBox="0 0 480 480"
                className="absolute inset-0 w-full h-full pointer-events-none"
                fill="none"
            >
                {/* Soft road-like paths */}
                <path
                    d="M40 420 C120 320, 160 380, 240 260 C300 170, 380 200, 440 80"
                    stroke="var(--border-strong)"
                    strokeWidth="2"
                    strokeDasharray="4 8"
                    opacity="0.35"
                />
                <path
                    d="M80 120 C160 200, 240 80, 400 220"
                    stroke="var(--border-strong)"
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                    opacity="0.25"
                />
                <path
                    d="M200 440 C220 380, 280 400, 320 340"
                    stroke="var(--border-strong)"
                    strokeWidth="1"
                    strokeDasharray="3 6"
                    opacity="0.2"
                />

                {/* Small intersection dots */}
                <circle cx="120" cy="120" r="3" fill="var(--border-strong)" opacity="0.3" />
                <circle cx="360" cy="100" r="4" fill="var(--border-strong)" opacity="0.25" />
                <circle cx="80" cy="380" r="3" fill="var(--border-strong)" opacity="0.3" />
                <circle cx="420" cy="280" r="3" fill="var(--border-strong)" opacity="0.2" />
                <circle cx="260" cy="440" r="3" fill="var(--border-strong)" opacity="0.25" />

                {/* Journey path connecting the 3 markers */}
                <motion.path
                    d="M90 380 C140 340, 180 280, 230 230 C280 180, 350 150, 390 100"
                    fill="none"
                    stroke="#0bda95"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
                />
            </svg>

            {/* ── Marker 1: bottom-left ── */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.7 }}
                className="absolute z-20 flex flex-col items-center"
                style={{ left: '12%', bottom: '10%' }}
            >
                <div className="w-10 h-10 rounded-full bg-[#0bda95] text-white flex items-center justify-center font-mono text-base font-bold shadow-[0_4px_14px_rgba(11,218,149,0.4)]">
                    1
                </div>
                <div className="mt-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm border border-emerald-100">
                    <span className="text-[11px] font-semibold text-[var(--text-primary)] whitespace-nowrap">Salman ITB</span>
                </div>
            </motion.div>

            {/* ── Marker 2: center area ── */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.1 }}
                className="absolute z-20 flex flex-col items-center"
                style={{ left: '42%', top: '42%' }}
            >
                <div className="w-10 h-10 rounded-full bg-[#0bda95] text-white flex items-center justify-center font-mono text-base font-bold shadow-[0_4px_14px_rgba(11,218,149,0.4)]">
                    2
                </div>
                <div className="mt-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm border border-emerald-100">
                    <span className="text-[11px] font-semibold text-[var(--text-primary)] whitespace-nowrap">Masjid Raya</span>
                </div>
            </motion.div>

            {/* ── Marker 3 (current): top-right with pulse ── */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.5 }}
                className="absolute z-20 flex flex-col items-center"
                style={{ right: '8%', top: '12%' }}
            >
                <div className="relative w-11 h-11 rounded-full bg-[#0bda95] text-white flex items-center justify-center font-mono text-lg font-bold shadow-[0_4px_14px_rgba(11,218,149,0.5)]">
                    3
                    <span className="absolute inset-0 rounded-full bg-[#0bda95] opacity-40 animate-ping" style={{ animationDuration: '3s' }}></span>
                </div>
                <div className="mt-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm border border-emerald-100">
                    <span className="text-[11px] font-semibold text-[var(--text-primary)] whitespace-nowrap">Masjid Pusdai</span>
                </div>
            </motion.div>

            {/* ── Unvisited marker hint: faded, top-center ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1, delay: 2 }}
                className="absolute z-10 flex flex-col items-center"
                style={{ left: '65%', top: '48%' }}
            >
                <div className="w-7 h-7 rounded-full border-2 border-gray-300 bg-white/60 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                </div>
            </motion.div>

            {/* ── Unvisited marker hint: faded, bottom-center ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1, delay: 2.2 }}
                className="absolute z-10 flex flex-col items-center"
                style={{ left: '28%', top: '22%' }}
            >
                <div className="w-7 h-7 rounded-full border-2 border-gray-300 bg-white/60 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                </div>
            </motion.div>

            {/* ── Floating Checklist Card: anchored bottom-right ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="absolute z-30 right-0 bottom-0 bg-white/80 backdrop-blur-2xl border border-white/60 p-5 rounded-2xl shadow-[0_12px_40px_-10px_rgb(0,0,0,0.06)] w-64"
            >
                <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-primary)] block mb-3">
                    Mosque Journey Progress
                </span>

                {/* Visited Items */}
                <div className="space-y-2.5 mb-4">
                    {["Masjid Salman ITB", "Masjid Raya Bandung", "Masjid Pusdai"].map((name) => (
                        <div key={name} className="flex items-center gap-3 text-[0.85rem] text-[var(--text-primary)]">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                            </div>
                            <span className="truncate font-medium">{name}</span>
                        </div>
                    ))}
                </div>

                <span className="text-[9px] uppercase tracking-widest font-semibold text-[var(--text-secondary)] block mb-2 border-t border-[var(--border-light)] pt-3">
                    Next to explore
                </span>

                {/* Planned Items */}
                <div className="space-y-2.5">
                    {["Masjid Al-Irsyad", "Masjid Cipaganti"].map((name) => (
                        <div key={name} className="flex items-center gap-3 text-[0.85rem] text-[var(--text-secondary)] opacity-75">
                            <Square className="w-4 h-4 text-[var(--text-muted)] ml-[0.1rem]" strokeWidth={2} />
                            <span className="truncate font-medium">{name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
