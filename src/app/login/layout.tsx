import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/login",
    title: { ko: "로그인 — geck0", en: "Sign in — geck0" },
    description: {
      ko: "geck0 워크스페이스에 로그인하세요.",
      en: "Sign in to your geck0 workspace.",
    },
    noIndex: true,
  });
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
