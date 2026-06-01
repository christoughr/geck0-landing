import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "geck0 App — Beta",
  description: "geck0 beta workspace — Q&A, knowledge graph, insights",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-navy-900 text-white">{children}</div>;
}
