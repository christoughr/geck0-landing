import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/pricing",
    title: {
      ko: "가격 — geck0",
      en: "Pricing — geck0",
    },
    description: {
      ko: "팀 규모에 맞는 geck0 플랜. 좌석당 과금 · 1일 무료 체험.",
      en: "geck0 plans for every team size. Per-seat · 1-day free trial.",
    },
  });
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
