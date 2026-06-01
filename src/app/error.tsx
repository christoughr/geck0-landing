"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("[geck0-error]", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-white mb-3">{t.errors.title}</h1>
      <p className="text-white/50 text-sm mb-8 max-w-md">{t.errors.body}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="bg-purple-400 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          {t.errors.retry}
        </button>
        <Link
          href="/"
          className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
        >
          {t.errors.home}
        </Link>
      </div>
    </div>
  );
}
