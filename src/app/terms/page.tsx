import StaticPageView from "@/components/StaticPageView";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/terms", slug: "terms" });
}

export default function TermsPage() {
  return <StaticPageView slug="terms" />;
}
