"use client";

import type { ReactNode } from "react";

type AppShellFrameProps = {
  children: ReactNode;
  activeNav?: number;
  navLabels?: readonly string[];
  subtitle?: string;
};

/** geck0-branded app shell — not macOS window chrome */
export default function AppShellFrame({
  children,
  activeNav = 2,
  navLabels = ["Dashboard", "Graph", "Q&A", "Insights"],
  subtitle = "app.geck0.ai",
}: AppShellFrameProps) {
  return (
    <div className="relative bg-navy-800 border border-navy-600/50 rounded-2xl overflow-hidden shadow-2xl max-w-full">
      {/* geck0 workspace header */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 bg-gradient-to-r from-navy-700/80 to-navy-800/80 border-b border-purple-500/20">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-0.5 shrink-0" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="w-2 h-2 rounded-full bg-coral-400" />
          </div>
          <span className="text-xs font-semibold text-white/80 truncate">geck0</span>
          <span className="hidden sm:inline text-[10px] text-white/30 truncate">{subtitle}</span>
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-teal-300/90 border border-teal-500/30 bg-teal-900/30 px-2 py-0.5 rounded-full">
          Beta
        </span>
      </div>

      <div className="flex flex-col sm:flex-row min-h-[280px] sm:min-h-[320px]">
        {/* Desktop rail */}
        <div className="hidden sm:flex flex-col w-44 border-r border-navy-600/30 p-3 gap-1 shrink-0">
          {navLabels.map((item, i) => (
            <div
              key={item}
              className={`text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${
                i === activeNav
                  ? "bg-purple-400/15 text-purple-200 border border-purple-400/25"
                  : "text-white/35"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  i === activeNav ? "bg-purple-400" : "bg-white/20"
                }`}
              />
              {item}
            </div>
          ))}
        </div>

        {/* Mobile tabs */}
        <div className="sm:hidden flex border-b border-navy-600/30 overflow-x-auto">
          {navLabels.map((item, i) => (
            <div
              key={item}
              className={`text-[10px] px-3 py-2 whitespace-nowrap shrink-0 ${
                i === activeNav ? "text-purple-300 border-b-2 border-purple-400" : "text-white/35"
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0 p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
