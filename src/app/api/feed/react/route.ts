import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reactions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

const VALID_TYPES = ["doa", "masya_allah", "ingin_kesana", "semangat", "barakallah"];

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { checkinId, type } = await request.json();
        if (!checkinId || !type) {
            return NextResponse.json({ error: "checkinId and type are required" }, { status: 400 });
        }
        if (!VALID_TYPES.includes(type)) {
            return NextResponse.json({ error: `Invalid reaction type. Valid: ${VALID_TYPES.join(", ")}` }, { status: 400 });
        }

        const userId = session.user.id;

        // Check if already reacted with this type
        const existing = await db
            .select()
            .from(reactions)
            .where(
                and(
                    eq(reactions.checkinId, checkinId),
                    eq(reactions.userId, userId),
                    eq(reactions.type, type)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            // Toggle off: remove reaction
            await db.delete(reactions).where(eq(reactions.id, existing[0].id));
            return NextResponse.json({ action: "removed", type });
        } else {
            // Toggle on: add reaction
            await db.insert(reactions).values({ checkinId, userId, type });
            return NextResponse.json({ action: "added", type });
        }
    } catch (error) {
        console.error("Reaction error:", error);
        return NextResponse.json({ error: "Gagal menyimpan reaksi" }, { status: 500 });
    }
}
