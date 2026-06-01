"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { sitePricing, type BillingPlan } from "@/lib/pricing";

type PlanWaitlistButtonProps = {
  plan: BillingPlan;
  featured: boolean;
  label: string;
};

/** Waitlist CTA — card billing deferred (Stripe not available in Korea). */
export default function PlanWaitlistButton({ plan, featured, label }: PlanWaitlistButtonProps) {
  const { t } = useI18n();
  const maxSeats = sitePricing.plans[plan].maxSeats;
  const href = `/#contact?plan=${plan}`;

  return (
    <div className="space-y-3">
      <p className="text-white/40 text-xs text-left">
        {t.pricing.seatsHint.replace("{max}", String(maxSeats))}
      </p>
      <Link
        href={href}
        className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors duration-200 ${
          featured
            ? "bg-purple-400 hover:bg-purple-600 text-white"
            : "border border-white/20 hover:border-white/40 text-white/70 hover:text-white"
        }`}
      >
        {label}
      </Link>
      <p className="text-white/35 text-[11px] text-center leading-relaxed">{t.pricing.paymentDeferred}</p>
    </div>
  );
}
