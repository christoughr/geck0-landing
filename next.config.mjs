import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "geck0.info" }],
        destination: "https://geck0.ai/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.geck0.info" }],
        destination: "https://geck0.ai/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "app.geck0.info" }],
        destination: "https://geck0.ai/login",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.geck0.ai" }],
        destination: "https://geck0.ai/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

const hasSentry = Boolean(
  process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim()
);

export default hasSentry
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG ?? "geck0",
      project: process.env.SENTRY_PROJECT ?? "geck0-landing",
      silent: true,
      widenClientFileUpload: true,
      disableLogger: true,
      automaticVercelMonitors: false,
    })
  : nextConfig;
