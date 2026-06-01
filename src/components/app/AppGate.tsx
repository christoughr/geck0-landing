"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { siteConfig } from "@/config/site";
import Logo from "@/components/Logo";
import WaitlistForm from "@/components/WaitlistForm";
import AppLoginForm from "@/components/app/AppLoginForm";

/** Beta gate: waitlist + email sign-in for app.geck0.ai */
export default function AppGate() {
  const { locale } = useI18n();
  const ko = locale === "ko";

  return (
    <div className="min-h-[100dvh] bg-navy-900 flex flex-col overflow-x-clip">
      <header className="border-b border-navy-700/50 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Logo className="text-lg" />
        <Link
          href="https://geck0.ai"
          className="text-white/40 hover:text-white/70 text-xs sm:text-sm transition-colors"
        >
          ← geck0.ai
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center">
        <div className="max-w-md w-full">
          <span className="inline-flex items-center gap-2 bg-teal-900/30 border border-teal-600/30 rounded-full px-3 py-1 text-xs text-teal-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Beta
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {ko ? "geck0 앱" : "geck0 App"}
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            {ko
              ? "베타 초대 이메일로 로그인하거나, 웨이트리스트에 등록해 접근 권한을 받으세요."
              : "Sign in with your beta invite email, or join the waitlist for access."}
          </p>

          <AppLoginForm locale={locale} />

          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-navy-700/60" />
            <span className="text-white/30 text-xs">{ko ? "또는" : "or"}</span>
            <div className="flex-1 h-px bg-navy-700/60" />
          </div>

          <WaitlistForm source="login" variant="inline" showLegal={false} />

          <p className="mt-8 text-white/30 text-xs">
            {ko ? "문의" : "Questions"}:{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-purple-400 hover:text-purple-300">
              {siteConfig.email}
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
