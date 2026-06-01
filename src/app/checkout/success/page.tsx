import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getServerLocale } from "@/lib/locale-server";
import { getTranslations } from "@/lib/i18n/translations";

export default async function CheckoutSuccessPage() {
  const locale = await getServerLocale();
  const t = getTranslations(locale);

  return (
    <PageShell>
      <section className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="rounded-2xl border border-teal-400/30 bg-navy-800/60 p-8">
          <p className="text-teal-400 text-sm font-semibold mb-3">{t.checkout.successBadge}</p>
          <h1 className="text-2xl font-bold text-white mb-3">{t.checkout.successTitle}</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-6">{t.checkout.successBody}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/app"
              className="inline-flex justify-center px-5 py-3 rounded-xl bg-purple-400 hover:bg-purple-600 text-white text-sm font-semibold"
            >
              {t.checkout.appLink}
            </Link>
            <Link
              href="/demo"
              className="inline-flex justify-center px-5 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm font-semibold"
            >
              {t.checkout.demoLink}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
