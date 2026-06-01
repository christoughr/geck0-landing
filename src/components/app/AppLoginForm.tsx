"use client";

import type { Locale } from "@/lib/i18n/translations";

type AppLoginFormProps = {
  locale: Locale;
  errorCode?: string | null;
};

const ERROR_MESSAGES: Record<string, { ko: string; en: string }> = {
  not_invited: {
    ko: "베타 초대 목록에 없는 이메일입니다. 아래 웨이트리스트에 등록하거나 hello@geck0.ai 로 문의해 주세요.",
    en: "This email is not on the beta list. Join the waitlist below or email hello@geck0.ai.",
  },
  not_configured: {
    ko: "앱 로그인 설정이 아직 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.",
    en: "App sign-in is not configured yet. Please try again later.",
  },
  rate_limit: {
    ko: "요청이 너무 많습니다. 1분 후 다시 시도해 주세요.",
    en: "Too many attempts. Please try again in a minute.",
  },
  invalid_email: {
    ko: "올바른 이메일 주소를 입력해 주세요.",
    en: "Please enter a valid email address.",
  },
  session_failed: {
    ko: "로그인 세션 생성에 실패했습니다. 다시 시도해 주세요.",
    en: "Could not create a session. Please try again.",
  },
};

export default function AppLoginForm({ locale, errorCode }: AppLoginFormProps) {
  const ko = locale === "ko";
  const err = errorCode ? ERROR_MESSAGES[errorCode] : null;

  return (
    <div className="rounded-2xl border-2 border-purple-400/40 bg-navy-800/50 p-5 text-left shadow-lg shadow-purple-900/20">
      <p className="text-[10px] uppercase tracking-widest text-purple-300 font-semibold mb-1">
        {ko ? "1단계 · 베타 로그인" : "Step 1 · Beta sign-in"}
      </p>
      <p className="text-white/55 text-xs mb-4 leading-relaxed">
        {ko
          ? "보라색 테두리 안의 입력창에 초대받은 이메일을 넣고 「베타 앱 입장」을 누르세요. (아래 웨이트리스트와는 별개입니다.)"
          : "Enter your invited email in the box below, then tap Enter beta app. (This is separate from the waitlist form.)"}
      </p>

      <form action="/api/app/auth/login" method="POST" className="space-y-3">
        <label className="block text-xs text-white/50" htmlFor="app-beta-email">
          {ko ? "초대 이메일" : "Invite email"}
        </label>
        <input
          id="app-beta-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="hello@geck0.ai"
          className="w-full min-h-[48px] bg-navy-900/80 border border-purple-400/30 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
        />
        <button
          type="submit"
          className="w-full min-h-[48px] bg-purple-400 hover:bg-purple-600 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          {ko ? "베타 앱 입장" : "Enter beta app"}
        </button>
      </form>

      {(err || errorCode) && (
        <p className="mt-3 text-coral-300 text-sm leading-relaxed bg-coral-950/40 border border-coral-500/30 rounded-lg px-3 py-2" role="alert">
          {err ? (ko ? err.ko : err.en) : errorCode}
        </p>
      )}

      <p className="mt-3 text-[11px] text-white/30">
        {ko
          ? "권장 주소: app.geck0.ai/app · 초대됨: hello@geck0.ai"
          : "Use app.geck0.ai/app · Invited: hello@geck0.ai"}
      </p>
    </div>
  );
}
