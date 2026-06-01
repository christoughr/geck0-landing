import { redirect } from "next/navigation";
import { getAppSessionEmail } from "@/lib/app-auth";
import AppGate from "@/components/app/AppGate";

export default async function AppShellPage() {
  const email = await getAppSessionEmail();
  if (email) {
    redirect("/app/dashboard");
  }

  return <AppGate />;
}
