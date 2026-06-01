import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "operational",
    service: "geck0-product-api",
    version: "v1",
  });
}
