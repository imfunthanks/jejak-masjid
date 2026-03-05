import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins, mosques } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import JourneyStats from "@/components/journey/JourneyStats";
import CheckinList from "@/components/journey/CheckinList";
import VisitedMap from "@/components/journey/VisitedMap";
import Link from "next/link";

export const metadata = {
    title: "Perjalananku — Jejak Masjid",
    description: "Dasbor perjalanan kunjungan masjid Anda selama bulan Ramadan.",
};

export default async function JourneyPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/journey");
    }

    const userId = session.user.id;

    // Fetch user checkins with attached mosque data
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

    return (
        <div className="container journey-container">
            <div className="journey-header">
                <h1 className="journey-title">Perjalanan Ramadan</h1>
                <p className="journey-subtitle">Ahlan wa sahlan, {session.user.name}</p>
            </div>

            <JourneyStats checkins={userCheckins} />

            <div className="journey-grid">
                <div className="journey-main">
                    <CheckinList checkins={userCheckins} />
                </div>
                <div className="journey-sidebar">
                    <div className="journey-map-wrapper">
                        <h3 className="sidebar-title">Peta Kunjungan</h3>
                        <VisitedMap checkins={userCheckins} />
                    </div>

                    <div className="recap-teaser-card mt-4">
                        <h3 className="sidebar-title">Pamerkan Perjalananmu!</h3>
                        <p className="teaser-desc">Bagikan kartu rekapitulasi jejak masjidmu ke media sosial.</p>
                        <Link href="/recap" className="btn btn-primary btn-full mt-2">
                            Buat Recap Card
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
