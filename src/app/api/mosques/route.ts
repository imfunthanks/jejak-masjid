import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mosques } from "@/lib/db/schema";

export async function GET() {
    try {
        // Only select fields needed for the map — keeps payload small
        const allMosques = await db
            .select({
                id: mosques.id,
                name: mosques.name,
                city: mosques.city,
                province: mosques.province,
                latitude: mosques.latitude,
                longitude: mosques.longitude,
                category: mosques.category,
                imageUrl: mosques.imageUrl,
            })
            .from(mosques);

        return NextResponse.json(allMosques, {
            headers: {
                // Cache for 5 minutes — mosque data rarely changes
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("Error fetching mosques:", error);
        return NextResponse.json(
            { error: "Gagal memuat data masjid" },
            { status: 500 }
        );
    }
}
