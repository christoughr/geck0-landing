"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { appNavItems, getAppStrings, type AppNavKey } from "@/lib/app-i18n";
import type { Locale } from "@/lib/i18n/translations";

type AppProductShellProps = {
  locale: Locale;
  email: string;
  children: React.ReactNode;
};

function activeKeyFromPath(pathname: string): AppNavKey {
  if (pathname.startsWith("/app/graph")) return "graph";
  if (pathname.startsWith("/app/qa")) return "qa";
  if (pathname.startsWith("/app/insights")) return "insights";
  if (pathname.startsWith("/app/settings/team")) return "team";
  if (pathname.startsWith("/app/settings/api")) return "api";
  if (pathname.startsWith("/app/settings")) return "integrations";
  return "dashboard";
}

export default function AppProductShell({ locale, email, children }: AppProductShellProps) {
  const pathname = usePathname();
  const t = getAppStrings(locale);
  const active = activeKeyFromPath(pathname);

  const navLabels = appNavItems.map((item) => ({
    ...item,
    label: t.nav[item.key],
  }));

  return (
    <div className="min-h-[100dvh] bg-navy-900 flex flex-col overflow-x-clip">
      <header className="border-b border-navy-700/50 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Logo className="text-base shrink-0" />
          <span className="text-[10px] text-teal-300/90 border border-teal-500/30 bg-teal-900/30 px-2 py-0.5 rounded-full shrink-0">
            {t.beta}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-xs shrink-0">
          <span className="text-white/40 hidden sm:inline truncate max-w-[140px]">{email}</span>
          <Link href="https://geck0.ai" className="text-white/40 hover:text-white/70">
            ← {t.backToMarketing}
          </Link>
          <button
            type="button"
            onClick={() => fetch("/api/app/auth", { method: "DELETE" }).then(() => {
              window.location.href = "/app";
            })}
            className="text-white/40 hover:text-white/70"
          >
            {t.signOut}
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
        <nav className="hidden sm:flex flex-col w-52 border-r border-navy-700/40 p-4 gap-1 shrink-0">
          {navLabels.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm px-3 py-2.5 rounded-lg flex items-center gap-2 transition-colors ${
                active === item.key
                  ? "bg-purple-400/15 text-purple-200 border border-purple-400/25"
                  : "text-white/45 hover:text-white/80 hover:bg-navy-800/50"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  active === item.key ? "bg-purple-400" : "bg-white/20"
                }`}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="sm:hidden flex border-b border-navy-700/40 overflow-x-auto">
          {navLabels.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs px-4 py-3 whitespace-nowrap shrink-0 ${
                active === item.key
                  ? "text-purple-300 border-b-2 border-purple-400"
                  : "text-white/40"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 min-w-0 overflow-x-clip overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
