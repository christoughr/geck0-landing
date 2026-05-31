import StaticPageView from "@/components/StaticPageView";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/careers", slug: "careers" });
}

export default function CareersPage() {
  return <StaticPageView slug="careers" />;
}
