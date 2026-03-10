import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "Jejak Masjid — Lacak Perjalanan Masjid Ramadanmu",
  description:
    "Jelajahi masjid, catat kunjunganmu, lacak progres Ramadan, dan bagikan perjalanan spiritualmu. Aplikasi peta masjid interaktif 100% open source untuk Muslim di Indonesia.",
  alternates: {
    canonical: "/",
  },
};

// Server Component — content is SSR-rendered for crawlers
// Animations are handled by the HomeClient client component
export default function Home() {
  return <HomeClient />;
}
