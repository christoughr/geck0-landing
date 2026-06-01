import { getServerLocale } from "@/lib/locale-server";
import AppTeamPanel from "@/components/app/AppTeamPanel";

export default async function AppTeamPage() {
  const locale = await getServerLocale();
  return <AppTeamPanel locale={locale} />;
}
