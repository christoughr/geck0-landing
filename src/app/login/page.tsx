import { redirect } from "next/navigation";
import { getAppLoginUrl } from "@/lib/app-url";

/** Marketing /login → beta app gate */
export default function LoginPage() {
  redirect(getAppLoginUrl());
}
