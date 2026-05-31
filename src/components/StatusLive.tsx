"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import PageShell from "./PageShell";
import { ContentPage } from "./ContentPage";

type ServiceStatus = "operational" | "degraded" | "unavailable" | "not_configured";

interface HealthData {
  status: "operational" | "degraded" | "unavailable";
  scope?: string;
  timestamp: string;
  deployment?: string;
  services: Record<string, ServiceStatus>;
  checks?: Record<string, { ok: boolean; detail?: string }>;
  _meta?: {
    uptimeSec?: number;
    note?: string;
    rateLimitBackend?: "upstash" | "memory";
  };
}

function formatUptime(seconds: number, locale: "ko" | "en"): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (locale === "ko") return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function statusColor(status: ServiceStatus): string {
  if (status === "operational") return "text-teal-400";
  if (status === "degraded") return "text-amber-400";
  if (status === "not_configured") return "text-white/40";
  return "text-coral-400";
}

function statusLabel(status: ServiceStatus, locale: "ko" | "en"): string {
  const labels: Record<ServiceStatus, { ko: string; en: string }> = {
    operational: { ko: "정상", en: "Operational" },
    degraded: { ko: "제한", en: "Degraded" },
    unavailable: { ko: "오류", en: "Unavailable" },
    not_configured: { ko: "미설정", en: "Not configured" },
  };
  return labels[status][locale];
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
    website: { ko: "웹사이트", en: "Website" },
    api: { ko: "API", en: "API" },
    mailchimp: { ko: "웨이트리스트 (Mailchimp)", en: "Waitlist (Mailchimp)" },
    contact: { ko: "문의 저장", en: "Contact storage" },
    turnstile: { ko: "봇 방어 (Turnstile)", en: "Bot protection (Turnstile)" },
    rateLimit: { ko: "Rate limit", en: "Rate limit" },
  };

  const overallOk = health?.status === "operational";

  return (
    <PageShell>
      <ContentPage
        label={locale === "ko" ? "상태" : "Status"}
        title={locale === "ko" ? "시스템 상태" : "System Status"}
        subtitle={
          health?.status === "operational"
            ? locale === "ko"
              ? "마케팅 사이트 정상 운영 중"
              : "Marketing site operational"
            : health?.status === "degraded"
              ? locale === "ko"
                ? "일부 서비스 제한 또는 미설정"
                : "Some services degraded or not configured"
              : locale === "ko"
                ? "상태 확인 중..."
                : "Checking status..."
        }
      >
        <p className="text-white/40 text-xs mb-6 leading-relaxed">{t.status.disclaimer}</p>

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
                  className="flex items-center justify-between bg-navy-800/60 border border-navy-600/30 rounded-xl px-4 sm:px-5 py-4 min-h-[52px]"
                >
                  <div>
                    <span className="text-white text-sm font-medium block">
                      {serviceLabels[key]?.[locale] ?? key}
                    </span>
                    {health.checks?.[key]?.detail && (
                      <span className="text-white/30 text-xs mt-0.5 block">
                        {health.checks[key].detail}
                      </span>
                    )}
                  </div>
                  <span className={`flex items-center gap-2 text-sm ${statusColor(status)}`}>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        status === "operational"
                          ? "bg-teal-400 animate-pulse"
                          : status === "degraded"
                            ? "bg-amber-400"
                            : status === "not_configured"
                              ? "bg-white/30"
                              : "bg-coral-400"
                      }`}
                    />
                    {statusLabel(status, locale)}
                  </span>
                </div>
              ))}

            {health && (
              <p className="text-white/30 text-xs mt-6">
                {locale === "ko" ? "마지막 확인" : "Last checked"}:{" "}
                {new Date(health.timestamp).toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}
                {health._meta?.uptimeSec != null && (
                  <>
                    {" · "}
                    {locale === "ko" ? "업타임" : "Uptime"}:{" "}
                    {formatUptime(health._meta.uptimeSec, locale)}
                  </>
                )}
                {health._meta?.rateLimitBackend && (
                  <>
                    {" · "}
                    Rate limit: {health._meta.rateLimitBackend}
                  </>
                )}
                {!overallOk && health.deployment && (
                  <>
                    {" · "}
                    deploy: {health.deployment}
                  </>
                )}
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
            className="text-purple-400 hover:text-purple-300 text-sm font-medium focus-visible:underline"
          >
            {locale === "ko" ? "고객 지원 →" : "Customer support →"}
          </Link>
        </div>
      </ContentPage>
    </PageShell>
  );
}
