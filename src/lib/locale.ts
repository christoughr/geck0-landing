import { Locale } from "./i18n/translations";

export const LOCALE_COOKIE = "geck0-locale";

export function parseLocale(value: string | null | undefined): Locale {
  return value === "en" ? "en" : "ko";
}
