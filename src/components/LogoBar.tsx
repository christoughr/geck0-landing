"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

export default function LogoBar() {
  const { t } = useI18n();

  return (
    <section className="border-y border-navy-700/30 bg-navy-900/50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-6">
            {t.logoBar.label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {t.logoBar.companies.map((name) => (
              <span
                key={name}
                className="text-white/25 hover:text-white/40 text-sm font-semibold tracking-wide transition-colors"
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
