import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins, mosques } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const userName = session.user.name || "Sobat Jannah";

        // Fetch all user checkins with mosque data
        const userCheckins = await db
            .select({
                id: checkins.id,
                visitedAt: checkins.visitedAt,
                mosque: mosques,
            })
            .from(checkins)
            .innerJoin(mosques, eq(checkins.mosqueId, mosques.id))
            .where(eq(checkins.userId, userId))
            .orderBy(desc(checkins.visitedAt));

        // Unique mosques visited
        const uniqueMosqueIds = new Set(userCheckins.map((c) => c.mosque.id));
        const totalMosques = uniqueMosqueIds.size;

        // Unique cities
        const totalCities = new Set(userCheckins.map((c) => c.mosque.city)).size;

        // Top mosque (most visited)
        const mosqueVisitCounts = new Map<string, { name: string; city: string; count: number }>();
        for (const c of userCheckins) {
            const existing = mosqueVisitCounts.get(c.mosque.id);
            if (existing) {
                existing.count++;
            } else {
                mosqueVisitCounts.set(c.mosque.id, {
                    name: c.mosque.name,
                    city: c.mosque.city,
                    count: 1,
                });
            }
        }

        let topMosque: { name: string; city: string; count: number } | null = null;
        for (const entry of mosqueVisitCounts.values()) {
            if (!topMosque || entry.count > topMosque.count) {
                topMosque = entry;
            }
        }

        // Streak calculation (consecutive days with at least one checkin)
        const visitDates = [...new Set(
            userCheckins.map((c) => {
                const d = new Date(c.visitedAt);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            })
        )].sort().reverse(); // newest first

        let streakCount = 0;
        if (visitDates.length > 0) {
            streakCount = 1;
            for (let i = 1; i < visitDates.length; i++) {
                const prev = new Date(visitDates[i - 1]);
                const curr = new Date(visitDates[i]);
                const diffMs = prev.getTime() - curr.getTime();
                const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    streakCount++;
                } else {
                    break;
                }
            }
        }

        // Badges
        const badges: { emoji: string; title: string; desc: string }[] = [];
        if (totalMosques >= 10) {
            badges.push({ emoji: "🏔️", title: "Penjelajah", desc: "Kunjungi 10+ masjid berbeda" });
        } else if (totalMosques >= 5) {
            badges.push({ emoji: "🚶", title: "Petualang", desc: "Kunjungi 5+ masjid berbeda" });
        }
        if (streakCount >= 7) {
            badges.push({ emoji: "🔥", title: "Konsisten", desc: `Streak ${streakCount} hari berturut-turut` });
        } else if (streakCount >= 3) {
            badges.push({ emoji: "⚡", title: "Semangat", desc: `Streak ${streakCount} hari berturut-turut` });
        }
        if (totalCities >= 4) {
            badges.push({ emoji: "🗺️", title: "Kartografer", desc: `Jelajahi ${totalCities} kota berbeda` });
        } else if (totalCities >= 2) {
            badges.push({ emoji: "🧭", title: "Penjelajah Kota", desc: `Jelajahi ${totalCities} kota berbeda` });
        }
        // Always give Ramadan Spirit badge during Ramadan usage
        badges.push({ emoji: "🌙", title: "Ramadan Spirit", desc: "Aktif selama bulan Ramadan" });

        return NextResponse.json({
            userName,
            totalMosques,
            totalCities,
            streakCount,
            topMosque,
            badges,
            mostVisited: topMosque?.name || "-",
        });
    } catch (error) {
        console.error("Error computing wrapped stats:", error);
        return NextResponse.json(
            { error: "Gagal menghitung statistik" },
            { status: 500 }
        );
    }
}
