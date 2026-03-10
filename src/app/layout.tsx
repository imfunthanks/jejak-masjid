import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://jejak-masjid-62zo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Jejak Masjid — Lacak Perjalanan Masjid Ramadanmu",
    template: "%s — Jejak Masjid",
  },
  description:
    "Jelajahi masjid, catat kunjunganmu, lacak progres Ramadan, dan bagikan perjalanan spiritualmu. Aplikasi peta masjid interaktif 100% open source.",
  keywords: [
    "jejak masjid", "masjid", "ramadan", "tarawih", "peta masjid",
    "check-in masjid", "masjid bandung", "perjalanan ramadan",
    "tarawih keliling", "mosque tracker", "ramadan journey",
    "masjid indonesia", "spiritual journey", "mosque map",
  ],
  authors: [{ name: "Jejak Masjid Team", url: BASE_URL }],
  creator: "Jejak Masjid",
  publisher: "Jejak Masjid",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jejak Masjid — Lacak Perjalanan Masjid Ramadanmu",
    description: "Jelajahi masjid, catat kunjungan, dan bagikan perjalanan spiritual Ramadanmu. 100% open source.",
    siteName: "Jejak Masjid",
    url: BASE_URL,
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jejak Masjid — Lacak Perjalanan Masjid Ramadanmu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jejak Masjid — Lacak Perjalanan Masjid Ramadanmu",
    description: "Jelajahi masjid, catat kunjungan, dan bagikan perjalanan spiritual Ramadanmu.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Jejak Masjid",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.png`,
      },
      sameAs: [
        "https://github.com/imfunthanks/jejak-masjid",
      ],
      description: "Platform eksplorasi masjid dan pelacakan perjalanan spiritual Ramadan. 100% open source.",
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Jejak Masjid",
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/map?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[var(--bg-main)] text-[var(--text-primary)]`}>
        <Providers>
          <Navbar />
          <Breadcrumbs />
          <main className="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
