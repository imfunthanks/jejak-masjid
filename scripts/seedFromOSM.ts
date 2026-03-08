import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { mosques } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/jejak_masjid";
const client = postgres(connectionString);
const db = drizzle(client);

// Cities to scan with bounding boxes [south, west, north, east]
const REGIONS: { name: string; province: string; bbox: [number, number, number, number] }[] = [
    // Bandung Greater Area
    { name: "Bandung", province: "Jawa Barat", bbox: [-7.02, 107.50, -6.82, 107.76] },
    // Jakarta Greater Area
    { name: "Jakarta", province: "DKI Jakarta", bbox: [-6.38, 106.68, -6.08, 106.98] },
    // Yogyakarta
    { name: "Yogyakarta", province: "DI Yogyakarta", bbox: [-7.87, 110.30, -7.72, 110.45] },
    // Surabaya
    { name: "Surabaya", province: "Jawa Timur", bbox: [-7.38, 112.65, -7.22, 112.82] },
    // Semarang
    { name: "Semarang", province: "Jawa Tengah", bbox: [-7.08, 110.35, -6.93, 110.50] },
    // Depok, Bogor, Tangerang, Bekasi
    { name: "Depok", province: "Jawa Barat", bbox: [-6.45, 106.70, -6.35, 106.88] },
    { name: "Bogor", province: "Jawa Barat", bbox: [-6.65, 106.73, -6.55, 106.85] },
    { name: "Tangerang", province: "Banten", bbox: [-6.25, 106.55, -6.15, 106.72] },
    { name: "Bekasi", province: "Jawa Barat", bbox: [-6.30, 106.95, -6.18, 107.08] },
    // Malang
    { name: "Malang", province: "Jawa Timur", bbox: [-8.02, 112.58, -7.92, 112.68] },
    // Medan
    { name: "Medan", province: "Sumatera Utara", bbox: [-3.65, 98.60, -3.52, 98.75] },
    // Solo
    { name: "Solo", province: "Jawa Tengah", bbox: [-7.60, 110.78, -7.53, 110.87] },
];

interface OverpassElement {
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: {
        name?: string;
        "name:id"?: string;
        "name:en"?: string;
        religion?: string;
        amenity?: string;
        building?: string;
        [key: string]: string | undefined;
    };
}

async function fetchMosquesFromOverpass(bbox: [number, number, number, number]): Promise<OverpassElement[]> {
    const [south, west, north, east] = bbox;
    // Query for mosques: amenity=place_of_worship + religion=muslim, or building=mosque
    const query = `
[out:json][timeout:60];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](${south},${west},${north},${east});
  way["amenity"="place_of_worship"]["religion"="muslim"](${south},${west},${north},${east});
  node["building"="mosque"](${south},${west},${north},${east});
  way["building"="mosque"](${south},${west},${north},${east});
);
out center tags;
`;

    const url = "https://overpass-api.de/api/interpreter";
    const res = await fetch(url, {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!res.ok) {
        throw new Error(`Overpass API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.elements || [];
}

function extractName(el: OverpassElement): string | null {
    const tags = el.tags || {};
    return tags.name || tags["name:id"] || tags["name:en"] || null;
}

function isMosqueName(name: string): boolean {
    const lower = name.toLowerCase();
    return (
        lower.includes("masjid") ||
        lower.includes("mesjid") ||
        lower.includes("musholla") ||
        lower.includes("musala") ||
        lower.includes("mushola") ||
        lower.includes("langgar") ||
        lower.includes("surau") ||
        lower.includes("mosque")
    );
}

function categorize(name: string, tags: OverpassElement["tags"]): string {
    const lower = name.toLowerCase();
    if (lower.includes("agung") || lower.includes("raya") || lower.includes("besar") || lower.includes("islamic center")) return "iconic";
    if (lower.includes("kampus") || lower.includes("universitas") || lower.includes("itb") || lower.includes("ugm") ||
        lower.includes("its") || lower.includes("unair") || lower.includes("undip") || lower.includes("unpad") ||
        lower.includes("ui ") || lower.includes("uns") || lower.includes("uin") || lower.includes("iain") ||
        lower.includes("stain") || lower.includes("politeknik") || lower.includes("sekolah")) return "campus";
    if (tags?.historic === "yes" || lower.includes("kuno") || lower.includes("lama") || lower.includes("bersejarah") ||
        lower.includes("sunan") || lower.includes("sultan") || lower.includes("wali")) return "historic";
    return "general";
}

async function seedFromOverpass() {
    console.log("🌍 Fetching mosques from OpenStreetMap via Overpass API...\n");

    // Get existing mosque names to avoid duplicates
    const existing = await db.select({ name: mosques.name }).from(mosques);
    const existingNames = new Set(existing.map(m => m.name.toLowerCase().trim()));
    console.log(`📋 Existing mosques in DB: ${existingNames.size}\n`);

    const allNew: { name: string; city: string; province: string; latitude: number; longitude: number; category: string }[] = [];
    const seenNames = new Set<string>();

    for (const region of REGIONS) {
        console.log(`🔍 Scanning ${region.name}, ${region.province}...`);

        try {
            const elements = await fetchMosquesFromOverpass(region.bbox);
            let added = 0;

            for (const el of elements) {
                const name = extractName(el);
                if (!name) continue;

                // Get coordinates
                const lat = el.lat ?? el.center?.lat;
                const lon = el.lon ?? el.center?.lon;
                if (!lat || !lon) continue;

                // Skip non-mosque names
                if (!isMosqueName(name)) continue;

                // Skip duplicates
                const nameKey = name.toLowerCase().trim();
                if (existingNames.has(nameKey) || seenNames.has(nameKey)) continue;
                seenNames.add(nameKey);

                allNew.push({
                    name: name.trim(),
                    city: region.name,
                    province: region.province,
                    latitude: lat,
                    longitude: lon,
                    category: categorize(name, el.tags),
                });
                added++;
            }

            console.log(`   Found ${elements.length} places of worship, ${added} new mosques added`);

            // Rate limit: 10 seconds between requests to avoid 429 errors from Overpass
            await new Promise(resolve => setTimeout(resolve, 10000));
        } catch (err) {
            console.error(`   ❌ Error scanning ${region.name}:`, (err as Error).message);
        }
    }

    if (allNew.length === 0) {
        console.log("\n✅ No new mosques to add!");
        await client.end();
        process.exit(0);
    }

    console.log(`\n📥 Inserting ${allNew.length} new mosques...`);

    // Insert in batches of 50
    const batchSize = 50;
    let inserted = 0;
    for (let i = 0; i < allNew.length; i += batchSize) {
        const batch = allNew.slice(i, i + batchSize);
        try {
            await db.insert(mosques).values(batch);
            inserted += batch.length;
            console.log(`   Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} inserted`);
        } catch (err) {
            console.error(`   ❌ Batch error:`, (err as Error).message);
        }
    }

    // Summary
    const categories = allNew.reduce((acc, m) => {
        acc[m.category] = (acc[m.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const cities = new Set(allNew.map(m => m.city));

    console.log(`\n✅ Seeded ${inserted} new mosques!`);
    console.log(`📊 By category:`);
    Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count}`);
    });
    console.log(`🏙️  Cities covered: ${cities.size}`);

    // Total count
    const total = await db.select({ count: sql<number>`count(*)::int` }).from(mosques);
    console.log(`\n🕌 Total mosques in database: ${total[0].count}`);

    await client.end();
    process.exit(0);
}

seedFromOverpass();
