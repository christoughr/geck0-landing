import type { Metadata } from "next";
import { translations, Locale } from "./i18n/translations";
import { getPageContent } from "./i18n/pageContent";
import { getSiteUrl } from "./site";
import { getServerLocale } from "./locale-server";

export { getServerLocale } from "./locale-server";

type PageMetaInput = {
  path: string;
  slug?: string;
  title?: { ko: string; en: string };
  description?: { ko: string; en: string };
  noIndex?: boolean;
};

export async function buildPageMetadata(input: PageMetaInput): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = translations[locale];
  const canonical = getSiteUrl(input.path === "/" ? "" : input.path);

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
        "ko-KR": canonical,
        "en-US": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "geck0",
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
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
