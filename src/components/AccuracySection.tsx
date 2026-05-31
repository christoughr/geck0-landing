"use client";

import Reveal from "./Reveal";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Link from "next/link";

export default function AccuracySection() {
  const { t } = useI18n();

  return (
    <section id="accuracy" className="py-16 sm:py-24 px-4 sm:px-6 bg-navy-800/30">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            {t.accuracy.label}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.accuracy.title}</h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">{t.accuracy.subtitle}</p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {t.accuracy.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              <div className="bg-navy-800/60 border border-navy-600/30 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-purple-300 mb-1">{m.value}</p>
                <p className="text-white text-sm font-medium mb-1">{m.label}</p>
                <p className="text-white/40 text-xs">{m.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="bg-navy-900/50 border border-navy-600/30 rounded-2xl p-6 sm:p-8">
            <h3 className="text-white font-semibold mb-3">{t.accuracy.methodTitle}</h3>
            <ul className="space-y-2 mb-6">
              {t.accuracy.methodItems.map((item) => (
                <li key={item} className="text-white/55 text-sm flex gap-2">
                  <span className="text-teal-400 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/35 text-xs leading-relaxed mb-4">{t.accuracy.disclaimer}</p>
            <Link
              href="/docs#accuracy"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              {t.accuracy.docsLink} →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
