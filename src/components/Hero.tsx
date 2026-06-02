"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { siteConfig } from "@/config/site";
import { getAppLoginUrl } from "@/lib/app-url";
import WaitlistForm from "./WaitlistForm";

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
    <section className="hero-section relative min-h-[100dvh] w-full max-w-[100vw] flex flex-col items-center justify-center overflow-x-clip bg-navy-900 pt-16">
      <SynapseCanvas key={canvasKey} />

      <div
        className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 rounded-full blur-3xl pointer-events-none -translate-x-1/2"
        style={{ background: "rgba(127,119,221,0.12)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-40 sm:w-64 h-40 sm:h-64 rounded-full blur-3xl pointer-events-none translate-x-1/4"
        style={{ background: "rgba(29,158,117,0.09)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full min-w-0 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex max-w-full items-center gap-2 bg-purple-900/40 border border-purple-600/30 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-purple-200 mb-6 sm:mb-8"
        >
          <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-teal-400 animate-pulse" />
          <span className="truncate">{t.hero.badge}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="hero-headline font-bold tracking-tight mb-5 sm:mb-6 px-1 w-full"
        >
          <span className="hero-headline__line text-white">{t.hero.headline1}</span>
          <span className="hero-headline__line hero-headline__line--accent gradient-text">
            {t.hero.headline2}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-8 sm:mb-10 w-full min-w-0 px-1"
        >
          <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed break-words">
            {t.hero.sub}
          </p>
          <p className="mt-3 text-sm sm:text-base text-white/45 max-w-2xl mx-auto leading-relaxed break-words">
            {t.hero.sub2}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col w-full min-w-0 max-w-md mx-auto gap-3 px-1 sm:max-w-none sm:flex-row sm:justify-center sm:items-center"
        >
          <Link
            href="#contact"
            className="w-full min-w-0 sm:w-auto min-h-[48px] flex items-center justify-center bg-purple-400 hover:bg-purple-600 text-white font-semibold px-6 sm:px-8 py-3.5 rounded-xl transition-colors duration-200 text-base focus-visible:ring-2 focus-visible:ring-purple-400/60"
          >
            {t.hero.ctaPrimary}
          </Link>
          <Link
            href="/demo"
            className="w-full min-w-0 sm:w-auto min-h-[48px] flex items-center justify-center border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-6 sm:px-8 py-3.5 rounded-xl transition-colors duration-200 text-base focus-visible:ring-2 focus-visible:ring-white/20"
          >
            {t.hero.ctaSecondary}
          </Link>
        </motion.div>

        <p className="md:hidden mt-3 text-center">
          <Link
            href="#contact"
            className="text-sm text-purple-300 hover:text-purple-200 underline underline-offset-2"
          >
            {t.hero.waitlistMobileLink}
          </Link>
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          id="hero-waitlist"
          className="mt-6 w-full hidden md:block min-w-0 max-w-md mx-auto px-1 scroll-mt-24"
        >
          <WaitlistForm source="hero" variant="compact" showLegal={false} />
          <p className="mt-4 text-center">
            <a
              href={getAppLoginUrl()}
              className="text-sm text-purple-300 hover:text-purple-200 underline underline-offset-2"
            >
              {t.hero.appLoginLink}
            </a>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 sm:mt-8 text-xs sm:text-sm text-white/30 px-2 break-words"
        >
          {t.hero.socialProof}{" "}
          <span className="text-white/60 font-medium">{siteConfig.betaCustomerCount}</span>
          {t.hero.socialProofSuffix}
        </motion.p>
      </div>

      <Link
        href="/#features"
        className="hero-scroll absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/50 text-xs transition-colors min-h-[44px] justify-end"
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
