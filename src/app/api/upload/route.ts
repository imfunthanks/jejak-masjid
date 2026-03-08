import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Format file tidak didukung. Gunakan JPEG, PNG, atau WebP." },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "Ukuran file terlalu besar. Maksimal 5MB." },
                { status: 400 }
            );
        }

        // Upload to Vercel Blob
        const timestamp = Date.now();
        const ext = file.type.split("/")[1];
        const filename = `checkin/${session.user.id}/${timestamp}.${ext}`;

        const blob = await put(filename, file, {
            access: "public",
            addRandomSuffix: false,
        });

        return NextResponse.json({ url: blob.url }, { status: 200 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Gagal mengunggah foto" },
            { status: 500 }
        );
    }
}
