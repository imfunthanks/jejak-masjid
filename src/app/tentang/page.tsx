import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Tentang Jejak Masjid",
    description:
        "Jejak Masjid adalah platform open source untuk menjelajahi masjid, melacak kunjungan, dan membagikan perjalanan spiritual Ramadan. Dibangun oleh komunitas, untuk komunitas.",
};

const BASE_URL = "https://jejak-masjid-62zo.vercel.app";

// JSON-LD for AboutPage + FAQPage
const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${BASE_URL}/tentang#aboutpage`,
        name: "Tentang Jejak Masjid",
        description: "Platform eksplorasi masjid dan pelacakan perjalanan spiritual Ramadan.",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        inLanguage: "id-ID",
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${BASE_URL}/tentang#faq`,
        mainEntity: [
            {
                "@type": "Question",
                name: "Apa itu Jejak Masjid?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Jejak Masjid adalah aplikasi web gratis dan open source yang membantu umat Muslim menjelajahi masjid, mencatat kunjungan, dan melacak perjalanan spiritual mereka selama Ramadan. Tersedia peta interaktif, passport digital, dashboard perjalanan, dan fitur recap yang bisa dibagikan ke media sosial.",
                },
            },
            {
                "@type": "Question",
                name: "Apakah Jejak Masjid gratis?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ya, Jejak Masjid 100% gratis dan open source. Tidak ada biaya berlangganan, iklan, atau fitur berbayar. Kode sumber tersedia di GitHub dan siapa saja bisa berkontribusi.",
                },
            },
            {
                "@type": "Question",
                name: "Bagaimana cara check-in di masjid?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Cukup buka halaman Peta Masjid, temukan masjid yang ingin kamu kunjungi, klik marker-nya di peta, lalu tekan tombol Check-in. Kamu juga bisa menambahkan foto dan caption untuk setiap kunjungan.",
                },
            },
            {
                "@type": "Question",
                name: "Masjid mana saja yang tersedia?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Saat ini database fokus pada masjid-masjid di sekitar Bandung, Jawa Barat, termasuk masjid bersejarah, masjid kampus, dan masjid lingkungan. Kami terus menambah data dan menerima kontribusi dari komunitas.",
                },
            },
            {
                "@type": "Question",
                name: "Bagaimana cara berkontribusi?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Jejak Masjid adalah proyek open source. Kamu bisa berkontribusi melalui GitHub dengan membuka issue, mengirim pull request, atau menambahkan data masjid baru.",
                },
            },
            {
                "@type": "Question",
                name: "Apakah data saya aman?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Kami menjaga privasi data pengguna. Data check-in dan profil hanya digunakan untuk fitur aplikasi. Karena bersifat open source, kamu bisa memeriksa sendiri bagaimana data diproses di kode sumber.",
                },
            },
        ],
    },
];

