"use client";

import { Lock, Shield, Globe, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

const icons = [Lock, Shield, Globe, Zap];

export default function Security() {
  const { t } = useI18n();

  return (
    <section className="bg-navy-900 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            {t.security.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.security.title}</h2>
          <p className="text-white/50 max-w-xl mx-auto">{t.security.subtitle}</p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.security.items.map(({ title, desc }, i) => {
            const Icon = icons[i] ?? Lock;
            return (
              <Reveal key={title} delay={i * 0.1}>
                <div className="bg-navy-800/60 border border-navy-600/30 rounded-2xl p-6 h-full">
                  <Icon className="w-6 h-6 text-purple-400 mb-3" aria-hidden="true" />
                  <h3 className="text-white font-semibold mb-2">{title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
