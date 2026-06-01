/** Shared pricing & trial constants (marketing site). */
export const sitePricing = {
  trialDays: 1,
  currency: { ko: "KRW", en: "USD" },
  plans: {
    starter: { maxSeats: 20, pricePerSeatKo: 99000, pricePerSeatEn: 99 },
    growth: { maxSeats: 100, pricePerSeatKo: 390000, pricePerSeatEn: 399 },
  },
} as const;

export function formatSeatPrice(locale: "ko" | "en", plan: "starter" | "growth"): string {
  if (locale === "ko") {
    const n = sitePricing.plans[plan].pricePerSeatKo;
    return `₩${n.toLocaleString("ko-KR")}`;
  }
  return `$${sitePricing.plans[plan].pricePerSeatEn}`;
}
