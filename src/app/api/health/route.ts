import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "operational",
    uptime: "99.9%",
    timestamp: new Date().toISOString(),
    services: {
      api: "operational",
      knowledgeGraph: "operational",
      aiQa: "operational",
      integrations: "operational",
    },
  });
}
