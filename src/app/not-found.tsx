"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Logo from "@/components/Logo";

export default function NotFound() {
  const { locale } = useI18n();

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-6 text-center">
      <Logo className="text-2xl mb-8" />
      <h1 className="text-6xl font-bold text-purple-400 mb-4">404</h1>
      <p className="text-white/50 text-lg mb-8 max-w-md">
        {locale === "ko"
          ? "페이지를 찾을 수 없습니다."
          : "Page not found."}
      </p>
      <Link
        href="/"
        className="bg-purple-400 hover:bg-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        {locale === "ko" ? "홈으로 돌아가기" : "Back to home"}
      </Link>
    </div>
  );
}
