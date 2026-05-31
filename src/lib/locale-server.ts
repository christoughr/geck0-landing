import { headers } from "next/headers";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, parseLocale } from "./locale";
import { Locale } from "./i18n/translations";

function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const parts = header.split(",").map((p) => p.split(";")[0]?.trim().toLowerCase());
  for (const part of parts) {
    if (part?.startsWith("ko")) return "ko";
    if (part?.startsWith("en")) return "en";
  }
  return null;
}

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (fromCookie) return parseLocale(fromCookie);

  const headerStore = await headers();
  const fromHeader = localeFromAcceptLanguage(headerStore.get("accept-language"));
  if (fromHeader) return fromHeader;

  return "ko";
}
