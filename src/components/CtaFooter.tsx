"use client";

import Link from "next/link";
import Logo from "./Logo";
import Reveal from "./Reveal";
import WaitlistForm from "./WaitlistForm";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { footerLinks } from "@/config/site";
import { siteConfig } from "@/config/site";

export function CtaSection() {
  const { t } = useI18n();

  return (
    <section
      id="contact"
      className="relative bg-navy-800/40 py-16 sm:py-24 px-4 sm:px-6 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl"
          style={{ background: "rgba(127,119,221,0.1)" }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.cta.title}</h2>
          <p className="text-white/50 text-base sm:text-lg mb-8">{t.cta.subtitle}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <WaitlistForm source="footer" variant="footer" showLegal />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();

  const linkGroups = [
    { title: t.footer.product, links: t.footer.productLinks, hrefs: footerLinks.product },
    { title: t.footer.company, links: t.footer.companyLinks, hrefs: footerLinks.company },
    { title: t.footer.support, links: t.footer.supportLinks, hrefs: footerLinks.support },
  ];

  return (
    <footer className="bg-navy-900 border-t border-navy-700/50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
          <div>
            <Logo className="text-xl mb-2" />
            <p className="text-white/40 text-sm max-w-xs">{t.footer.tagline}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-white/30 text-xs mt-2 hover:text-white/50 transition-colors"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto">
            {linkGroups.map(({ title, links, hrefs }) => (
              <div key={title}>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
                  {title}
                </p>
                <ul className="space-y-2">
                  {links.map((label, i) => (
                    <li key={label}>
                      <Link
                        href={hrefs[i].href}
                        className="text-white/35 hover:text-white/70 text-sm transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-navy-700/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">{t.footer.copyright}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {t.footer.legal.map((label, i) => (
              <Link
                key={label}
                href={footerLinks.legal[i].href}
                className="text-white/25 hover:text-white/50 text-xs transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
