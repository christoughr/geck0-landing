"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Locale, translations, TranslationKey } from "./translations";

interface I18nContextValue {
  locale: Locale;
  t: TranslationKey;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    const saved = localStorage.getItem("geck0-locale") as Locale | null;
    if (saved === "ko" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem("geck0-locale", next);
    document.documentElement.lang = next;
  }, []);

  return (
    <I18nContext.Provider
      value={{ locale, t: translations[locale], setLocale }}
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
