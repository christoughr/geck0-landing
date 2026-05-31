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

  const plausibleHost = "https://plausible.io";
  const turnstileHost = "https://challenges.cloudflare.com";
  const gaHost = "https://www.googletagmanager.com https://www.google-analytics.com";

  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${plausibleHost} ${turnstileHost} ${gaHost}`,
      `connect-src 'self' ${plausibleHost} ${turnstileHost} ${gaHost} https://blob.vercel-storage.com`,
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      `frame-src ${turnstileHost}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";

  if (host === "app.geck0.ai") {
    const path = request.nextUrl.pathname;
    if (
      !path.startsWith("/app") &&
      !path.startsWith("/_next") &&
      !path.startsWith("/api") &&
      path !== "/favicon.ico" &&
      path !== "/manifest.json"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = path === "/" ? "/app" : `/app${path}`;
      const rewrite = NextResponse.rewrite(url);
      applySecurityHeaders(rewrite);
      return rewrite;
    }
  }

  if (host === "www.geck0.ai") {
    const url = request.nextUrl.clone();
    url.host = "geck0.ai";
    const redirect = NextResponse.redirect(url, 301);
    applySecurityHeaders(redirect);
    return redirect;
  }

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
