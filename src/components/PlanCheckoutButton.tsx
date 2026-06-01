"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { sitePricing, type BillingPlan } from "@/lib/pricing";
import { isStripeCheckoutEnabled } from "@/lib/stripe-client";

type PlanCheckoutButtonProps = {
  plan: BillingPlan;
  featured: boolean;
  label: string;
};

export default function PlanCheckoutButton({ plan, featured, label }: PlanCheckoutButtonProps) {
  const { locale, t } = useI18n();
  const maxSeats = sitePricing.plans[plan].maxSeats;
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stripeEnabled = isStripeCheckoutEnabled();

  const handleCheckout = async () => {
    if (!stripeEnabled) {
      window.location.href = `/#contact?plan=${plan}`;
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, seats, locale }),
      });

      const data = (await res.json()) as { url?: string; fallback?: boolean; error?: string };

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.fallback || res.status === 503) {
        window.location.href = `/#contact?plan=${plan}`;
        return;
      }

      setError(data.error ?? t.pricing.checkoutError);
    } catch {
      setError(t.pricing.checkoutError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-left">
        <span className="text-white/45 text-xs">{t.pricing.seatsLabel}</span>
        <input
          type="number"
          min={1}
          max={maxSeats}
          value={seats}
          onChange={(e) => {
            const next = Number.parseInt(e.target.value, 10);
            if (Number.isFinite(next)) {
              setSeats(Math.min(maxSeats, Math.max(1, next)));
            }
          }}
          className="mt-1 w-full min-h-[40px] rounded-lg bg-navy-900/70 border border-navy-600/50 px-3 text-sm text-white focus:outline-none focus:border-purple-400/60"
          aria-label={t.pricing.seatsLabel}
        />
      </label>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors duration-200 disabled:opacity-60 ${
          featured
            ? "bg-purple-400 hover:bg-purple-600 text-white"
            : "border border-white/20 hover:border-white/40 text-white/70 hover:text-white"
        }`}
      >
        {loading ? t.pricing.checkoutLoading : label}
      </button>

      {!stripeEnabled && (
        <p className="text-white/35 text-[11px] text-center leading-relaxed">
          {t.pricing.waitlistFallback}{" "}
          <Link href="/#contact" className="text-purple-400 hover:text-purple-300 underline">
            {t.pricing.waitlistLink}
          </Link>
        </p>
      )}

      {error && <p className="text-coral-400 text-xs text-center">{error}</p>}
    </div>
  );
}
