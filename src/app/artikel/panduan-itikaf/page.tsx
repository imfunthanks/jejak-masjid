import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
    title: "Panduan Lengkap Itikaf 10 Hari Terakhir Ramadan",
    description:
        "Panduan lengkap tata cara itikaf di masjid pada 10 hari terakhir Ramadan. Syarat, niat, keutamaan, dan masjid rekomendasi di Bandung.",
    alternates: {
        canonical: "/artikel/panduan-itikaf",
    },
};

const BASE_URL = "https://jejak-masjid-62zo.vercel.app";

// JSON-LD Article Schema + FAQ Schema for GEO
const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${BASE_URL}/artikel/panduan-itikaf#article`,
        headline: "Panduan Lengkap Itikaf di 10 Hari Terakhir Ramadan",
        description: "Panduan lengkap tata cara, syarat, niat, dan keutamaan itikaf di masjid pada 10 hari terakhir Ramadan.",
        author: {
            "@type": "Organization",
            name: "Jejak Masjid",
            url: BASE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: "Jejak Masjid",
            logo: {
                "@type": "ImageObject",
                url: `${BASE_URL}/og-image.png`,
            },
        },
        datePublished: "2024-03-01T08:00:00+08:00",
        dateModified: new Date().toISOString(),
        inLanguage: "id-ID",
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${BASE_URL}/artikel/panduan-itikaf#faq`,
        mainEntity: [
            {
                "@type": "Question",
                name: "Apa niat untuk melakukan itikaf?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: 'Niat itikaf secara umum adalah: "Nawaitul i’tikāfa fī hādzal masjidi lillāhi ta‘ālā" yang artinya "Aku berniat itikaf di masjid ini karena Allah ta’ala."',
                },
            },
            {
                "@type": "Question",
                name: "Apa syarat sah itikaf?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Syarat sah itikaf meliputi: beragama Islam, berakal sehat, suci dari hadas besar (haid dan junub), berniat itikaf, dan dilakukan di dalam masjid.",
                },
            },
        ],
    },
];

export default function ArtikelItikaf() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pt-16 pb-24">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-8 pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            <ArrowLeft size={16} /> Kembali ke Beranda
                        </Link>
                    </div>

                    <article>
                        {/* Header */}
                        <header className="mb-12">
                            <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-full">
                                PANDUAN RAMADAN
                            </span>
                            <h1 className="font-serif text-4xl md:text-5xl font-normal leading-tight tracking-tight mb-6">
                                Panduan Lengkap Itikaf: Syarat, Niat, dan Keutamaan di 10 Hari Terakhir
                            </h1>
                            <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-light border-l-4 border-[var(--color-primary)] pl-6">
                                Menurut syariat Islam, <strong>itikaf adalah</strong> perbuatan berdiam diri di dalam masjid dengan niat beribadah untuk mendekatkan diri kepada Allah SWT. Ibadah ini sangat dianjurkan, terutama saat 10 malam terakhir bulan Ramadan.
                            </p>
                        </header>

                        {/* Content Body */}
                        <div className="prose prose-slate prose-lg max-w-none text-[var(--text-secondary)] leading-relaxed
                            prose-headings:font-serif prose-headings:font-medium prose-headings:text-[var(--text-primary)]
                            prose-a:text-[var(--color-primary)] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-[var(--text-primary)] prose-strong:font-semibold">

                            <h2 className="text-2xl mt-12 mb-4">Keutamaan Itikaf di Bulan Ramadan</h2>
                            <p>
                                Sepuluh hari terakhir adalah puncak dari bulan suci Ramadan. Pada hari-hari tersebut, ibadah ditekankan untuk mengejar <strong>Lailatul Qadar</strong>—malam yang lebih mulia dari seribu bulan. Rasulullah SAW mencontohkan secara langsung agar memperbanyak itikaf di waktu tersebut.
                            </p>

                            <h2 className="text-2xl mt-12 mb-4">Syarat Sah Melaksanakan Itikaf</h2>
                            <p>Agar itikaf yang dijalankan sah menurut syariat, ada beberapa syarat mutlak yang harus dipenuhi:</p>
                            <ul>
                                <li><strong>Beragama Islam</strong> dan berakal sehat.</li>
                                <li><strong>Suci dari hadas besar</strong> (junub, haid, nifas).</li>
                                <li><strong>Niat</strong> yang diucapkan di dalam hati.</li>
                                <li><strong>Berdiam diri di dalam masjid</strong> (bukan mushola rumah).</li>
                            </ul>

                            <h2 className="text-2xl mt-12 mb-4">Bacaan Niat Itikaf</h2>
                            <p>
                                Untuk memulai itikaf, seseorang wajib mengucapkan niat. Berikut adalah niat itikaf (mutlak) secara umum yang bisa dilafalkan:
                            </p>
                            <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-light)] my-6 text-center">
                                <p className="text-2xl font-serif text-[var(--text-primary)] mb-4 leading-loose" dir="rtl" translate="no">
                                    نَوَيْتُ الاِعْتِكَافَ فِي هَذَا المَسْجِدِ لِلّٰهِ تَعَالَى
                                </p>
                                <p className="italic text-sm text-[var(--text-secondary)]">
                                    "Nawaitul i’tikāfa fī hādzal masjidi lillāhi ta‘ālā."
                                </p>
                                <p className="font-medium mt-3 text-[var(--text-primary)]">
                                    Artinya: "Aku berniat itikaf di masjid ini karena Allah ta'ala."
                                </p>
                            </div>

                            <h2 className="text-2xl mt-12 mb-4">Apa Saja yang Membatalkan Itikaf?</h2>
                            <p>
                                Ada berbagai tindakan yang secara otomatis membatalkan itikaf, yaitu:
                            </p>
                            <ul>
                                <li>Keluar dari lingkungan masjid tanpa adanya udzur (alasan) syar'i.</li>
                                <li>Melakukan hubungan suami istri.</li>
                                <li>Hilang akal (gila) atau mabuk.</li>
                                <li>Bagi wanita: datang bulan (haid) atau nifas.</li>
                            </ul>

                            <h2 className="text-2xl mt-12 mb-4">Rekomendasi Masjid untuk Itikaf</h2>
                            <p>
                                Bagi kamu yang merencanakan itikaf penuh atau sebagian malam di Bandung, kamu dapat menggunakan fitur
                                <Link href="/map"> Peta Masjid </Link> di aplikasi Jejak Masjid. Kami memiliki data masjid yang secara khusus mengakomodasi jamaah itikaf, baik dari segi fasilitas hingga sahur gratis.
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
