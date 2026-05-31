"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

export default function Faq() {
  const { t } = useI18n();

  return (
    <section id="faq" className="bg-navy-800/30 py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-sm text-teal-400 font-semibold tracking-widest uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.faq.title}</h2>
        </Reveal>

        <div className="space-y-4">
          {t.faq.items.map(({ q, a }, i) => (
            <Reveal key={q} delay={i * 0.08}>
              <details className="group bg-navy-800/60 border border-navy-600/30 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 text-white font-medium text-sm list-none">
                  {q}
                  <span className="text-purple-400 ml-4 shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-white/55 text-sm leading-relaxed border-t border-navy-600/20 pt-4">
                  {a}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
