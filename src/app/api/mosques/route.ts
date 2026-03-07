import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mosques } from "@/lib/db/schema";

export async function GET() {
    try {
        const allMosques = await db.select().from(mosques);
        return NextResponse.json(allMosques);
    } catch (error) {
        console.error("Error fetching mosques:", error);
        return NextResponse.json(
            { error: "Gagal memuat data masjid" },
            { status: 500 }
        );
    }
}
