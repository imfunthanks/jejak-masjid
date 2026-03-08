import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins, mosques, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import PassportCard from "@/components/passport/PassportCard";

export default async function PassportPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/passport");
    }

    // Fetch user checkins with mosque data
    const userCheckins = await db
        .select({
            id: checkins.id,
            visitedAt: checkins.visitedAt,
            mosque: {
                id: mosques.id,
                name: mosques.name,
                city: mosques.city,
                category: mosques.category,
                latitude: mosques.latitude,
                longitude: mosques.longitude,
            }
        })
        .from(checkins)
        .innerJoin(mosques, eq(checkins.mosqueId, mosques.id))
        .where(eq(checkins.userId, session.user.id))
        .orderBy(desc(checkins.visitedAt));

    // Fetch total mosques for the stats
    const totalResult = await db.select({ count: mosques.id }).from(mosques);
    const totalMosques = totalResult.length;

    // Format data for the client component
    // Sort chronologically for the journey path
    const sortedCheckins = [...userCheckins].sort((a, b) =>
        new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime()
    );

    const visits = sortedCheckins.map((c, index) => ({
        id: c.mosque.id,
        name: c.mosque.name,
        city: c.mosque.city,
        category: c.mosque.category,
        lat: c.mosque.latitude,
        lng: c.mosque.longitude,
        visitedAt: c.visitedAt.toISOString(),
        order: index + 1,
    }));

    return (
        <PassportCard
            userName={session.user.name || "Sobat"}
            visits={visits}
            totalMosques={totalMosques}
        />
    );
}
