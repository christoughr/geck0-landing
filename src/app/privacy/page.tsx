import StaticPageView from "@/components/StaticPageView";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/privacy", slug: "privacy" });
}

export default function PrivacyPage() {
  return <StaticPageView slug="privacy" />;
}
