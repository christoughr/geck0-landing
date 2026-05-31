"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

const SynapseCanvas = dynamic(() => import("./SynapseCanvas"), { ssr: false });

export default function Hero() {
  const { t } = useI18n();
  const [canvasKey, setCanvasKey] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setCanvasKey((k) => k + 1);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-navy-900 pt-16">
      <SynapseCanvas key={canvasKey} />

      <div
        className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(127,119,221,0.12)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(29,158,117,0.09)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-600/30 rounded-full px-4 py-1.5 text-xs sm:text-sm text-purple-200 mb-6 sm:mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          {t.hero.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-5 sm:mb-6 leading-[1.1]"
        >
          <span className="text-white">{t.hero.headline1}</span>
          <br />
          <span className="gradient-text">{t.hero.headline2}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-8 sm:mb-10 px-2"
        >
          <p className="text-[13px] sm:text-sm md:text-base lg:text-lg text-white/60 max-w-[100vw] md:max-w-none md:whitespace-nowrap mx-auto leading-snug">
            {t.hero.sub}
          </p>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed">
            {t.hero.sub2}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 px-2"
        >
          <Link
            href="/#contact"
            className="w-full sm:w-auto min-h-[48px] flex items-center justify-center bg-purple-400 hover:bg-purple-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200 text-base focus-visible:ring-2 focus-visible:ring-purple-400/60"
          >
            {t.hero.ctaPrimary}
          </Link>
          <Link
            href="/#how-it-works"
            className="w-full sm:w-auto min-h-[48px] flex items-center justify-center border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-colors duration-200 text-base focus-visible:ring-2 focus-visible:ring-white/20"
          >
            {t.hero.ctaSecondary}
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 sm:mt-8 text-xs sm:text-sm text-white/30"
        >
          {t.hero.socialProof}{" "}
          <span className="text-white/60 font-medium">47</span>
          {t.hero.socialProofSuffix}
        </motion.p>
      </div>

      <Link
        href="/#features"
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/50 text-xs transition-colors min-h-[44px] justify-end"
      >
        <span>{t.hero.scroll}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="animate-bounce"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </section>
  );
}
