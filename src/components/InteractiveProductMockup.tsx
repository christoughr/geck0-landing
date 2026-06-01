"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";
import AppShellFrame from "./AppShellFrame";

export default function InteractiveProductMockup() {
  const { t } = useI18n();
  const scenarios = t.demo.scenarios;
  const [active, setActive] = useState(0);
  const [typing, setTyping] = useState(false);
  const current = scenarios[active];

  const pickScenario = (index: number) => {
    if (index === active) return;
    setTyping(true);
    setActive(index);
    window.setTimeout(() => setTyping(false), 400);
  };

  return (
    <Reveal delay={0.15}>
      <p className="text-center text-white/40 text-sm mb-4 px-2">{t.demo.interactiveHint}</p>

      <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-2xl mx-auto px-2">
        {scenarios.map((scenario, i) => (
          <button
            key={scenario.query}
            type="button"
            onClick={() => pickScenario(i)}
            className={`text-xs px-3 py-2 rounded-full border transition-colors max-w-full truncate ${
              i === active
                ? "bg-purple-400/20 border-purple-400/50 text-purple-200"
                : "border-navy-600/40 text-white/40 hover:text-white/70 hover:border-white/20"
            }`}
          >
            Q{i + 1}
          </button>
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl w-full px-1">
        <AppShellFrame activeNav={2} navLabels={t.mockup.sidebar}>
          <div
            className={`space-y-4 transition-opacity duration-300 ${typing ? "opacity-40" : "opacity-100"}`}
          >
            <div className="bg-navy-900/60 border border-purple-600/30 rounded-xl p-4">
              <p className="text-xs text-purple-400 mb-2">You</p>
              <p className="text-sm text-white/80 break-words">{current.query}</p>
            </div>

            <div className="bg-navy-900/40 border border-teal-600/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-teal-400">geck0</span>
                <span className="text-xs text-white/30">· 2.1s</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4 break-words">{current.answer}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-navy-700/60 text-white/50 px-2.5 py-1 rounded-full">
                  📄 {current.sources}
                </span>
                <span className="text-xs bg-coral-400/10 text-coral-400 border border-coral-400/20 px-2.5 py-1 rounded-full break-words">
                  ⚡ {current.insight}
                </span>
              </div>
            </div>
          </div>
        </AppShellFrame>
      </div>
    </Reveal>
  );
}
