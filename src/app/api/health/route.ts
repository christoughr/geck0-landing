import { NextResponse } from "next/server";
import { buildHealthReport } from "@/lib/health-checks";

const BOOT_TIME = Date.now();

export const dynamic = "force-dynamic";

export async function GET() {
  const report = await buildHealthReport(
    Math.floor((Date.now() - BOOT_TIME) / 1000)
  );

  const httpStatus =
    report.status === "unavailable" ? 503 : report.status === "degraded" ? 200 : 200;

  return NextResponse.json(report, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
