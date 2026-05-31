"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useI18n();

  useEffect(() => {
    console.error("[geck0-error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-white mb-3">
        {locale === "ko" ? "문제가 발생했습니다" : "Something went wrong"}
      </h1>
      <p className="text-white/50 text-sm mb-8 max-w-md">
        {locale === "ko"
          ? "일시적인 오류입니다. 다시 시도하거나 홈으로 돌아가 주세요."
          : "A temporary error occurred. Please try again or return home."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="bg-purple-400 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          {locale === "ko" ? "다시 시도" : "Try again"}
        </button>
        <Link
          href="/"
          className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
        >
          {locale === "ko" ? "홈으로" : "Back to home"}
        </Link>
      </div>
    </div>
  );
}
