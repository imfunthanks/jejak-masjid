import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins, mosques } from "@/lib/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";

// Haversine distance in meters
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MAX_CHECKIN_DISTANCE_METERS = 500; // Server-side threshold (slightly lenient for GPS drift)

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { mosqueId, userLat, userLng, photoUrl, caption } = await request.json();
        if (!mosqueId) {
            return NextResponse.json({ error: "Mosque ID is required" }, { status: 400 });
        }

        // Validate location is provided
        if (userLat == null || userLng == null) {
            return NextResponse.json({ error: "Lokasi diperlukan untuk check-in" }, { status: 400 });
        }

        // Fetch mosque coordinates for distance check
        const [mosque] = await db.select().from(mosques).where(eq(mosques.id, mosqueId)).limit(1);
        if (!mosque) {
            return NextResponse.json({ error: "Masjid tidak ditemukan" }, { status: 404 });
        }

        // Server-side distance validation
        const distance = haversineDistance(userLat, userLng, mosque.latitude, mosque.longitude);
        if (distance > MAX_CHECKIN_DISTANCE_METERS) {
            return NextResponse.json(
                { error: `Kamu terlalu jauh dari masjid (${Math.round(distance)}m). Maksimal ${MAX_CHECKIN_DISTANCE_METERS}m.` },
                { status: 400 }
            );
        }

        const userId = session.user.id;

        // Check for existing checkin today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingCheckin = await db
            .select()
            .from(checkins)
            .where(
                and(
                    eq(checkins.userId, userId),
                    eq(checkins.mosqueId, mosqueId),
                    gte(checkins.visitedAt, today),
                    lte(checkins.visitedAt, tomorrow)
                )
            )
            .limit(1);

        if (existingCheckin.length > 0) {
            return NextResponse.json(
                { error: "Anda sudah check-in di masjid ini hari ini." },
                { status: 400 }
            );
        }

        // Insert new checkin
        const [newCheckin] = await db
            .insert(checkins)
            .values({
                userId,
                mosqueId,
                photoUrl: photoUrl || null,
                caption: caption || null,
            })
            .returning();

        return NextResponse.json(
            { message: "Check-in berhasil!", checkin: newCheckin },
            { status: 201 }
        );
    } catch (error) {
        console.error("Check-in error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat check-in" },
            { status: 500 }
        );
    }
}
