import { getServerLocale } from "@/lib/locale-server";
import AppQaPanel from "@/components/app/AppQaPanel";

export default async function AppQaPage() {
  const locale = await getServerLocale();
  return <AppQaPanel locale={locale} />;
}
