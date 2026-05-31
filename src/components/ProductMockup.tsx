"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

export default function ProductMockup() {
  const { t } = useI18n();

  return (
    <section className="bg-navy-900 py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            {t.mockup.label}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t.mockup.title}
          </h2>
          <p className="text-white/50 text-lg">{t.mockup.subtitle}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto max-w-3xl">
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-40 pointer-events-none"
              style={{ background: "linear-gradient(135deg, #7F77DD33, #1D9E7533)" }}
              aria-hidden="true"
            />

            <div className="relative bg-navy-800 border border-navy-600/50 rounded-2xl overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-navy-700/60 border-b border-navy-600/40">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-coral-400/70" />
                  <span className="w-3 h-3 rounded-full bg-teal-400/70" />
                  <span className="w-3 h-3 rounded-full bg-purple-400/70" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-white/30">app.geck0.ai</span>
                </div>
              </div>

              <div className="flex min-h-[320px]">
                {/* Sidebar */}
                <div className="hidden sm:block w-48 border-r border-navy-600/30 p-4 space-y-3">
                  {t.mockup.sidebar.map((item, i) => (
                    <div
                      key={item}
                      className={`text-xs px-3 py-2 rounded-lg ${
                        i === 2
                          ? "bg-purple-400/20 text-purple-300"
                          : "text-white/30"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 md:p-6 space-y-4">
                  <div className="bg-navy-900/60 border border-purple-600/30 rounded-xl p-4">
                    <p className="text-xs text-purple-400 mb-2">You</p>
                    <p className="text-sm text-white/80">{t.mockup.query}</p>
                  </div>

                  <div className="bg-navy-900/40 border border-teal-600/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-teal-400">
                        geck0
                      </span>
                      <span className="text-xs text-white/30">· 2.1s</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed mb-4">
                      {t.mockup.answer}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-navy-700/60 text-white/50 px-2.5 py-1 rounded-full">
                        📄 {t.mockup.sources}
                      </span>
                      <span className="text-xs bg-coral-400/10 text-coral-400 border border-coral-400/20 px-2.5 py-1 rounded-full">
                        ⚡ {t.mockup.insight}
                      </span>
                    </div>
                  </div>

                  {/* Mini graph visualization */}
                  <div className="flex items-center justify-center gap-3 pt-2 opacity-60">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            i % 3 === 0
                              ? "bg-purple-400"
                              : i % 3 === 1
                              ? "bg-teal-400"
                              : "bg-coral-400"
                          }`}
                        />
                        {i < 4 && (
                          <div className="w-8 h-px bg-purple-400/30" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
