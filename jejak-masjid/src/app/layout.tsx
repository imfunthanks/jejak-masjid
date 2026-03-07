import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
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

export const metadata: Metadata = {
  title: "Jejak Masjid — Track Your Ramadan Mosque Journey",
  description:
    "Discover mosques, check in your visits, track your Ramadan progress, and share your journey. 100% open source.",
  keywords: ["mosque", "masjid", "ramadan", "journey", "check-in", "map", "indonesia"],
  openGraph: {
    title: "Jejak Masjid",
    description: "Track your Ramadan mosque journey. Discover, check in, and share.",
    siteName: "Jejak Masjid",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[var(--bg-main)] text-[var(--text-primary)]`}>
        <Providers>
          <Navbar />
          <main className="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
