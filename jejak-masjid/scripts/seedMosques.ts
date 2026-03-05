import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { mosques } from "../src/lib/db/schema";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/jejak_masjid";
const client = postgres(connectionString);
const db = drizzle(client);

const mosqueData = [
    // Jakarta
    { name: "Masjid Istiqlal", city: "Jakarta Pusat", province: "DKI Jakarta", latitude: -6.1702, longitude: 106.8311, category: "iconic" },
    { name: "Masjid Al-Azhar", city: "Jakarta Selatan", province: "DKI Jakarta", latitude: -6.2445, longitude: 106.7993, category: "historic" },
    { name: "Masjid Sunda Kelapa", city: "Jakarta Pusat", province: "DKI Jakarta", latitude: -6.1875, longitude: 106.8219, category: "historic" },
    { name: "Masjid Cut Meutia", city: "Jakarta Pusat", province: "DKI Jakarta", latitude: -6.1760, longitude: 106.8366, category: "historic" },
    { name: "Masjid Agung At-Tin", city: "Jakarta Timur", province: "DKI Jakarta", latitude: -6.2185, longitude: 106.8893, category: "iconic" },
    { name: "Masjid Raya Jakarta Islamic Centre", city: "Jakarta Utara", province: "DKI Jakarta", latitude: -6.1378, longitude: 106.8914, category: "iconic" },
    { name: "Masjid Al-Ikhlas Cipinang", city: "Jakarta Timur", province: "DKI Jakarta", latitude: -6.2238, longitude: 106.8762, category: "general" },
    { name: "Masjid Jami Al-Munawwar", city: "Jakarta Timur", province: "DKI Jakarta", latitude: -6.2400, longitude: 106.8700, category: "general" },
    { name: "Masjid Al-Barkah Kemang", city: "Jakarta Selatan", province: "DKI Jakarta", latitude: -6.2601, longitude: 106.8137, category: "general" },
    { name: "Masjid Baitul Ghafur UI", city: "Jakarta Timur", province: "DKI Jakarta", latitude: -6.2190, longitude: 106.8320, category: "campus" },

    // Bandung
    { name: "Masjid Raya Bandung", city: "Bandung", province: "Jawa Barat", latitude: -6.9218, longitude: 107.6093, category: "iconic" },
    { name: "Masjid Agung Trans Studio", city: "Bandung", province: "Jawa Barat", latitude: -6.9263, longitude: 107.6358, category: "iconic" },
    { name: "Masjid Salman ITB", city: "Bandung", province: "Jawa Barat", latitude: -6.8905, longitude: 107.6106, category: "campus" },
    { name: "Masjid Al-Lathiif", city: "Bandung", province: "Jawa Barat", latitude: -6.8944, longitude: 107.6167, category: "general" },
    { name: "Masjid Cipaganti", city: "Bandung", province: "Jawa Barat", latitude: -6.8946, longitude: 107.6012, category: "historic" },
    { name: "Masjid Pusdai", city: "Bandung", province: "Jawa Barat", latitude: -6.9048, longitude: 107.6183, category: "iconic" },
    { name: "Masjid Al-Ukhuwwah", city: "Bandung", province: "Jawa Barat", latitude: -6.9200, longitude: 107.5989, category: "general" },
    { name: "Masjid Al-Irsyad Kota Baru Parahyangan", city: "Bandung Barat", province: "Jawa Barat", latitude: -6.8477, longitude: 107.4900, category: "iconic" },
    { name: "Masjid Unpad Jatinangor", city: "Sumedang", province: "Jawa Barat", latitude: -6.9266, longitude: 107.7729, category: "campus" },
    { name: "Masjid Istiqomah", city: "Bandung", province: "Jawa Barat", latitude: -6.9100, longitude: 107.6158, category: "general" },

    // Yogyakarta
    { name: "Masjid Gedhe Kauman", city: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.8043, longitude: 110.3569, category: "historic" },
    { name: "Masjid Syuhada", city: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.7832, longitude: 110.3719, category: "historic" },
    { name: "Masjid Kampus UGM", city: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.7695, longitude: 110.3840, category: "campus" },
    { name: "Masjid Pathok Negoro Ploso Kuning", city: "Sleman", province: "DI Yogyakarta", latitude: -7.7547, longitude: 110.3747, category: "historic" },
    { name: "Masjid Jogokariyan", city: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.8117, longitude: 110.3830, category: "iconic" },
    { name: "Masjid Al-Aman Kota Gede", city: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.8160, longitude: 110.3990, category: "historic" },
    { name: "Masjid Agung Demak Jogja", city: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.7920, longitude: 110.3610, category: "general" },
    { name: "Masjid UIN Sunan Kalijaga", city: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.7894, longitude: 110.3530, category: "campus" },
    { name: "Masjid An-Nuur Krapyak", city: "Bantul", province: "DI Yogyakarta", latitude: -7.8331, longitude: 110.3699, category: "general" },
    { name: "Masjid Besar Pakualaman", city: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.8014, longitude: 110.3702, category: "historic" },

    // Surabaya
    { name: "Masjid Al-Akbar Surabaya", city: "Surabaya", province: "Jawa Timur", latitude: -7.3421, longitude: 112.7193, category: "iconic" },
    { name: "Masjid Ampel", city: "Surabaya", province: "Jawa Timur", latitude: -7.2388, longitude: 112.7461, category: "historic" },
    { name: "Masjid Agung Sunan Ampel", city: "Surabaya", province: "Jawa Timur", latitude: -7.2397, longitude: 112.7465, category: "historic" },
    { name: "Masjid Nasional Al-Falah", city: "Surabaya", province: "Jawa Timur", latitude: -7.2689, longitude: 112.7523, category: "iconic" },
    { name: "Masjid ITS", city: "Surabaya", province: "Jawa Timur", latitude: -7.2834, longitude: 112.7975, category: "campus" },
    { name: "Masjid Cheng Ho", city: "Surabaya", province: "Jawa Timur", latitude: -7.2929, longitude: 112.7370, category: "historic" },
    { name: "Masjid Rahmat", city: "Surabaya", province: "Jawa Timur", latitude: -7.2519, longitude: 112.7381, category: "historic" },
    { name: "Masjid Al-Ikhlas Jemursari", city: "Surabaya", province: "Jawa Timur", latitude: -7.3227, longitude: 112.7474, category: "general" },
    { name: "Masjid Airlangga UNAIR", city: "Surabaya", province: "Jawa Timur", latitude: -7.2700, longitude: 112.7600, category: "campus" },
    { name: "Masjid Agung Bangil", city: "Pasuruan", province: "Jawa Timur", latitude: -7.5976, longitude: 112.7904, category: "historic" },

    // Semarang
    { name: "Masjid Agung Jawa Tengah", city: "Semarang", province: "Jawa Tengah", latitude: -6.9835, longitude: 110.4456, category: "iconic" },
    { name: "Masjid Kauman Semarang", city: "Semarang", province: "Jawa Tengah", latitude: -6.9678, longitude: 110.4236, category: "historic" },
    { name: "Masjid Baiturrahman Semarang", city: "Semarang", province: "Jawa Tengah", latitude: -6.9820, longitude: 110.4190, category: "general" },
    { name: "Masjid Undip Tembalang", city: "Semarang", province: "Jawa Tengah", latitude: -7.0494, longitude: 110.4395, category: "campus" },
    { name: "Masjid Al-Aqsha Menara Kudus", city: "Kudus", province: "Jawa Tengah", latitude: -6.8042, longitude: 110.8442, category: "historic" },

    // Aceh
    { name: "Masjid Raya Baiturrahman", city: "Banda Aceh", province: "Aceh", latitude: -5.5498, longitude: 95.3173, category: "iconic" },
    { name: "Masjid Agung Meulaboh", city: "Meulaboh", province: "Aceh", latitude: -4.1374, longitude: 96.1329, category: "iconic" },
    { name: "Masjid Teungku Di Anjong", city: "Banda Aceh", province: "Aceh", latitude: -5.5510, longitude: 95.3269, category: "historic" },
    { name: "Masjid Raya Lhokseumawe", city: "Lhokseumawe", province: "Aceh", latitude: -5.1801, longitude: 97.1507, category: "iconic" },
    { name: "Masjid Unsyiah", city: "Banda Aceh", province: "Aceh", latitude: -5.5651, longitude: 95.3643, category: "campus" },

    // Medan
    { name: "Masjid Raya Al-Mashun", city: "Medan", province: "Sumatera Utara", latitude: -3.5752, longitude: 98.6841, category: "iconic" },
    { name: "Masjid Agung Medan", city: "Medan", province: "Sumatera Utara", latitude: -3.5893, longitude: 98.6782, category: "iconic" },
    { name: "Masjid Al-Ulum USU", city: "Medan", province: "Sumatera Utara", latitude: -3.5639, longitude: 98.6556, category: "campus" },
    { name: "Masjid Raya Binjai", city: "Binjai", province: "Sumatera Utara", latitude: -3.6000, longitude: 98.4850, category: "general" },
    { name: "Masjid Taqwa Muhammadiyah Medan", city: "Medan", province: "Sumatera Utara", latitude: -3.5850, longitude: 98.6900, category: "general" },

    // Makassar
    { name: "Masjid Raya Makassar", city: "Makassar", province: "Sulawesi Selatan", latitude: -5.1367, longitude: 119.4098, category: "iconic" },
    { name: "Masjid Al-Markaz Al-Islami", city: "Makassar", province: "Sulawesi Selatan", latitude: -5.1542, longitude: 119.4308, category: "iconic" },
    { name: "Masjid Amirul Mukminin (Masjid Terapung)", city: "Makassar", province: "Sulawesi Selatan", latitude: -5.1442, longitude: 119.3943, category: "iconic" },
    { name: "Masjid Kampus Unhas", city: "Makassar", province: "Sulawesi Selatan", latitude: -5.1338, longitude: 119.4900, category: "campus" },
    { name: "Masjid Nurul Ilham Makassar", city: "Makassar", province: "Sulawesi Selatan", latitude: -5.1500, longitude: 119.4200, category: "general" },

    // Palembang
    { name: "Masjid Agung Sultan Mahmud Badaruddin", city: "Palembang", province: "Sumatera Selatan", latitude: -2.9916, longitude: 104.7530, category: "iconic" },
    { name: "Masjid Cheng Ho Palembang", city: "Palembang", province: "Sumatera Selatan", latitude: -3.0009, longitude: 104.7624, category: "historic" },
    { name: "Masjid Agung Sriwijaya", city: "Palembang", province: "Sumatera Selatan", latitude: -2.9798, longitude: 104.7268, category: "iconic" },
    { name: "Masjid Unsri Palembang", city: "Palembang", province: "Sumatera Selatan", latitude: -2.9830, longitude: 104.7330, category: "campus" },
    { name: "Masjid Lawang Kidul", city: "Palembang", province: "Sumatera Selatan", latitude: -3.0050, longitude: 104.7570, category: "historic" },

    // Padang
    { name: "Masjid Raya Sumatera Barat", city: "Padang", province: "Sumatera Barat", latitude: -0.9471, longitude: 100.3543, category: "iconic" },
    { name: "Masjid Nurul Iman Padang", city: "Padang", province: "Sumatera Barat", latitude: -0.9500, longitude: 100.3600, category: "general" },
    { name: "Masjid Raya Batusangkar", city: "Batusangkar", province: "Sumatera Barat", latitude: -0.4615, longitude: 100.6166, category: "iconic" },
    { name: "Masjid Unand Padang", city: "Padang", province: "Sumatera Barat", latitude: -0.9140, longitude: 100.4600, category: "campus" },
    { name: "Masjid Taqwa Muhammadiyah Padang", city: "Padang", province: "Sumatera Barat", latitude: -0.9510, longitude: 100.3530, category: "general" },

    // Bali & NTB
    { name: "Masjid Agung Ibnu Batutah Bali", city: "Denpasar", province: "Bali", latitude: -8.6554, longitude: 115.2188, category: "iconic" },
    { name: "Masjid Raya Al-Hikmah Denpasar", city: "Denpasar", province: "Bali", latitude: -8.6700, longitude: 115.2200, category: "general" },
    { name: "Masjid Islamic Center NTB", city: "Mataram", province: "NTB", latitude: -8.5893, longitude: 116.0928, category: "iconic" },
    { name: "Masjid Hubbul Wathan NTB", city: "Mataram", province: "NTB", latitude: -8.5896, longitude: 116.0950, category: "iconic" },
    { name: "Masjid Agung Lombok", city: "Praya", province: "NTB", latitude: -8.7225, longitude: 116.2913, category: "general" },

    // Kalimantan
    { name: "Masjid Raya Sabilal Muhtadin", city: "Banjarmasin", province: "Kalimantan Selatan", latitude: -3.3187, longitude: 114.5920, category: "iconic" },
    { name: "Masjid Islamic Center Samarinda", city: "Samarinda", province: "Kalimantan Timur", latitude: -0.4834, longitude: 117.1487, category: "iconic" },
    { name: "Masjid Raya Pontianak", city: "Pontianak", province: "Kalimantan Barat", latitude: -0.0225, longitude: 109.3415, category: "iconic" },
    { name: "Masjid Jami Sultan Syarif Abdurrahman", city: "Pontianak", province: "Kalimantan Barat", latitude: -0.0227, longitude: 109.3419, category: "historic" },
    { name: "Masjid Sultan Suriansyah", city: "Banjarmasin", province: "Kalimantan Selatan", latitude: -3.3028, longitude: 114.5845, category: "historic" },

    // Solo & Demak
    { name: "Masjid Agung Surakarta", city: "Solo", province: "Jawa Tengah", latitude: -7.5693, longitude: 110.8256, category: "historic" },
    { name: "Masjid Agung Demak", city: "Demak", province: "Jawa Tengah", latitude: -6.8951, longitude: 110.6386, category: "historic" },
    { name: "Masjid UNS Solo", city: "Solo", province: "Jawa Tengah", latitude: -7.5592, longitude: 110.8551, category: "campus" },
    { name: "Masjid Agung Karanganyar", city: "Karanganyar", province: "Jawa Tengah", latitude: -7.5973, longitude: 110.9567, category: "general" },
    { name: "Masjid Al-Wustho Mangkunegaran", city: "Solo", province: "Jawa Tengah", latitude: -7.5709, longitude: 110.8193, category: "historic" },

    // Cirebon & Banten
    { name: "Masjid Agung Sang Cipta Rasa", city: "Cirebon", province: "Jawa Barat", latitude: -6.7070, longitude: 108.5575, category: "historic" },
    { name: "Masjid Agung Banten Lama", city: "Serang", province: "Banten", latitude: -6.0524, longitude: 106.1578, category: "historic" },
    { name: "Masjid Raya At-Taqwa Cirebon", city: "Cirebon", province: "Jawa Barat", latitude: -6.7321, longitude: 108.5531, category: "iconic" },
    { name: "Masjid Agung Serang", city: "Serang", province: "Banten", latitude: -6.1115, longitude: 106.1504, category: "iconic" },
    { name: "Masjid Al-Bantani BKS Kota Serang", city: "Serang", province: "Banten", latitude: -6.1200, longitude: 106.1500, category: "general" },

    // Papua & Maluku
    { name: "Masjid Raya Ahmad Yani Jayapura", city: "Jayapura", province: "Papua", latitude: -2.5373, longitude: 140.7190, category: "iconic" },
    { name: "Masjid Raya Al-Fatah Ambon", city: "Ambon", province: "Maluku", latitude: -3.6956, longitude: 128.1852, category: "iconic" },
    { name: "Masjid Raya Ternate", city: "Ternate", province: "Maluku Utara", latitude: 0.7833, longitude: 127.3833, category: "historic" },
    { name: "Masjid Sultan Ternate", city: "Ternate", province: "Maluku Utara", latitude: 0.7834, longitude: 127.3889, category: "historic" },
    { name: "Masjid Al-Munawarrah Sorong", city: "Sorong", province: "Papua Barat", latitude: -0.8761, longitude: 131.2549, category: "general" },
];

async function seed() {
    console.log("🕌 Seeding 100 mosques...\n");

    try {
        // Clear existing data
        await db.delete(mosques);

        // Insert all mosques
        const inserted = await db.insert(mosques).values(mosqueData).returning();

        const categories = mosqueData.reduce((acc, m) => {
            acc[m.category] = (acc[m.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        console.log(`✅ Seeded ${inserted.length} mosques successfully!\n`);
        console.log("📊 Categories:");
        Object.entries(categories).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count}`);
        });

        const cities = new Set(mosqueData.map((m) => m.city));
        const provinces = new Set(mosqueData.map((m) => m.province));
        console.log(`\n🏙️  Cities: ${cities.size}`);
        console.log(`🗺️  Provinces: ${provinces.size}`);
    } catch (error) {
        console.error("❌ Seed failed:", error);
    }

    await client.end();
    process.exit(0);
}

seed();
