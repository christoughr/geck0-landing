"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";
import AppShellFrame from "./AppShellFrame";

export default function ProductMockup() {
  const { t } = useI18n();

  return (
    <section className="bg-navy-900 py-24 px-4 sm:px-6 overflow-x-clip">
      <div className="max-w-5xl mx-auto w-full">
        <Reveal className="text-center mb-14">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            {t.mockup.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.mockup.title}</h2>
          <p className="text-white/50 text-lg">{t.mockup.subtitle}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto max-w-3xl w-full">
            <div
              className="absolute inset-0 -z-10 rounded-3xl blur-2xl opacity-30 pointer-events-none"
              style={{ background: "linear-gradient(135deg, #7F77DD33, #1D9E7533)" }}
              aria-hidden="true"
            />

            <AppShellFrame activeNav={2} navLabels={t.mockup.sidebar}>
              <div className="space-y-4">
                <div className="bg-navy-900/60 border border-purple-600/30 rounded-xl p-4">
                  <p className="text-xs text-purple-400 mb-2">You</p>
                  <p className="text-sm text-white/80 break-words">{t.mockup.query}</p>
                </div>

                <div className="bg-navy-900/40 border border-teal-600/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-teal-400">geck0</span>
                    <span className="text-xs text-white/30">· 2.1s</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-4 break-words">
                    {t.mockup.answer}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-navy-700/60 text-white/50 px-2.5 py-1 rounded-full">
                      📄 {t.mockup.sources}
                    </span>
                    <span className="text-xs bg-coral-400/10 text-coral-400 border border-coral-400/20 px-2.5 py-1 rounded-full break-words">
                      ⚡ {t.mockup.insight}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1 opacity-60 flex-wrap">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          i % 3 === 0
                            ? "bg-purple-400"
                            : i % 3 === 1
                              ? "bg-teal-400"
                              : "bg-coral-400"
                        }`}
                      />
                      {i < 4 && <div className="w-6 h-px bg-purple-400/30 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </AppShellFrame>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
