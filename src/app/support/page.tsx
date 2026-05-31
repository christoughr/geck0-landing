import SupportPageClient from "@/components/SupportPageClient";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/support", slug: "support" });
}

export default function SupportPage() {
  return <SupportPageClient />;
}
