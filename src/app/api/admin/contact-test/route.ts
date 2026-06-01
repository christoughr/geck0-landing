import { NextRequest, NextResponse } from "next/server";
import {
  resolveFromAddress,
  resolveInboxAddress,
  sendEmailNotification,
} from "@/lib/contact-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/contact-test — Bearer ADMIN_API_KEY */
export async function GET(request: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY?.trim();
  if (!adminKey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${adminKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());
  const from = resolveFromAddress();
  const to = resolveInboxAddress();

  if (!hasResend) {
    return NextResponse.json({
      ok: false,
      error: "RESEND_API_KEY missing or empty on this deployment",
      from,
      to,
    });
  }

  const ok = await sendEmailNotification({
    name: "Admin test",
    email: "test@geck0.ai",
    message: "Resend delivery test from /api/admin/contact-test",
    at: new Date().toISOString(),
  });

  return NextResponse.json({
    ok,
    from,
    to,
    hint: ok
      ? "Check Resend dashboard → Emails and inbox"
      : "See Vercel function logs for [contact-store:email]",
  });
}
