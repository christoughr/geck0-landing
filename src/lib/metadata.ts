import type { Metadata } from "next";
import { translations, Locale } from "./i18n/translations";
import { getPageContent } from "./i18n/pageContent";
import { getSiteUrl, getOgImageUrl, getLogoUrl } from "./site";
import { getServerLocale } from "./locale-server";

export { getServerLocale } from "./locale-server";

type PageMetaInput = {
  path: string;
  slug?: string;
  title?: { ko: string; en: string };
  description?: { ko: string; en: string };
  noIndex?: boolean;
};

function localeAlternateUrl(canonical: string, lang: "ko" | "en"): string {
  const url = new URL(canonical);
  url.searchParams.set("lang", lang);
  return url.toString();
}

export async function buildPageMetadata(input: PageMetaInput): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = translations[locale];
  const canonical = getSiteUrl(input.path === "/" ? "" : input.path);
  const ogImage = getOgImageUrl();

  let title = input.title?.[locale];
  let description = input.description?.[locale];

  if (input.slug) {
    const page = getPageContent(locale, input.slug);
    if (page) {
      title = title ?? `${page.title} — geck0`;
      description = description ?? page.subtitle ?? t.meta.description;
    }
  }

  title = title ?? t.meta.title;
  description = description ?? t.meta.description;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "ko-KR": localeAlternateUrl(canonical, "ko"),
        "en-US": localeAlternateUrl(canonical, "en"),
        "x-default": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "geck0",
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      site: "@geck0_ai",
    },
  };

  if (input.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export function getMetaForLocale(locale: Locale) {
  return translations[locale].meta;
}

export { getOgImageUrl, getLogoUrl };
