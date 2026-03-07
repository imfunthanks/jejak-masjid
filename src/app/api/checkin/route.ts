import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins } from "@/lib/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { mosqueId } = await request.json();
        if (!mosqueId) {
            return NextResponse.json({ error: "Mosque ID is required" }, { status: 400 });
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
