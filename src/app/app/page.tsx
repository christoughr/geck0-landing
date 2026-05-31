"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { siteConfig } from "@/config/site";
import Logo from "@/components/Logo";
import WaitlistForm from "@/components/WaitlistForm";

/** Product app shell at app.geck0.ai (beta) */
export default function AppShell() {
  const { locale } = useI18n();
  const ko = locale === "ko";

  return (
    <div className="min-h-[100dvh] bg-navy-900 flex flex-col">
      <header className="border-b border-navy-700/50 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Logo className="text-lg" />
        <Link
          href="https://geck0.ai"
          className="text-white/40 hover:text-white/70 text-xs sm:text-sm transition-colors"
        >
          {ko ? "← geck0.ai" : "← geck0.ai"}
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
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            {ko
              ? "제품 앱은 베타 고객에게 순차 배포 중입니다. 웨이트리스트에 등록하면 app.geck0.ai 접근 권한을 받을 수 있습니다."
              : "The product app is rolling out to beta customers. Join the waitlist for app.geck0.ai access."}
          </p>

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
