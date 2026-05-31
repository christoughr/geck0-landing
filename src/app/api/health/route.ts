import { NextResponse } from "next/server";

const BOOT_TIME = Date.now();

export async function GET() {
  return NextResponse.json({
    status: "operational",
    scope: "marketing-site",
    timestamp: new Date().toISOString(),
    deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    services: {
      website: "operational",
      api: "operational",
    },
    _meta: {
      note: "geck0.ai marketing landing only. Product app status: app.geck0.ai",
      uptimeSec: Math.floor((Date.now() - BOOT_TIME) / 1000),
    },
  });
}
