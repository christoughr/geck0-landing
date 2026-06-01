import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getServerLocale } from "@/lib/locale-server";
import { getTranslations } from "@/lib/i18n/translations";

export default async function CheckoutCancelPage() {
  const locale = await getServerLocale();
  const t = getTranslations(locale);

  return (
    <PageShell>
      <section className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="rounded-2xl border border-navy-600/50 bg-navy-800/60 p-8">
          <h1 className="text-2xl font-bold text-white mb-3">{t.checkout.cancelTitle}</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-6">{t.checkout.cancelBody}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="inline-flex justify-center px-5 py-3 rounded-xl bg-purple-400 hover:bg-purple-600 text-white text-sm font-semibold"
            >
              {t.checkout.pricingLink}
            </Link>
            <Link
              href="/#contact"
              className="inline-flex justify-center px-5 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm font-semibold"
            >
              {t.checkout.waitlistLink}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
