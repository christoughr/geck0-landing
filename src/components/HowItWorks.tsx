"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

const stepStyles = [
  { color: "bg-purple-400", border: "border-purple-600/30" },
  { color: "bg-teal-400", border: "border-teal-600/30" },
  { color: "bg-coral-400", border: "border-orange-600/30" },
];

const integrations = [
  "Slack", "Notion", "Google Drive", "Confluence", "Jira", "GitHub", "Figma", "Linear",
];

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how-it-works" className="bg-navy-900 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-sm text-coral-400 font-semibold tracking-widest uppercase mb-3">
            {t.howItWorks.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t.howItWorks.title}
          </h2>
        </Reveal>

        <div className="relative">
          <div
            className="hidden md:block absolute top-8 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-gradient-to-r from-purple-600/40 via-teal-600/40 to-coral-600/40"
            aria-hidden="true"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {t.howItWorks.steps.map(({ title, desc }, i) => (
              <Reveal key={title} delay={i * 0.15}>
                <div className="relative flex flex-col">
                  <div
                    className={`w-14 h-14 ${stepStyles[i].color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-5 shrink-0 z-10`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className={`bg-navy-800/60 border ${stepStyles[i].border} rounded-2xl p-6 flex-1`}
                  >
                    <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-14 text-center" delay={0.3}>
          <p className="text-white/40 text-sm mb-5">{t.howItWorks.integrations}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {integrations.map((name) => (
              <span
                key={name}
                className="bg-navy-800/60 border border-navy-600/40 text-white/50 text-xs px-3 py-1.5 rounded-full"
              >
                {name}
              </span>
            ))}
            <span className="text-white/30 text-xs">{t.howItWorks.moreIntegrations}</span>
            <Link href="/integrations" className="text-purple-400 text-xs hover:text-purple-300 ml-1">
              →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
