import { ImageResponse } from "next/og";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkins, mosques } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new Response("Unauthorized", { status: 401 });
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
            .where(eq(checkins.userId, userId));

        const totalMosques = new Set(userCheckins.map((c) => c.mosque.id)).size;
        const totalCities = new Set(userCheckins.map((c) => c.mosque.city)).size;

        // Streak is computed client-side for now

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#FAF9F6",
                        backgroundImage: "radial-gradient(circle at 25px 25px, rgba(212, 168, 83, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(27, 107, 74, 0.05) 2%, transparent 0%)",
                        backgroundSize: "100px 100px",
                        fontFamily: "Inter, sans-serif",
                        padding: "40px",
                        borderTop: "16px solid #1B6B4A",
                        borderBottom: "16px solid #D4A853",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "white",
                            padding: "60px",
                            borderRadius: "24px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                            border: "1px solid rgba(212, 168, 83, 0.3)",
                            width: "90%",
                            height: "85%",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "30px", gap: "15px" }}>
                            <span style={{ fontSize: "60px" }}>🕌</span>
                            <h1 style={{ fontSize: "52px", color: "#1B6B4A", fontWeight: 800, margin: 0, letterSpacing: "-1px" }}>
                                Jejak Masjid
                            </h1>
                        </div>

                        <h2 style={{ fontSize: "36px", color: "#4B5563", fontWeight: 500, margin: "0 0 60px 0", textAlign: "center" }}>
                            Perjalanan Ramadan <b style={{ color: "#111827" }}>{userName}</b>
                        </h2>

                        <div style={{ display: "flex", width: "100%", justifyContent: "space-around", marginBottom: "40px" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span style={{ fontSize: "72px", fontWeight: 800, color: "#1B6B4A" }}>{totalMosques}</span>
                                <span style={{ fontSize: "24px", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>Masjid</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span style={{ fontSize: "72px", fontWeight: 800, color: "#D4A853" }}>{totalCities}</span>
                                <span style={{ fontSize: "24px", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>Kota</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span style={{ fontSize: "72px", fontWeight: 800, color: "#EF4444" }}>{totalMosques > 0 ? "🔥" : "0"}</span>
                                <span style={{ fontSize: "24px", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>Aktif</span>
                            </div>
                        </div>

                        <p style={{ fontSize: "22px", color: "#9CA3AF", marginTop: "auto" }}>
                            jejak-masjid.vercel.app
                        </p>
                    </div>
                </div>
            ),
            {
                width: 1080,
                height: 1080,
            }
        );
    } catch (error) {
        console.error(error);
        return new Response(`Failed to generate image`, {
            status: 500,
        });
    }
}
