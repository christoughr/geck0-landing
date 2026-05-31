"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getPageContent } from "@/lib/i18n/pageContent";
import PageShell from "./PageShell";
import { ContentPage, PageButton } from "./ContentPage";
import { siteConfig } from "@/config/site";

interface StaticPageViewProps {
  slug: string;
  showLoginForm?: boolean;
}

export default function StaticPageView({ slug, showLoginForm }: StaticPageViewProps) {
  const { locale, t } = useI18n();
  const page = getPageContent(locale, slug);

  if (!page) return null;

  const ctaHref = page.cta?.href ?? "/#contact";
  const isExternal = ctaHref.startsWith("mailto:") || ctaHref.startsWith("http");

  return (
    <PageShell>
      <ContentPage label={page.label} title={page.title} subtitle={page.subtitle}>
        {showLoginForm && (
          <div className="bg-navy-800/60 border border-navy-600/30 rounded-2xl p-6 mb-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = siteConfig.appUrl;
              }}
            >
              <label htmlFor="login-email" className="block text-sm text-white/50 mb-2">
                {t.login.email}
              </label>
              <input
                id="login-email"
                type="email"
                placeholder={t.login.emailPlaceholder}
                className="w-full bg-navy-900/60 border border-navy-600/50 text-white placeholder:text-white/30 px-4 py-3 rounded-xl text-sm mb-4 focus:outline-none focus:border-purple-400/60"
              />
              <label htmlFor="login-password" className="block text-sm text-white/50 mb-2">
                {t.login.password}
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-navy-900/60 border border-navy-600/50 text-white placeholder:text-white/30 px-4 py-3 rounded-xl text-sm mb-4 focus:outline-none focus:border-purple-400/60"
              />
              <button
                type="submit"
                className="w-full bg-purple-400 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                {t.login.signIn}
              </button>
            </form>
            <p className="text-white/30 text-xs mt-4 text-center">{t.login.betaNote}</p>
          </div>
        )}

        {page.blocks.map((block, i) => (
          <div key={i} className="mb-6">
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