export default function TentangPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pt-28 pb-20 px-6">
                <article className="max-w-3xl mx-auto">
                    {/* Header */}
                    <header className="mb-12">
                        <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight mb-6">
                            Tentang Jejak Masjid
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-light">
                            Platform eksplorasi masjid dan pelacakan perjalanan spiritual selama bulan suci Ramadan.
                            Dibangun oleh komunitas, untuk komunitas. 100% open source.
                        </p>
                    </header>

                    {/* Mission */}
                    <section className="mb-10">
                        <h2 className="font-serif text-2xl font-medium mb-4">Misi Kami</h2>
                        <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                            Selama Ramadan, banyak umat Muslim berusaha mengunjungi masjid-masjid berbeda untuk
                            merasakan suasana baru saat tarawih, itikaf, atau shalat harian. Namun, jarang ada
                            cara untuk merefleksikan atau memvisualisasikan perjalanan indah ini.
                        </p>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            Jejak Masjid hadir untuk memecahkan masalah ini. Kami menyediakan ruang pribadi
                            yang damai bagi umat Muslim untuk melacak kunjungan masjid dan merefleksikan
                            eksplorasi spiritual mereka secara bermakna di seluruh kota.
                        </p>
                    </section>

                    {/* What We Offer */}
                    <section className="mb-10">
                        <h2 className="font-serif text-2xl font-medium mb-4">Apa yang Kami Tawarkan</h2>
                        <ul className="space-y-3 text-[var(--text-secondary)]">
                            <li className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">🗺️</span>
                                <span><strong className="text-[var(--text-primary)]">Peta Masjid Interaktif</strong> — Jelajahi 100+ masjid di Bandung dan Indonesia dalam peta yang mudah digunakan</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">📍</span>
                                <span><strong className="text-[var(--text-primary)]">Check-in Kunjungan</strong> — Catat setiap kunjunganmu ke masjid dengan satu tap</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">🛂</span>
                                <span><strong className="text-[var(--text-primary)]">Passport Digital</strong> — Kumpulkan stempel kunjungan di passport digital pribadimu</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">📊</span>
                                <span><strong className="text-[var(--text-primary)]">Dashboard Perjalanan</strong> — Lihat statistik lengkap: masjid dikunjungi, kota dijelajahi, dan streak harian</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">🎨</span>
                                <span><strong className="text-[var(--text-primary)]">Recap &amp; Share</strong> — Buat kartu recap Ramadan yang cantik dan bagikan ke media sosial</span>
                            </li>
                        </ul>
                    </section>

                    {/* FAQ Section */}
                    <section className="mb-10">
                        <h2 className="font-serif text-2xl font-medium mb-6">Pertanyaan yang Sering Diajukan</h2>
                        <div className="space-y-6">
                            <details className="group border-b border-[var(--border-light)] pb-4">
                                <summary className="cursor-pointer font-medium text-[var(--text-primary)] flex items-center justify-between">
                                    Apa itu Jejak Masjid?
                                    <span className="transition-transform group-open:rotate-180">▼</span>
                                </summary>
                                <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                                    Jejak Masjid adalah aplikasi web gratis dan open source yang membantu umat Muslim
                                    menjelajahi masjid, mencatat kunjungan, dan melacak perjalanan spiritual mereka
                                    selama Ramadan. Tersedia peta interaktif, passport digital, dashboard perjalanan,
                                    dan fitur recap yang bisa dibagikan ke media sosial.
                                </p>
                            </details>
                            <details className="group border-b border-[var(--border-light)] pb-4">
                                <summary className="cursor-pointer font-medium text-[var(--text-primary)] flex items-center justify-between">
                                    Apakah Jejak Masjid gratis?
                                    <span className="transition-transform group-open:rotate-180">▼</span>
                                </summary>
                                <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                                    Ya, Jejak Masjid 100% gratis dan open source. Tidak ada biaya berlangganan, iklan,
                                    atau fitur berbayar. Kode sumber tersedia di GitHub dan siapa saja bisa berkontribusi.
                                </p>
                            </details>
                            <details className="group border-b border-[var(--border-light)] pb-4">
                                <summary className="cursor-pointer font-medium text-[var(--text-primary)] flex items-center justify-between">
                                    Bagaimana cara check-in di masjid?
                                    <span className="transition-transform group-open:rotate-180">▼</span>
                                </summary>
                                <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                                    Cukup buka halaman Peta Masjid, temukan masjid yang ingin kamu kunjungi, klik marker-nya
                                    di peta, lalu tekan tombol &quot;Check-in&quot;. Kamu juga bisa menambahkan foto dan caption
                                    untuk setiap kunjungan.
                                </p>
                            </details>
                            <details className="group border-b border-[var(--border-light)] pb-4">
                                <summary className="cursor-pointer font-medium text-[var(--text-primary)] flex items-center justify-between">
                                    Masjid mana saja yang tersedia?
                                    <span className="transition-transform group-open:rotate-180">▼</span>
                                </summary>
                                <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                                    Saat ini database kami fokus pada masjid-masjid di sekitar Bandung, Jawa Barat, termasuk
                                    masjid bersejarah, masjid kampus, dan masjid lingkungan. Kami terus menambah data dan
                                    menerima kontribusi dari komunitas untuk menambahkan masjid baru.
                                </p>
                            </details>
                            <details className="group border-b border-[var(--border-light)] pb-4">
                                <summary className="cursor-pointer font-medium text-[var(--text-primary)] flex items-center justify-between">
                                    Bagaimana cara berkontribusi?
                                    <span className="transition-transform group-open:rotate-180">▼</span>
                                </summary>
                                <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                                    Jejak Masjid adalah proyek open source. Kamu bisa berkontribusi melalui GitHub kami
                                    dengan membuka issue, mengirim pull request, atau menambahkan data masjid baru.
                                    Semua kontribusi sangat dihargai!
                                </p>
                            </details>
                            <details className="group border-b border-[var(--border-light)] pb-4">
                                <summary className="cursor-pointer font-medium text-[var(--text-primary)] flex items-center justify-between">
                                    Apakah data saya aman?
                                    <span className="transition-transform group-open:rotate-180">▼</span>
                                </summary>
                                <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                                    Kami menjaga privasi data pengguna. Data check-in dan profil hanya digunakan untuk
                                    fitur aplikasi. Karena bersifat open source, kamu bisa memeriksa sendiri bagaimana
                                    data diproses di kode sumber kami.
                                </p>
                            </details>
                        </div>
                    </section>

                    {/* Tech & Open Source */}
                    <section className="mb-10">
                        <h2 className="font-serif text-2xl font-medium mb-4">Teknologi &amp; Open Source</h2>
                        <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                            Jejak Masjid dibangun dengan teknologi modern: Next.js, TypeScript, Tailwind CSS,
                            Leaflet, PostgreSQL, dan Drizzle ORM. Proyek ini sepenuhnya open source dan tersedia
                            di GitHub.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <Link
                                href="/map"
                                className="inline-flex items-center py-3 px-6 bg-[var(--text-primary)] text-white font-medium rounded-xl text-sm hover:bg-black transition-colors"
                            >
                                Mulai Jelajahi
                            </Link>
                            <a
                                href="https://github.com/imfunthanks/jejak-masjid"
                                className="inline-flex items-center py-3 px-6 border border-[var(--border-medium)] text-[var(--text-primary)] font-medium rounded-xl text-sm hover:bg-[var(--bg-surface)] transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub
                            </a>
                        </div>
                    </section>
                </article>
            </div>
        </>
    );
}
