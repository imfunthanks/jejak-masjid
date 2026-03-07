import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins, mosques } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import JourneyClient from "./JourneyClient";

export default async function JourneyPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/journey");
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

    return (
        <JourneyClient
            checkins={userCheckins}
            totalMosques={totalMosques}
            totalCities={totalCities}
            userName={userName}
        />
    );
}
