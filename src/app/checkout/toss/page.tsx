import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import TossCheckoutClient from "@/components/TossCheckoutClient";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/checkout/toss",
    title: { ko: "결제 — geck0", en: "Checkout — geck0" },
    description: {
      ko: "토스페이먼츠로 geck0 구독 체험 시작",
      en: "Start geck0 subscription trial with Toss Payments",
    },
  });
}

export default function TossCheckoutPage() {
  return (
    <PageShell>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <Suspense fallback={<p className="text-white/50 text-sm">Loading…</p>}>
          <TossCheckoutClient />
        </Suspense>
      </div>
    </PageShell>
  );
}
