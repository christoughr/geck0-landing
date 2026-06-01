import DemoPageClient from "@/components/DemoPageClient";
import { buildPageMetadata } from "@/lib/metadata";
import { getDemoVideoEmbedUrl } from "@/lib/demo-video";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/demo",
    title: {
      ko: "데모 — geck0",
      en: "Demo — geck0",
    },
    description: {
      ko: "geck0 제품 데모와 샘플 Q&A 미리보기",
      en: "geck0 product demo and sample Q&A preview",
    },
  });
}

export default function DemoPage() {
  const videoEmbedUrl = getDemoVideoEmbedUrl();
  return <DemoPageClient videoEmbedUrl={videoEmbedUrl} />;
}
