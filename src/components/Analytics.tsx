"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "geck0-cookie-consent";

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}

export default function Analytics() {
  const customScript =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ??
    "https://plausible.io/js/pa-r5l7c00Z9HHInZ4nioefA.js";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(hasConsent());

    const onConsent = () => setEnabled(true);
    window.addEventListener("geck0-cookie-consent", onConsent);
    return () => window.removeEventListener("geck0-cookie-consent", onConsent);
  }, []);

  if (!enabled) return null;
  if (!customScript && !gaId) return null;

  return (
    <>
      {customScript && (
        <>
          <Script async src={customScript} strategy="afterInteractive" />
          <Script id="plausible-init" strategy="afterInteractive">
            {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
plausible.init()`}
          </Script>
        </>
      )}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}
