/** @type {import('next').NextConfig} */
const nextConfig = {
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
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
