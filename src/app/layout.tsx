import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { getSiteUrl } from "@/lib/site";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "geck0 — 지식이 연결될 때, 회사가 진화합니다",
  description:
    "geck0는 회사의 흩어진 지식을 시냅스처럼 연결하는 AI 지식 관리 플랫폼입니다. 슬랙, 노션, 드라이브의 모든 정보가 살아있는 지식으로 연결됩니다.",
  keywords: ["지식관리", "AI", "B2B", "SaaS", "지식그래프", "knowledge management"],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "geck0 — Company Knowledge Brain",
    description: "지식이 연결될 때, 회사가 진화합니다",
    url: siteUrl,
    siteName: "geck0",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "geck0 — 지식이 연결될 때, 회사가 진화합니다",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "geck0",
    description: "지식이 연결될 때, 회사가 진화합니다",
    images: ["/og-image.png"],
    site: "@geck0_ai",
  },
  icons: {
    icon: "/og-image.png",
    apple: "/og-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        <JsonLd />
      </head>
      <body>
        <I18nProvider>
          {children}
          <CookieConsent />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
