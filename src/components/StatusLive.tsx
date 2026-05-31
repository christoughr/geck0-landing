"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import PageShell from "./PageShell";
import { ContentPage } from "./ContentPage";
import Reveal from "./Reveal";

interface HealthData {
  status: string;
  uptime: string;
  timestamp: string;
  services: Record<string, string>;
}

export default function StatusLive() {
  const { locale, t } = useI18n();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = () => {
      fetch("/api/health")
        .then((r) => r.json())
        .then((data) => {
          setHealth(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const serviceLabels: Record<string, { ko: string; en: string }> = {
    api: { ko: "API", en: "API" },
    knowledgeGraph: { ko: "Knowledge Graph Sync", en: "Knowledge Graph Sync" },
    aiQa: { ko: "AI Q&A Engine", en: "AI Q&A Engine" },
    integrations: { ko: "Integrations", en: "Integrations" },
  };

  return (
    <PageShell>
      <ContentPage
        label={locale === "ko" ? "상태" : "Status"}
        title={locale === "ko" ? "시스템 상태" : "System Status"}
        subtitle={
          health?.status === "operational"
            ? locale === "ko"
              ? "모든 시스템 정상 운영 중"
              : "All systems operational"
            : locale === "ko"
            ? "상태 확인 중..."
            : "Checking status..."
        }
      >
        {loading && !health ? (
          <div className="flex items-center gap-3 text-white/40 text-sm">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            {t.status.loading}
          </div>
        ) : (
          <div className="space-y-3">
            {health &&
              Object.entries(health.services).map(([key, status]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-navy-800/60 border border-navy-600/30 rounded-xl px-5 py-4"
                >
                  <span className="text-white text-sm font-medium">
                    {serviceLabels[key]?.[locale] ?? key}
                  </span>
                  <span className="flex items-center gap-2 text-teal-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    {status === "operational"
                      ? locale === "ko"
                        ? "정상"
                        : "Operational"
                      : status}
                  </span>
                </div>
              ))}

            {health && (
              <p className="text-white/30 text-xs mt-6">
                {locale === "ko" ? "마지막 확인" : "Last checked"}:{" "}
                {new Date(health.timestamp).toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}
                {" · "}
                {locale === "ko" ? "업타임" : "Uptime"}: {health.uptime}
              </p>
            )}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-navy-600/30">
          <p className="text-white/50 text-sm mb-4">
            {locale === "ko"
              ? "장애 발생 시 hello@geck0.ai 으로 연락주세요."
              : "Report incidents to hello@geck0.ai"}
          </p>
          <Link
            href="/support"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            {locale === "ko" ? "고객 지원 →" : "Customer support →"}
          </Link>
        </div>
      </ContentPage>
    </PageShell>
  );
}
