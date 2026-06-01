import { redirect } from "next/navigation";
import { getAppSessionEmail } from "@/lib/app-auth";
import AppGate from "@/components/app/AppGate";

export default async function AppShellPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const email = await getAppSessionEmail();
  if (email) {
    redirect("/app/dashboard");
  }

  return <AppGate errorCode={searchParams.error ?? null} />;
}
