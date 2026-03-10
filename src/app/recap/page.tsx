import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins, mosques } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import RecapClient from "./RecapClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Recap Ramadan",
    description: "Buat kartu recap perjalanan Ramadanmu yang cantik — rangkuman masjid dikunjungi, streak, dan pencapaian selama bulan suci.",
};

export default async function RecapPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/recap");
    }

    const userId = session.user.id;
    const userName = session.user.name || "Sobat Jannah";

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

    const totalMosques = new Set(userCheckins.map((c) => c.mosque.id)).size;
    const totalCities = new Set(userCheckins.map((c) => c.mosque.city)).size;

    // Top mosque for "most visited"
    const mosqueVisitCounts = new Map<string, { name: string; count: number }>();
    for (const c of userCheckins) {
        const existing = mosqueVisitCounts.get(c.mosque.id);
        if (existing) existing.count++;
        else mosqueVisitCounts.set(c.mosque.id, { name: c.mosque.name, count: 1 });
    }
    let mostVisited = "-";
    let maxCount = 0;
    for (const entry of mosqueVisitCounts.values()) {
        if (entry.count > maxCount) { mostVisited = entry.name; maxCount = entry.count; }
    }

    // Streak
    const visitDates = [...new Set(
        userCheckins.map((c) => {
            const d = new Date(c.visitedAt);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        })
    )].sort().reverse();

    let streakCount = 0;
    if (visitDates.length > 0) {
        streakCount = 1;
        for (let i = 1; i < visitDates.length; i++) {
            const prev = new Date(visitDates[i - 1]);
            const curr = new Date(visitDates[i]);
            const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) streakCount++;
            else break;
        }
    }

    return (
        <RecapClient
            userName={userName}
            totalMosques={totalMosques}
            totalCities={totalCities}
            streakCount={streakCount}
            mostVisited={mostVisited}
        />
    );
}
