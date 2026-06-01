"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { sitePricing, type BillingPlan } from "@/lib/pricing";

type PlanWaitlistButtonProps = {
  plan: BillingPlan;
  featured: boolean;
  label: string;
};

/** Pricing CTA — Toss checkout when configured, otherwise waitlist. */
export default function PlanWaitlistButton({ plan, featured, label }: PlanWaitlistButtonProps) {
  const { t } = useI18n();
  const maxSeats = sitePricing.plans[plan].maxSeats;
  const [tossEnabled, setTossEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/billing/toss")
      .then((r) => r.json())
      .then((d: { enabled?: boolean }) => setTossEnabled(Boolean(d.enabled)))
      .catch(() => setTossEnabled(false));
  }, []);

  const waitlistHref = `/#contact?plan=${plan}`;
  const checkoutHref = `/checkout/toss?plan=${plan}&seats=1`;
  const href = tossEnabled ? checkoutHref : waitlistHref;

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
      <p className="text-white/35 text-[11px] text-center leading-relaxed">
        {tossEnabled ? t.pricing.paymentTossReady : t.pricing.paymentDeferred}
      </p>
    </div>
  );
}
