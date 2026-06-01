import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "geck0 App",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
