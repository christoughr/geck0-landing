import DemoPageClient from "@/components/DemoPageClient";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/demo",
    title: {
      ko: "데모 — geck0",
      en: "Demo — geck0",
    },
    description: {
      ko: "geck0 제품 데모와 인터랙티브 미리보기",
      en: "geck0 product demo and interactive preview",
    },
  });
}

export default function DemoPage() {
  return <DemoPageClient />;
}
