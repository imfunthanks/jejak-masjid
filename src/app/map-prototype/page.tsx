"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Search, MapPin, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const MosqueMapInnerPrototype = dynamic(
    () => import("@/components/map-prototype/MosqueMapInnerPrototype"),
    { ssr: false, loading: () => <div className="h-screen w-full bg-[var(--bg-surface)] animate-pulse flex items-center justify-center text-[var(--color-primary-light)]">Loading Explore Map...</div> }
);

export default function MapPrototypePage() {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-[var(--bg-main)]">

            {/* Floating Top Navigation — animated entrance */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-[1000] flex items-center gap-4"
            >
                <Link href="/home-prototype" className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-[var(--shadow-md)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors border border-[var(--border-light)] shrink-0">
                    <ArrowLeft size={24} />
                </Link>
                <div className="flex-1 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-[var(--shadow-md)] flex items-center px-6 border border-[var(--border-light)]">
                    <Search size={20} className="text-[var(--text-muted)] mr-3" />
                    <input
                        type="text"
                        placeholder="Search historic mosques..."
                        className="w-full h-full bg-transparent outline-none text-[var(--text-primary)] font-medium placeholder:text-[var(--text-muted)]"
                    />
                </div>
                <Link href="/journey-prototype" className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-[var(--shadow-md)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors border border-[var(--border-light)] shrink-0 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Ahmad" alt="User" className="w-full h-full object-cover" />
                </Link>
            </motion.div>

            {/* Map Container */}
            <div className="absolute inset-0 z-0">
                <MosqueMapInnerPrototype />
            </div>

            {/* Floating "Locate Me" Button — spring hover */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-32 right-6 w-14 h-14 bg-white rounded-full shadow-[var(--shadow-lg)] flex items-center justify-center text-[var(--color-primary-dark)] z-[1000] focus:outline-none"
            >
                <MapPin fill="currentColor" size={20} />
            </motion.button>

        </div>
    );
}
