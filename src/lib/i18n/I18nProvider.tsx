"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Locale, translations, TranslationKey } from "./translations";
import { LOCALE_COOKIE } from "@/lib/locale";

interface I18nContextValue {
  locale: Locale;
  t: TranslationKey;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(LOCALE_COOKIE) as Locale | null;
  if (saved === "ko" || saved === "en") return saved;
  const match = document.cookie.match(new RegExp(`${LOCALE_COOKIE}=([^;]+)`));
  if (match?.[1] === "en" || match?.[1] === "ko") return match[1];
  return null;
}

export function I18nProvider({
  children,
  initialLocale = "ko",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored && stored !== initialLocale) {
      setLocaleState(stored);
    }
    document.documentElement.lang = stored ?? initialLocale;
    setMounted(true);
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_COOKIE, next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    document.documentElement.lang = next;
  }, []);

  const activeLocale = mounted ? locale : initialLocale;

  return (
    <I18nContext.Provider
      value={{ locale: activeLocale, t: translations[activeLocale], setLocale }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
