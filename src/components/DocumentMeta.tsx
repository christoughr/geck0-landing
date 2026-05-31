"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LOCALE_COOKIE } from "@/lib/locale";

export default function DocumentMeta() {
  const { locale, t } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.title;
  }, [locale, t.meta.title]);

  useEffect(() => {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    localStorage.setItem(LOCALE_COOKIE, locale);
  }, [locale]);

  return null;
}
