"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { siteConfig } from "@/config/site";
import Logo from "@/components/Logo";
import WaitlistForm from "@/components/WaitlistForm";
import AppLoginForm from "@/components/app/AppLoginForm";

type AppGateProps = {
  errorCode?: string | null;
};

/** Beta gate: login (step 1) + waitlist (step 2) for app.geck0.ai */
export default function AppGate({ errorCode }: AppGateProps) {
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

      <main
        id="main-content"
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-12"
      >
        <div className="max-w-md w-full text-center">
          <span className="inline-flex items-center gap-2 bg-teal-900/30 border border-teal-600/30 rounded-full px-3 py-1 text-xs text-teal-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Beta
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {ko ? "geck0 앱" : "geck0 App"}
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            {ko
              ? "먼저 로그인한 뒤, 상단 메뉴에서 Q&A · 그래프를 이용할 수 있습니다."
              : "Sign in first, then use Q&A and Graph from the top menu."}
          </p>

          <AppLoginForm locale={locale} errorCode={errorCode} />

          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-navy-700/60" />
            <span className="text-white/30 text-xs whitespace-nowrap">
              {ko ? "2단계 · 아직 초대 전" : "Step 2 · Not invited yet"}
            </span>
            <div className="flex-1 h-px bg-navy-700/60" />
          </div>

          <p className="text-white/40 text-xs mb-4 text-left">
            {ko
              ? "초대 메일이 없으면 웨이트리스트에 등록하세요. (로그인과는 다른 폼입니다.)"
              : "No invite yet? Join the waitlist — separate from sign-in above."}
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
