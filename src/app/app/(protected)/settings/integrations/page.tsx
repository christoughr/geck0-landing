import { getServerLocale } from "@/lib/locale-server";
import AppIntegrationsPanel from "@/components/app/AppIntegrationsPanel";

export default async function AppIntegrationsPage() {
  const locale = await getServerLocale();
  return <AppIntegrationsPanel locale={locale} />;
}
