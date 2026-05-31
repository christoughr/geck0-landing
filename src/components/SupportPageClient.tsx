"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { getPageContent } from "@/lib/i18n/pageContent";
import PageShell from "./PageShell";
import { ContentPage, PageButton } from "./ContentPage";
import ContactForm from "./ContactForm";
import Reveal from "./Reveal";

export default function SupportPageClient() {
  const { locale } = useI18n();
  const page = getPageContent(locale, "support");
  if (!page) return null;

  return (
    <PageShell>
      <ContentPage label={page.label} title={page.title} subtitle={page.subtitle}>
        {page.blocks.map((block, i) => (
          <div key={i} className="mb-6">
            {block.heading && (
              <h2 className="text-xl font-semibold text-white mb-2">{block.heading}</h2>
            )}
            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{block.body}</p>
          </div>
        ))}

        <Reveal>
          <h2 className="text-xl font-semibold text-white mt-10 mb-2">
            {locale === "ko" ? "문의하기" : "Contact us"}
          </h2>
          <ContactForm />
        </Reveal>

        {page.cta && (
          <div className="mt-10">
            <PageButton href={page.cta.href}>{page.cta.label} →</PageButton>
          </div>
        )}
      </ContentPage>
    </PageShell>
  );
}
