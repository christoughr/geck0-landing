import StaticPageView from "@/components/StaticPageView";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/press", slug: "press" });
}

export default function PressPage() {
  return <StaticPageView slug="press" />;
}
