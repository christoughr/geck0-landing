import Script from "next/script";

export default function Analytics() {
  const customScript =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ??
    "https://plausible.io/js/pa-r5l7c00Z9HHInZ4nioefA.js";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

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
