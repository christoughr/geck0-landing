"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import PageShell from "@/components/PageShell";
import Pricing from "@/components/Pricing";
import Reveal from "@/components/Reveal";

export default function PricingPage() {
  const { t } = useI18n();

  return (
    <PageShell>
      <Reveal className="text-center pt-12 pb-4 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          {t.pricingPage.title}
        </h1>
        <p className="text-white/50 text-lg">{t.pricingPage.subtitle}</p>
      </Reveal>

      <Pricing showViewAll={false} />

      <div className="max-w-2xl mx-auto px-6 pb-20">
        <Reveal>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">FAQ</h2>
          <div className="space-y-4">
            {t.pricingPage.faq.map(({ q, a }) => (
              <div
                key={q}
                className="bg-navy-800/60 border border-navy-600/30 rounded-xl p-5"
              >
                <h3 className="text-white font-medium mb-2">{q}</h3>
                <p className="text-white/55 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="text-center mt-10">
          <Link
            href="/enterprise"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            Enterprise →
          </Link>
        </Reveal>
      </div>
    </PageShell>
  );
}
