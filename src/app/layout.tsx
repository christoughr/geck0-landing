import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { getServerLocale } from "@/lib/locale-server";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import DocumentMeta from "@/components/DocumentMeta";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadataBase = new URL(getSiteUrl());

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A1A2E",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: "/" });
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <JsonLd />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-purple-400 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>
        <I18nProvider initialLocale={locale}>
          <DocumentMeta />
          {children}
          <CookieConsent />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
