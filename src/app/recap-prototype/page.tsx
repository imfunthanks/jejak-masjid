"use client";

import Link from "next/link";
import { Download, Share2, Instagram, ArrowLeft } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

export default function RecapPrototypePage() {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col items-center pt-8 pb-24 px-6 relative overflow-hidden">

            {/* Animated Background Blobs */}
            <motion.div
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-primary-light)] opacity-[0.05] blur-[100px] rounded-full pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-accent)] opacity-[0.08] blur-[100px] rounded-full pointer-events-none"
            />

            {/* Header Navigation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg mb-8 flex items-center justify-between relative z-10"
            >
                <Link href="/journey-prototype" className="w-10 h-10 bg-white rounded-full shadow-[var(--shadow-sm)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors border border-[var(--border-light)] shrink-0">
                    <ArrowLeft size={20} />
                </Link>
                <span className="text-sm font-bold text-[var(--text-muted)] tracking-widest uppercase">Your Collectible</span>
                <div className="w-10" />
            </motion.div>

            {/* The Collectible Card — Entrance + 3D Hover */}
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                whileHover={{ rotateY: 3, rotateX: -2, scale: 1.02 }}
                style={{ perspective: 1000 }}
                className="relative z-10 w-full max-w-md aspect-[4/5] bg-[var(--color-primary-dark)] rounded-[2rem] shadow-[var(--shadow-floating)] p-8 flex flex-col justify-between overflow-hidden border border-white/10 group"
            >
                {/* Card Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-transparent to-black/50 pointer-events-none" />

                {/* Card Header */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="relative z-20 text-center"
                >
                    <motion.span variants={fadeUp} className="inline-block px-3 py-1 bg-white/10 text-white backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-4">
                        Ramadan 1447H
                    </motion.span>
                    <motion.h2 variants={fadeUp} className="title-font text-white text-3xl font-bold mb-1">My Mosque Journey</motion.h2>
                    <motion.p variants={fadeUp} className="text-[var(--color-accent-light)] font-medium">Ahmad&apos;s Spiritual Path</motion.p>
                </motion.div>

                {/* Card Stats Grid — staggered */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="relative z-20 grid grid-cols-2 gap-4 mt-8"
                >
                    <motion.div variants={fadeUp} className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                        <div className="mono-font text-4xl font-bold text-white mb-1">12</div>
                        <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Mosques Visited</div>
                    </motion.div>
                    <motion.div variants={fadeUp} className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                        <div className="mono-font text-4xl font-bold text-[var(--color-accent)] mb-1">4</div>
                        <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Cities Explored</div>
                    </motion.div>
                    <motion.div variants={fadeUp} className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] rounded-2xl p-4 border border-white/20 text-center col-span-2 shadow-inner">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-2xl">🔥</span>
                            <div className="mono-font text-3xl font-bold text-white">5 Days</div>
                        </div>
                        <div className="text-[10px] text-white/90 uppercase tracking-wider font-bold">Current Streak</div>
                    </motion.div>
                </motion.div>

                {/* Card Footer */}
                <div className="relative z-20 mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🕌</span>
                        <span className="text-white font-bold text-sm tracking-tight title-font">Jejak Masjid</span>
                    </div>
                    <p className="text-[10px] text-white/50 mono-font">#JejakRamadan</p>
                </div>
            </motion.div>

            {/* Share Buttons — staggered slide-up */}
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full max-w-md mt-10 flex flex-col gap-4 relative z-10"
            >
                <motion.button variants={fadeUp} className="w-full py-4 bg-[var(--text-primary)] text-white rounded-full font-bold shadow-[var(--shadow-md)] flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-lg transition-all border border-transparent">
                    <Download size={20} />
                    Save High-Res Image
                </motion.button>
                <div className="grid grid-cols-2 gap-4">
                    <motion.button variants={fadeUp} className="py-4 bg-white text-[var(--text-primary)] rounded-full font-bold shadow-[var(--shadow-sm)] flex items-center justify-center gap-2 border border-[var(--border-light)] hover:bg-[var(--bg-surface)] transition-colors">
                        <Instagram size={18} />
                        Instagram
                    </motion.button>
                    <motion.button variants={fadeUp} className="py-4 bg-white text-[var(--text-primary)] rounded-full font-bold shadow-[var(--shadow-sm)] flex items-center justify-center gap-2 border border-[var(--border-light)] hover:bg-[var(--bg-surface)] transition-colors">
                        <Share2 size={18} />
                        Share Link
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
