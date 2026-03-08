import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { mosques } from "@/lib/db/schema";
import { z } from "zod";

const addMosqueSchema = z.object({
    name: z.string().min(3, "Nama masjid minimal 3 karakter").max(200),
    latitude: z.number(),
    longitude: z.number(),
    category: z.string().default("general"),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = addMosqueSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error }, { status: 400 });
        }

        const { name, latitude, longitude, category } = result.data;

        // Use geocoding to loosely determine city/province from lat/lng if we want,
        // but for now, we'll set defaults since it's an MVP and we want fast UX.
        const city = "Lokasi Pengguna";
        const province = "Indonesia";

        const [newMosque] = await db
            .insert(mosques)
            .values({
                name,
                latitude,
                longitude,
                city,
                province,
                category,
                addedBy: session.user.id,
            })
            .returning();

        return NextResponse.json(newMosque, { status: 201 });
    } catch (error) {
        console.error("Error adding mosque:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menambahkan masjid" },
            { status: 500 }
        );
    }
}
