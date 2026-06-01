import { getServerLocale } from "@/lib/locale-server";
import AppApiKeysPanel from "@/components/app/AppApiKeysPanel";

export default async function AppApiPage() {
  const locale = await getServerLocale();
  return <AppApiKeysPanel locale={locale} />;
}
