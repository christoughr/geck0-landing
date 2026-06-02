"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";

const CONSENT_KEY = "geck0-cookie-consent";

function persistConsent(value: "accepted" | "declined") {
  localStorage.setItem(CONSENT_KEY, value);
  document.cookie = `${CONSENT_KEY}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export default function CookieConsent() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideOnApp = pathname?.startsWith("/app");

  useEffect(() => {
    document.body.classList.toggle("cookie-banner-open", visible && ready);
    return () => document.body.classList.remove("cookie-banner-open");
  }, [visible, ready]);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
    setReady(true);
  }, []);

  const accept = () => {
    persistConsent("accepted");
    setVisible(false);
    window.dispatchEvent(new Event("geck0-cookie-consent"));
  };

  const decline = () => {
    persistConsent("declined");
    setVisible(false);
  };

  if (hideOnApp || !ready) return null;

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="fixed bottom-4 left-4 z-[90] text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg transition-colors bg-navy-900/80 backdrop-blur-sm min-h-[44px]"
        aria-label={t.cookies.manage}
      >
        {t.cookies.manage}
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t.cookies.banner}
      className="fixed bottom-0 left-0 right-0 z-[100] p-2 sm:p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto bg-navy-800/95 border border-navy-600/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col sm:flex-row items-start md:items-center gap-4 shadow-2xl">
        <p className="text-white/60 text-xs sm:text-sm flex-1 leading-relaxed">
          <span className="sm:hidden">{t.cookies.bannerShort}</span>
          <span className="hidden sm:inline">{t.cookies.banner}</span>{" "}
          <Link href="/cookies" className="text-purple-400 hover:text-purple-300 underline">
            {t.cookies.learnMore}
          </Link>
        </p>
        <div className="flex flex-row gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="min-h-[40px] sm:min-h-[44px] flex-1 sm:flex-none border border-white/20 hover:border-white/40 text-white/60 hover:text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {t.cookies.decline}
          </button>
          <button
            onClick={accept}
            className="min-h-[40px] sm:min-h-[44px] flex-1 sm:flex-none bg-purple-400 hover:bg-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {t.cookies.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
