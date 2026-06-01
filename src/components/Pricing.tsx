"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

interface PricingProps {
  showViewAll?: boolean;
}

export default function Pricing({ showViewAll = true }: PricingProps) {
  const { t } = useI18n();

  const planStyles = [
    { featured: false, color: "border-navy-600/40" },
    { featured: true, color: "border-purple-400" },
    { featured: false, color: "border-navy-600/40" },
  ];

  return (
    <section id="pricing" className="bg-navy-900 py-24 px-4 sm:px-6 overflow-x-clip">
      <div className="max-w-5xl mx-auto w-full">
        <Reveal className="text-center mb-14">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            {t.pricing.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.pricing.title}</h2>
          <p className="text-white/50">{t.pricing.subtitle}</p>
          <p className="text-white/35 text-xs mt-3 max-w-2xl mx-auto leading-relaxed">
            {t.pricing.betaNote}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {t.pricing.plans.map((plan, i) => {
            const { featured, color } = planStyles[i];
            return (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl p-6 border-2 ${color} ${
                    featured ? "bg-navy-700/80" : "bg-navy-800/60"
                  } h-full flex flex-col`}
                >
                  {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-400 text-white text-xs font-bold px-4 py-1 rounded-full">
                      {t.pricing.featured}
                    </div>
                  )}

                  <div className="mb-5">
                    <p
                      className={`text-sm font-semibold mb-1 ${featured ? "text-purple-300" : "text-white/50"}`}
                    >
                      {plan.name}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0 mb-1">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-white/40 text-sm">{plan.period}</span>
                    </div>
                    <p className="text-white/40 text-xs">{plan.users}</p>
                  </div>

                  <p className="text-white/60 text-sm mb-5 pb-5 border-b border-navy-600/40">{plan.desc}</p>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                        <svg
                          className={`shrink-0 mt-0.5 ${featured ? "text-purple-400" : "text-teal-400"}`}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="break-words">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.name === "Enterprise" ? "/enterprise" : "/#contact"}
                    className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                      featured
                        ? "bg-purple-400 hover:bg-purple-600 text-white"
                        : "border border-white/20 hover:border-white/40 text-white/70 hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        {showViewAll && (
          <Reveal className="text-center mt-10">
            <Link
              href="/pricing"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              {t.pricing.viewAll}
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
