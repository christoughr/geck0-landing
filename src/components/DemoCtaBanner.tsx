"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

/** Mid-page CTA driving visitors to the product walkthrough. */
export default function DemoCtaBanner() {
  const { t } = useI18n();

  return (
    <section className="bg-gradient-to-r from-purple-900/30 via-navy-900 to-teal-900/20 border-y border-navy-600/30 py-14 px-4 sm:px-6">
      <Reveal className="max-w-3xl mx-auto text-center">
        <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-2">
          {t.demoCta.label}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t.demoCta.title}</h2>
        <p className="text-white/50 text-sm sm:text-base mb-6">{t.demoCta.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/demo"
            className="min-h-[48px] inline-flex items-center justify-center bg-purple-400 hover:bg-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            {t.demoCta.primary}
          </Link>
          <Link
            href="#contact"
            className="min-h-[48px] inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-8 py-3 rounded-xl transition-colors"
          >
            {t.demoCta.secondary}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
