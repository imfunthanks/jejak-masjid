import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins, mosques, users, reactions } from "@/lib/db/schema";
import { eq, desc, lt, sql, and, inArray } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
        const cursor = url.searchParams.get("cursor"); // ISO timestamp for cursor-based pagination

        // Get current user (optional — for highlighting own reactions)
        const session = await auth();
        const currentUserId = session?.user?.id || null;

        const baseQuery = db
            .select({
                id: checkins.id,
                photoUrl: checkins.photoUrl,
                caption: checkins.caption,
                visitedAt: checkins.visitedAt,
                user: {
                    id: users.id,
                    name: users.name,
                },
                mosque: {
                    id: mosques.id,
                    name: mosques.name,
                    city: mosques.city,
                    category: mosques.category,
                    latitude: mosques.latitude,
                    longitude: mosques.longitude,
                    imageUrl: mosques.imageUrl,
                },
            })
            .from(checkins)
            .innerJoin(users, eq(checkins.userId, users.id))
            .innerJoin(mosques, eq(checkins.mosqueId, mosques.id))
            .orderBy(desc(checkins.visitedAt))
            .limit(limit + 1); // Fetch one extra to determine if there are more

        // Apply cursor filter
        const results = cursor
            ? await baseQuery.where(lt(checkins.visitedAt, new Date(cursor)))
            : await baseQuery;

        const hasMore = results.length > limit;
        const items = hasMore ? results.slice(0, limit) : results;
        const nextCursor = hasMore ? items[items.length - 1].visitedAt.toISOString() : null;

        // Fetch reaction counts for all items in one query
        const checkinIds = items.map(i => i.id);
        let reactionData: { checkinId: string; type: string; count: number }[] = [];
        let userReactions: { checkinId: string; type: string }[] = [];

        if (checkinIds.length > 0) {
            reactionData = await db
                .select({
                    checkinId: reactions.checkinId,
                    type: reactions.type,
                    count: sql<number>`count(*)::int`.as("count"),
                })
                .from(reactions)
                .where(inArray(reactions.checkinId, checkinIds))
                .groupBy(reactions.checkinId, reactions.type);

            // Fetch current user's reactions
            if (currentUserId) {
                userReactions = await db
                    .select({
                        checkinId: reactions.checkinId,
                        type: reactions.type,
                    })
                    .from(reactions)
                    .where(
                        and(
                            inArray(reactions.checkinId, checkinIds),
                            eq(reactions.userId, currentUserId)
                        )
                    );
            }
        }

        // Build reaction maps
        const reactionMap: Record<string, Record<string, number>> = {};
        for (const r of reactionData) {
            if (!reactionMap[r.checkinId]) reactionMap[r.checkinId] = {};
            reactionMap[r.checkinId][r.type] = r.count;
        }

        const userReactionMap: Record<string, string[]> = {};
        for (const r of userReactions) {
            if (!userReactionMap[r.checkinId]) userReactionMap[r.checkinId] = [];
            userReactionMap[r.checkinId].push(r.type);
        }

        // Merge reactions into items
        const enrichedItems = items.map(item => ({
            ...item,
            reactions: reactionMap[item.id] || {},
            myReactions: userReactionMap[item.id] || [],
        }));

        return NextResponse.json({
            items: enrichedItems,
            nextCursor,
            hasMore,
        });
    } catch (error) {
        console.error("Feed error:", error);
        return NextResponse.json(
            { error: "Gagal memuat feed" },
            { status: 500 }
        );
    }
}
