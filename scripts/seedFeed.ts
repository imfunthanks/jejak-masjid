import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, mosques, checkins } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import { hashSync } from "bcryptjs";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/jejak_masjid";
const client = postgres(connectionString);
const db = drizzle(client);

// Demo users with Islamic-themed names
const demoUsers = [
    { name: "Ahmad Fauzi", email: "ahmad@demo.jejak", password: hashSync("demo1234", 10) },
    { name: "Siti Aisyah", email: "siti@demo.jejak", password: hashSync("demo1234", 10) },
    { name: "Rizky Ramadhan", email: "rizky@demo.jejak", password: hashSync("demo1234", 10) },
    { name: "Fatimah Zahra", email: "fatimah@demo.jejak", password: hashSync("demo1234", 10) },
    { name: "Umar Hadi", email: "umar@demo.jejak", password: hashSync("demo1234", 10) },
];

// Captions pool — realistic Indonesian Islamic captions
const captions = [
    "Alhamdulillah, Tarawih malam ke-5 ✨",
    "Subhanallah, arsitektur masjid ini luar biasa indah 🕌",
    "Sholat Jumat bareng keluarga besar",
    "Mampir sholat Dzuhur, masjidnya adem banget",
    "Tarawih marathon malam ini! 💪",
    "Alhamdulillah bisa tadarus di sini",
    "Masjid favorit untuk sholat Subuh 🌅",
    "Pertama kali ke masjid ini, MasyaAllah indah sekali",
    "Itikaf malam terakhir Ramadan",
    "Buka puasa bareng teman-teman di sini",
    null, // some check-ins have no caption
    null,
    null,
    "Lagi jalan-jalan, sempatin mampir sholat dulu",
    "Suasana Ramadannya kerasa banget di masjid ini ❤️",
    null,
    "Ceramah Maghrib hari ini bagus banget",
    "Terima kasih sudah menjaga kebersihan masjid 🤲",
    null,
    "Ngabuburit sambil menunggu adzan Maghrib",
];

async function seedFeed() {
    console.log("🕌 Seeding demo feed data...\n");

    try {
        // 1. Get existing mosques
        const allMosques = await db.select().from(mosques);
        if (allMosques.length === 0) {
            console.error("❌ No mosques found. Run `npm run db:seed` first.");
            process.exit(1);
        }
        console.log(`Found ${allMosques.length} mosques`);

        // 2. Create demo users (skip if email exists)
        const insertedUsers = [];
        for (const u of demoUsers) {
            try {
                const [inserted] = await db.insert(users).values(u).returning();
                insertedUsers.push(inserted);
                console.log(`  ✅ Created user: ${u.name}`);
            } catch {
                // User might already exist
                const [existing] = await db.select().from(users).where(sql`${users.email} = ${u.email}`);
                if (existing) {
                    insertedUsers.push(existing);
                    console.log(`  ⏭️  User exists: ${u.name}`);
                }
            }
        }

        // 3. Create demo check-ins spread over the past 7 days
        const now = Date.now();
        const checkinData = [];
        const usedCombos = new Set<string>();

        for (let i = 0; i < 25; i++) {
            const user = insertedUsers[i % insertedUsers.length];
            // Pick a random mosque, avoid duplicates
            let mosque;
            let comboKey;
            let attempts = 0;
            do {
                mosque = allMosques[Math.floor(Math.random() * allMosques.length)];
                const day = Math.floor(i / 5); // spread across days
                comboKey = `${user.id}-${mosque.id}-${day}`;
                attempts++;
            } while (usedCombos.has(comboKey) && attempts < 20);
            usedCombos.add(comboKey);

            // Spread check-ins over the past 7 days, with random hours
            const hoursAgo = Math.floor(Math.random() * 168); // 0-168 hours = 7 days
            const visitedAt = new Date(now - hoursAgo * 60 * 60 * 1000);

            const caption = captions[Math.floor(Math.random() * captions.length)];

            checkinData.push({
                userId: user.id,
                mosqueId: mosque.id,
                caption: caption,
                photoUrl: null, // demo check-ins use mosque fallback images
                visitedAt: visitedAt,
            });
        }

        // Insert all check-ins
        const inserted = await db.insert(checkins).values(checkinData).returning();
        console.log(`\n✅ Seeded ${inserted.length} demo check-ins!`);

        // Summary
        const uniqueUsers = new Set(checkinData.map(c => c.userId));
        const uniqueMosques = new Set(checkinData.map(c => c.mosqueId));
        const withCaptions = checkinData.filter(c => c.caption).length;

        console.log(`\n📊 Summary:`);
        console.log(`   Users: ${uniqueUsers.size}`);
        console.log(`   Mosques visited: ${uniqueMosques.size}`);
        console.log(`   With captions: ${withCaptions}`);
        console.log(`   Without captions: ${inserted.length - withCaptions}`);
    } catch (error) {
        console.error("❌ Seed failed:", error);
    }

    await client.end();
    process.exit(0);
}

seedFeed();
