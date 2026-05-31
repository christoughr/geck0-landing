"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

const styles = [
  { color: "border-purple-400", badge: "bg-purple-900/40 text-purple-200 border-purple-600/30" },
  { color: "border-coral-400", badge: "bg-coral-900/30 text-orange-200 border-orange-600/30" },
  { color: "border-teal-400", badge: "bg-teal-900/30 text-teal-200 border-teal-600/30" },
];

export default function Problem() {
  const { t } = useI18n();

  return (
    <section className="bg-navy-900 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            {t.problem.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t.problem.title}
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            {t.problem.subtitle}{" "}
            <span className="text-coral-400 font-bold">19%</span>
            {t.problem.subtitleSuffix}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {t.problem.items.map(({ title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div
                className={`bg-navy-800/60 border-t-2 ${styles[i].color} rounded-2xl p-6 hover:bg-navy-700/60 transition-colors duration-200 h-full`}
              >
                <div
                  className={`inline-block text-xs font-semibold border rounded-full px-3 py-1 mb-4 ${styles[i].badge}`}
                >
                  {title}
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
