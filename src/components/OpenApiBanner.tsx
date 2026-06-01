"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function OpenApiBanner() {
  const { locale } = useI18n();
  const ko = locale === "ko";

  return (
    <div className="max-w-2xl mx-auto px-6 pt-8">
      <div className="bg-navy-800/60 border border-purple-400/20 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-white/60 text-sm">
          {ko
            ? "랜딩 사이트 공개 API (waitlist, contact, health) OpenAPI 3.1"
            : "Landing site public API (waitlist, contact, health) — OpenAPI 3.1"}
        </p>
        <Link
          href="/openapi.yaml"
          download="geck0-landing-openapi.yaml"
          className="text-purple-400 hover:text-purple-300 text-sm font-medium whitespace-nowrap"
        >
          {ko ? "openapi.yaml 다운로드" : "Download openapi.yaml"}
        </Link>
      </div>
    </div>
  );
}
