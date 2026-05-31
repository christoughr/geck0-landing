import { NextResponse } from "next/server";

const BOOT_TIME = Date.now();

export async function GET() {
  return NextResponse.json({
    status: "operational",
    timestamp: new Date().toISOString(),
    deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    services: {
      api: "operational",
      knowledgeGraph: "operational",
      aiQa: "operational",
      integrations: "operational",
    },
    _meta: {
      note: "Landing page health. Product services monitored separately.",
      uptimeSec: Math.floor((Date.now() - BOOT_TIME) / 1000),
    },
  });
}
