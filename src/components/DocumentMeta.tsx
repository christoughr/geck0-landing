"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LOCALE_COOKIE } from "@/lib/locale";

/** Syncs locale cookie + html lang only — page titles come from Next.js generateMetadata */
export default function DocumentMeta() {
  const { locale } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    localStorage.setItem(LOCALE_COOKIE, locale);
  }, [locale]);

  return null;
}
