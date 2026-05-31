"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

const CONSENT_KEY = "geck0-cookie-consent";

function persistConsent() {
  document.cookie = `${CONSENT_KEY}=accepted; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export default function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    persistConsent();
    setVisible(false);
    window.dispatchEvent(new Event("geck0-cookie-consent"));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-navy-800 border border-navy-600/50 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-2xl">
        <p className="text-white/60 text-sm flex-1 leading-relaxed">
          {t.cookies.banner}{" "}
          <Link href="/cookies" className="text-purple-400 hover:text-purple-300 underline">
            {t.cookies.learnMore}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={accept}
            className="bg-purple-400 hover:bg-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {t.cookies.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
