import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/app-session";
import { getServerLocale } from "@/lib/locale-server";
import AppProductShell from "@/components/app/AppProductShell";

export default async function AppProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAppSession();
  if (!session) {
    redirect("/app");
  }

  const locale = await getServerLocale();

  return (
    <AppProductShell locale={locale} email={session.email}>
      {children}
    </AppProductShell>
  );
}
