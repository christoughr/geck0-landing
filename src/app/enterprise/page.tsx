"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";

export default function EnterprisePage() {
  const { t } = useI18n();

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Reveal className="text-center mb-16">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            Enterprise
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t.enterprise.title}
          </h1>
          <p className="text-xl text-white/50 mb-2">{t.enterprise.subtitle}</p>
          <p className="text-white/40 max-w-xl mx-auto">{t.enterprise.desc}</p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {t.enterprise.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="bg-navy-800/60 border border-navy-600/30 rounded-2xl p-6">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center">
          <Link
            href="/#contact"
            className="inline-block bg-purple-400 hover:bg-purple-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            {t.enterprise.cta} →
          </Link>
        </Reveal>
      </div>
    </PageShell>
  );
}
