"use client";

import { useEffect, useRef } from "react";
import { isTurnstileSkippedHost } from "@/lib/turnstile-host";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: (code?: string) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove: (id: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
}

export default function TurnstileWidget({ onToken, onExpire }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const skipped =
    typeof window !== "undefined" && isTurnstileSkippedHost(window.location.hostname);

  useEffect(() => {
    if (!siteKey || !containerRef.current || skipped) return;

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onToken,
        "expired-callback": onExpire,
        "error-callback": (code) => {
          // 110200 = domain not in widget hostname list (common on *.vercel.app previews)
          console.warn("[turnstile] error-callback", code);
        },
        theme: "dark",
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = renderWidget;
    script.onerror = () => console.warn("[turnstile] script failed to load");
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey, onToken, onExpire, skipped]);

  if (!siteKey || skipped) return null;

  return (
    <div className="w-full min-w-0 flex justify-center mt-4 px-2 overflow-hidden">
      <div ref={containerRef} className="max-w-[min(100%,304px)] [&_iframe]:max-w-full" />
    </div>
  );
}
