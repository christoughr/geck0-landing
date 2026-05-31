import { cookies } from "next/headers";
import { LOCALE_COOKIE, parseLocale } from "./locale";
import { Locale } from "./i18n/translations";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}
