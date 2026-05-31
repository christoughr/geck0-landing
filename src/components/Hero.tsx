"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SynapseCanvas from "./SynapseCanvas";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-navy-900 pt-16">
      <SynapseCanvas />

      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(127,119,221,0.08)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(29,158,117,0.06)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-600/30 rounded-full px-4 py-1.5 text-sm text-purple-200 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          {t.hero.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none"
        >
          <span className="text-white">{t.hero.headline1}</span>
          <br />
          <span className="gradient-text">{t.hero.headline2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t.hero.sub}
          <br className="hidden md:block" />
          {t.hero.sub2}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/#contact"
            className="w-full sm:w-auto bg-purple-400 hover:bg-purple-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200 text-base"
          >
            {t.hero.ctaPrimary}
          </Link>
          <Link
            href="/#how-it-works"
            className="w-full sm:w-auto border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-colors duration-200 text-base"
          >
            {t.hero.ctaSecondary}
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 text-sm text-white/30"
        >
          {t.hero.socialProof}{" "}
          <span className="text-white/60 font-medium">47</span>
          {t.hero.socialProofSuffix}
        </motion.p>
      </div>

      <Link
        href="/#features"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/50 text-xs transition-colors"
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
