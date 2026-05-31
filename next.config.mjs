/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirects for canonical domain — mirrors vercel.json for non-Vercel environments
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
        has: [{ type: "host", value: "app.geck0.ai" }],
        destination: "https://geck0.ai/login",
        permanent: true,
      },
    ];
  },

  // Security headers (supplementary — middleware also sets these per-request)
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

export default nextConfig;
