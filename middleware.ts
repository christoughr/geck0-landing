import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE } from "@/lib/locale";

function applySecurityHeaders(res: NextResponse): void {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
}

export function middleware(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get("lang");
  if (langParam === "en" || langParam === "ko") {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(LOCALE_COOKIE, langParam, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    applySecurityHeaders(redirect);
    return redirect;
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
