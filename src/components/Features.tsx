"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { featureAnchors } from "@/config/site";
import Reveal from "./Reveal";

const icons = [
  (
    <svg key="graph" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  (
    <svg key="qa" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.66z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.66z"/>
    </svg>
  ),
  (
    <svg key="pulse" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
];

const styles = [
  { color: "text-purple-400", bg: "bg-purple-900/20 border-purple-600/20" },
  { color: "text-teal-400", bg: "bg-teal-900/20 border-teal-600/20" },
  { color: "text-coral-400", bg: "bg-orange-900/20 border-orange-600/20" },
];

export default function Features() {
  const { t } = useI18n();

  return (
    <section id="features" className="bg-navy-800/40 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-sm text-teal-400 font-semibold tracking-widest uppercase mb-3">
            {t.features.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t.features.title}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {t.features.items.map(({ tag, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div
                id={featureAnchors[i]}
                className={`${styles[i].bg} border rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200 h-full scroll-mt-24`}
              >
                <div className={`${styles[i].color} mb-4`}>{icons[i]}</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold ${styles[i].color}`}>{tag}</span>
                  <h3 className="text-white font-semibold text-lg">{title}</h3>
                </div>
                <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
