import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    ignoreErrors: [
      /^TurnstileError:/,
      /\[Cloudflare Turnstile\] Error: 110200/,
      /Error: 110200/,
    ],
    denyUrls: [/extensions\//i, /^chrome:\/\//i, /^chrome-extension:\/\//i],
    beforeSend(event) {
      const ua = event.request?.headers?.["User-Agent"] ?? "";
      if (/HeadlessChrome|bot|crawl|spider/i.test(String(ua))) {
        return null;
      }
      const msg = event.exception?.values?.[0]?.value ?? event.message ?? "";
      if (String(msg).includes("110200") || String(msg).includes("TurnstileError")) {
        return null;
      }
      const url = event.request?.url ?? "";
      if (url.includes(".vercel.app")) {
        return null;
      }
      return event;
    },
  });
}
