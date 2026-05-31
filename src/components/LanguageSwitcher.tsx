"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggle = () => setLocale(locale === "ko" ? "en" : "ko");

  return (
    <button
      onClick={toggle}
      className="text-xs font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-2.5 py-1 rounded-md transition-colors"
      aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
    >
      {locale === "ko" ? "EN" : "KO"}
    </button>
  );
}
