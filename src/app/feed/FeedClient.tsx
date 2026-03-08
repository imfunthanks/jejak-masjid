"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Clock, Camera, MessageCircle, Share2, CheckCircle2 } from "lucide-react";

type FeedItem = {
    id: string;
    photoUrl: string | null;
    caption: string | null;
    visitedAt: string;
    user: { id: string; name: string };
    mosque: {
        id: string;
        name: string;
        city: string;
        category: string;
        latitude: number;
        longitude: number;
        imageUrl: string | null;
    };
    reactions: Record<string, number>;
    myReactions: string[];
};

type FeedResponse = {
    items: FeedItem[];
    nextCursor: string | null;
    hasMore: boolean;
};

// Path-inspired Islamic emotional reactions
const REACTION_TYPES = [
    { type: "doa", emoji: "🤲", label: "Doa" },
    { type: "masya_allah", emoji: "❤️", label: "MasyaAllah" },
    { type: "ingin_kesana", emoji: "🕌", label: "Ingin Kesana" },
    { type: "semangat", emoji: "💪", label: "Semangat" },
    { type: "barakallah", emoji: "✨", label: "BarakAllah" },
];

function timeAgo(dateStr: string): string {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
}

const CATEGORY_COLORS: Record<string, string> = {
    iconic: "#059669",
    historic: "#b45309",
    campus: "#2563eb",
    general: "#6b7280",
};

