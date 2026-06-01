import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import TossCheckoutSuccess from "@/components/TossCheckoutSuccess";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/checkout/toss/success",
    title: { ko: "결제 완료 — geck0", en: "Checkout complete — geck0" },
  });
}

export default function TossCheckoutSuccessPage() {
  return (
    <PageShell>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
        <Suspense fallback={<p className="text-white/50 text-sm">Loading…</p>}>
          <TossCheckoutSuccess />
        </Suspense>
      </div>
    </PageShell>
  );
}
