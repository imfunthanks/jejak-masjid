"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Map, Stamp, BarChart3, Share2, ArrowRight } from "lucide-react";


import HeroIllustration from "@/components/home/HeroIllustration";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  {
    icon: Map,
    title: "Peta Masjid",
    desc: "Jelajahi 100+ masjid di Indonesia dalam peta interaktif. Dari masjid bersejarah hingga masjid kampus.",
    color: "var(--color-primary)",
  },
  {
    icon: Stamp,
    title: "Check-in & Stempel",
    desc: "Catat kunjunganmu dengan satu tap. Kumpulkan stempel di passport digital pribadimu.",
    color: "var(--color-accent)",
  },
  {
    icon: BarChart3,
    title: "Journey Dashboard",
    desc: "Lihat statistik perjalananmu — masjid dikunjungi, kota dijelajahi, dan streak harianmu.",
    color: "var(--color-primary-light)",
  },
  {
    icon: Share2,
    title: "Recap & Share",
    desc: "Buat kartu recap perjalanan Ramadanmu yang cantik dan bagikan ke teman-temanmu.",
    color: "var(--color-accent-dark)",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative selection:bg-[var(--color-primary-light)] selection:text-white">
      {/* ═══ HERO ═══ */}
      <section className="relative z-10 px-6 pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col items-start text-left"
          >
            {/* Badge */}
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-transparent text-[var(--text-secondary)] text-sm font-medium rounded-full border border-[var(--border-medium)] mb-8 tracking-widest uppercase"
            >
              Ramadan 1447H
            </motion.span>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-[var(--text-primary)] leading-[1.1] mb-6 tracking-tight"
            >
              How many mosques<br />will you visit<br />this Ramadan?
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed mb-10 font-light"
            >
              Explore mosques around Bandung, track your visits, and build your spiritual journey.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col w-full max-w-xs">
              <Link
                href="/map"
                className="flex items-center justify-center py-4 px-8 bg-[var(--text-primary)] text-white rounded-xl font-medium text-base hover:bg-black transition-colors duration-200"
              >
                Start Your Journey
              </Link>
            </motion.div>
          </motion.div>

          {/* 2D Illustrated Map Container */}
          <div className="flex-1 w-full lg:w-auto relative min-h-[400px] lg:min-h-[500px]">
            <HeroIllustration />
          </div>

        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="relative z-10 px-6 pb-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            variants={fadeUp}
            className="font-serif text-2xl md:text-3xl font-normal text-center text-[var(--text-primary)] mb-4 tracking-tight"
          >
            Siklus Perjalanan
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-[var(--text-secondary)] text-lg mb-16 max-w-lg mx-auto"
          >
            Platform eksplorasi spiritual yang mengubah setiap langkahmu menjadi kenangan.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="bg-transparent p-8 border-l border-[var(--border-light)] transition-colors duration-300 group hover:bg-[var(--bg-surface)] hover:border-[var(--color-primary)]"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                    style={{ backgroundColor: `var(--bg-main)` }}
                  >
                    <Icon size={22} className="text-[var(--text-primary)]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[var(--text-primary)] mb-3">
                    {f.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-[0.95rem] font-light">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="relative z-10 px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto bg-white border border-[var(--border-light)] rounded-[var(--radius-xl)] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="font-serif text-3xl md:text-5xl font-normal mb-6 text-[var(--text-primary)] tracking-tight">
              Mulai Jurnal Spiritualmu
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-lg font-light leading-relaxed">
              Jelajahi dan catat kehadiran di masjid-masjid bersejarah Bandung selama bulan suci Ramadan.
            </p>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 py-3.5 px-8 bg-[var(--text-primary)] text-white font-medium rounded-xl text-[0.95rem] hover:bg-black transition-colors"
            >
              Mulai Menjelajah <ArrowRight size={18} strokeWidth={2} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
