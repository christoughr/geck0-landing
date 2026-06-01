"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

export default function LogoBar() {
  const { t } = useI18n();

  return (
    <section className="border-y border-navy-700/30 bg-navy-900/50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-2">
            {t.logoBar.label}
          </p>
          <p className="text-center text-white/25 text-xs mb-6">{t.logoBar.disclaimer}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {t.logoBar.industries.map((name) => (
              <span
                key={name}
                className="text-white/30 text-xs font-medium tracking-wide px-3 py-1.5 rounded-full border border-navy-600/40 bg-navy-800/40"
              >
                {name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
