"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

const avatarStyles = [
  "bg-purple-800 text-purple-200",
  "bg-teal-800 text-teal-200",
  "bg-coral-800 text-orange-200",
];

const initials = ["K", "L", "P"];

export default function SocialProof() {
  const { t } = useI18n();

  return (
    <section id="testimonials" className="bg-navy-800/30 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {t.socialProof.stats.map(({ value, label, sub }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="bg-navy-800/60 border border-navy-600/30 rounded-2xl p-5 text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">{value}</div>
                <div className="text-white text-sm font-semibold mb-1">{label}</div>
                <div className="text-white/40 text-xs">{sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center mb-10">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            {t.socialProof.label}
          </p>
          <h2 className="text-3xl font-bold text-white">{t.socialProof.title}</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {t.socialProof.items.map(({ quote, name, role, company }, i) => (
            <Reveal key={name} delay={i * 0.1}>
              <div className="bg-navy-800/60 border border-navy-600/20 rounded-2xl p-6 h-full flex flex-col">
                <div className="flex gap-0.5 mb-4" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#7F77DD">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6 italic flex-1">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${avatarStyles[i]} flex items-center justify-center text-sm font-bold shrink-0`}
                  >
                    {initials[i]}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{name}</div>
                    <div className="text-white/40 text-xs">
                      {role} · {company}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
