import { redirect } from "next/navigation";
import { getAppSessionEmail } from "@/lib/app-auth";
import { getServerLocale } from "@/lib/locale-server";
import AppProductShell from "@/components/app/AppProductShell";

export default async function AppProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getAppSessionEmail();
  if (!email) {
    redirect("/app");
  }

  const locale = await getServerLocale();

  return (
    <AppProductShell locale={locale} email={email}>
      {children}
    </AppProductShell>
  );
}