export default function FeedClient() {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [expandedReactions, setExpandedReactions] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Close reaction picker when clicking outside
    useEffect(() => {
        if (!expandedReactions) return;
        const handler = () => setExpandedReactions(null);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [expandedReactions]);

    const fetchFeed = useCallback(async (cursor?: string | null) => {
        const isInitial = !cursor;
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const params = new URLSearchParams({ limit: "15" });
            if (cursor) params.set("cursor", cursor);

            const res = await fetch(`/api/feed?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch feed");

            const data: FeedResponse = await res.json();

            setItems(prev => isInitial ? data.items : [...prev, ...data.items]);
            setNextCursor(data.nextCursor);
            setHasMore(data.hasMore);
        } catch (err) {
            console.error("Feed fetch error:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Toggle reaction with optimistic update
    const toggleReaction = useCallback(async (checkinId: string, type: string) => {
        // Optimistic update
        setItems(prev => prev.map(item => {
            if (item.id !== checkinId) return item;
            const isActive = item.myReactions.includes(type);
            return {
                ...item,
                reactions: {
                    ...item.reactions,
                    [type]: Math.max(0, (item.reactions[type] || 0) + (isActive ? -1 : 1)),
                },
                myReactions: isActive
                    ? item.myReactions.filter(r => r !== type)
                    : [...item.myReactions, type],
            };
        }));

        // Fire API call
        try {
            const res = await fetch("/api/feed/react", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ checkinId, type }),
            });
            if (!res.ok) {
                // Revert on error — refetch
                fetchFeed();
            }
        } catch {
            fetchFeed();
        }
    }, [fetchFeed]);

    // Initial load
    useEffect(() => { fetchFeed(); }, [fetchFeed]);

    // Infinite scroll
    useEffect(() => {
        if (!sentinelRef.current || !hasMore) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && hasMore && nextCursor) {
                    fetchFeed(nextCursor);
                }
            },
            { rootMargin: "200px" }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, nextCursor, fetchFeed]);

    const handleShare = async (item: FeedItem) => {
        const text = `${item.user.name} baru saja check-in di ${item.mosque.name} 🕌\n\n${item.caption ? `"${item.caption}"\n\n` : ''}Ikuti perjalanan spiritual kami di Jejak Masjid!`;
        const url = window.location.origin + '/feed';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Jejak Masjid',
                    text: text,
                    url: url,
                });
                return;
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error("Error sharing:", error);
                }
            }
        }

        // Fallback: clipboard
        try {
            await navigator.clipboard.writeText(`${text}\n\n${url}`);
            setToastMessage("Teks disalin ke clipboard!");
            setTimeout(() => setToastMessage(null), 3000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    // Total reaction count for an item
    const totalReactions = (item: FeedItem) =>
        Object.values(item.reactions).reduce((sum, n) => sum + n, 0);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] pt-24 pb-20">
            <div className="max-w-lg mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="font-serif text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-1">
                        Feed
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm">
                        Aktivitas terbaru komunitas Jejak Masjid
                    </p>
                </motion.div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="flex flex-col gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 border border-[var(--border-light)] animate-pulse">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)]" />
                                    <div className="flex-1">
                                        <div className="w-24 h-3 rounded bg-[var(--bg-surface)] mb-2" />
                                        <div className="w-16 h-2 rounded bg-[var(--bg-surface)]" />
                                    </div>
                                </div>
                                <div className="w-full h-48 rounded-xl bg-[var(--bg-surface)] mb-3" />
                                <div className="w-3/4 h-3 rounded bg-[var(--bg-surface)]" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && items.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl border border-[var(--border-light)]"
                    >
                        <div className="text-4xl mb-4">🕌</div>
                        <h2 className="font-semibold text-[var(--text-primary)] text-lg mb-2">Belum ada aktivitas</h2>
                        <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-xs mx-auto">
                            Mulai check-in di masjid terdekat dan jadilah yang pertama berbagi jejakmu!
                        </p>
                        <Link
                            href="/map"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-light)] transition-colors"
                        >
                            <MapPin size={16} /> Mulai Eksplorasi
                        </Link>
                    </motion.div>
                )}

                {/* Feed items */}
                {!loading && items.length > 0 && (
                    <div className="flex flex-col gap-5">
                        {items.map((item, index) => (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                                className="bg-white rounded-2xl border border-[var(--border-light)] overflow-hidden hover:shadow-[var(--shadow-sm)] transition-shadow"
                            >
                                {/* User header */}
                                <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                                        style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-light))` }}
                                    >
                                        {getInitial(item.user.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-[var(--text-primary)] text-sm truncate">
                                                {item.user.name}
                                            </span>
                                            <span className="text-[var(--text-muted)] text-xs">•</span>
                                            <span className="text-[var(--text-muted)] text-xs flex items-center gap-1 shrink-0">
                                                <Clock size={10} />
                                                {timeAgo(item.visitedAt)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                                            <MapPin size={10} />
                                            Check-in di <span className="font-medium text-[var(--color-primary)]">{item.mosque.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Photo */}
                                {item.photoUrl ? (
                                    <div className="w-full aspect-[4/3] relative bg-[var(--bg-surface)]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.photoUrl}
                                            alt={`${item.user.name} di ${item.mosque.name}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ) : item.mosque.imageUrl ? (
                                    <div className="w-full aspect-[4/3] relative bg-[var(--bg-surface)]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.mosque.imageUrl}
                                            alt={item.mosque.name}
                                            className="w-full h-full object-cover opacity-80"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-md text-[10px] text-white/80 font-medium">
                                            📷 Foto masjid
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mx-4 h-32 rounded-xl bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-main)] flex items-center justify-center border border-[var(--border-light)]">
                                        <div className="text-center">
                                            <Camera size={24} className="mx-auto mb-1 text-[var(--text-muted)] opacity-40" />
                                            <span className="text-[10px] text-[var(--text-muted)]">Tanpa foto</span>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="px-4 py-3">
                                    {/* Caption */}
                                    {item.caption && (
                                        <p className="text-sm text-[var(--text-primary)] mb-2.5 leading-relaxed flex items-start gap-1.5">
                                            <MessageCircle size={13} className="text-[var(--text-muted)] mt-0.5 shrink-0" />
                                            {item.caption}
                                        </p>
                                    )}

                                    {/* Reaction and Share bar */}
                                    <div className="mb-2.5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            {/* Reaction summary (collapsed) */}
                                            {totalReactions(item) > 0 && expandedReactions !== item.id && (
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <div className="flex -space-x-1">
                                                        {REACTION_TYPES.filter(r => (item.reactions[r.type] || 0) > 0)
                                                            .slice(0, 3)
                                                            .map(r => (
                                                                <span key={r.type} className="text-sm">{r.emoji}</span>
                                                            ))}
                                                    </div>
                                                    <span className="text-xs text-[var(--text-muted)]">
                                                        {totalReactions(item)}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Reaction toggle button */}
                                            <div className="relative" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setExpandedReactions(expandedReactions === item.id ? null : item.id)}
                                                    className="text-xs text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                                                >
                                                    {item.myReactions.length > 0 ? (
                                                        <span className="flex gap-0.5">
                                                            {item.myReactions.map(type => {
                                                                const r = REACTION_TYPES.find(rt => rt.type === type);
                                                                return <span key={type}>{r?.emoji}</span>;
                                                            })}
                                                        </span>
                                                    ) : (
                                                        <span>🤲</span>
                                                    )}
                                                    <span className="font-medium">Reaksi</span>
                                                </button>

                                                {/* Expanded reaction picker */}
                                                <AnimatePresence>
                                                    {expandedReactions === item.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                                            className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl border border-[var(--border-light)] shadow-lg px-2 py-2 flex gap-1 z-10"
                                                        >
                                                            {REACTION_TYPES.map((r) => {
                                                                const isActive = item.myReactions.includes(r.type);
                                                                const count = item.reactions[r.type] || 0;
                                                                return (
                                                                    <button
                                                                        key={r.type}
                                                                        onClick={() => toggleReaction(item.id, r.type)}
                                                                        className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 ${isActive
                                                                            ? "bg-[var(--color-primary)]/10 scale-110"
                                                                            : "hover:bg-[var(--bg-surface)] hover:scale-105"
                                                                            }`}
                                                                        title={r.label}
                                                                    >
                                                                        <span className={`text-xl transition-transform duration-200 ${isActive ? "scale-125" : ""}`}>
                                                                            {r.emoji}
                                                                        </span>
                                                                        {count > 0 && (
                                                                            <span className={`text-[10px] font-bold ${isActive ? "text-[var(--color-primary)]" : "text-[var(--text-muted)]"}`}>
                                                                                {count}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Share Button */}
                                        <button
                                            onClick={() => handleShare(item)}
                                            className="text-xs text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5"
                                        >
                                            <Share2 size={14} />
                                            <span className="font-medium">Bagikan</span>
                                        </button>
                                    </div>

                                    {/* Mosque info bar */}
                                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-light)]">
                                        <Link
                                            href="/map"
                                            className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                        >
                                            <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]" style={{ background: `${CATEGORY_COLORS[item.mosque.category] || "#6b7280"}15`, color: CATEGORY_COLORS[item.mosque.category] || "#6b7280" }}>
                                                🕌
                                            </span>
                                            <span className="font-medium">{item.mosque.name}</span>
                                            <span className="text-[var(--text-muted)]">· {item.mosque.city}</span>
                                        </Link>
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                            style={{
                                                background: `${CATEGORY_COLORS[item.mosque.category] || "#6b7280"}10`,
                                                color: CATEGORY_COLORS[item.mosque.category] || "#6b7280",
                                            }}
                                        >
                                            {item.mosque.category}
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}

                {/* Loading more indicator */}
                {loadingMore && (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* End of feed */}
                {!hasMore && items.length > 0 && (
                    <div className="text-center py-8 text-sm text-[var(--text-muted)]">
                        Kamu sudah melihat semua aktivitas 🕌
                    </div>
                )}

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-1" />
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-3 bg-[var(--text-primary)] text-white rounded-xl shadow-lg flex items-center gap-3 z-50"
                    >
                        <CheckCircle2 size={18} className="text-green-400" />
                        <span className="text-sm font-medium">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
