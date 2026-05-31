"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getPageContent } from "@/lib/i18n/pageContent";
import PageShell from "./PageShell";
import { ContentPage, PageButton } from "./ContentPage";

interface StaticPageViewProps {
  slug: string;
}

export default function StaticPageView({ slug }: StaticPageViewProps) {
  const { locale } = useI18n();
  const page = getPageContent(locale, slug);

  if (!page) return null;

  const ctaHref = page.cta?.href ?? "/#contact";
  const isExternal = ctaHref.startsWith("mailto:") || ctaHref.startsWith("http");

  return (
    <PageShell>
      <ContentPage label={page.label} title={page.title} subtitle={page.subtitle}>
        {page.blocks.map((block, i) => (
          <div
            key={i}
            id={block.heading?.toLowerCase().includes("accuracy") ? "accuracy" : undefined}
            className="mb-6"
          >
            {block.heading && (
              <h2 className="text-xl font-semibold text-white mb-2">{block.heading}</h2>
            )}
            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{block.body}</p>
          </div>
        ))}

        {page.cta && (
          <div className="mt-10">
            {isExternal ? (
              <a href={ctaHref} className="inline-block bg-purple-400 hover:bg-purple-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm">
                {page.cta.label} →
              </a>
            ) : (
              <PageButton href={ctaHref}>{page.cta.label} →</PageButton>
            )}
          </div>
        )}
      </ContentPage>
    </PageShell>
  );
}
