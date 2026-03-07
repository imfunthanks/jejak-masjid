import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins, mosques } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ checkins: [] }, { status: 200 }); // Return empty array if not logged in
        }

        const userId = session.user.id;

        const userJourney = await db
            .select({
                checkinId: checkins.id,
                visitedAt: checkins.visitedAt,
                mosque: mosques,
            })
            .from(checkins)
            .innerJoin(mosques, eq(checkins.mosqueId, mosques.id))
            .where(eq(checkins.userId, userId))
            .orderBy(desc(checkins.visitedAt)); // Order chronological (newest first)

        return NextResponse.json(userJourney);
    } catch (error) {
        console.error("Error fetching journey:", error);
        return NextResponse.json(
            { error: "Gagal memuat data perjalanan" },
            { status: 500 }
        );
    }
}
