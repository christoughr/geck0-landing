"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function TossCheckoutSuccess() {
  const { locale, t } = useI18n();
  const ko = locale === "ko";
  const searchParams = useSearchParams();
  const authKey = searchParams.get("authKey") ?? "";
  const customerKey = searchParams.get("customerKey") ?? "";
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (!authKey || !customerKey) {
      setState("error");
      setDetail(ko ? "결제 인증 정보가 없습니다." : "Missing payment authorization.");
      return;
    }

    fetch("/api/billing/toss/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authKey, customerKey }),
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          setState("error");
          setDetail(body.error ?? (ko ? "빌링키 발급 실패" : "Billing key failed"));
          return;
        }
        setState("ok");
        setDetail(body.trialEnd ?? "");
      })
      .catch(() => {
        setState("error");
        setDetail(ko ? "네트워크 오류" : "Network error");
      });
  }, [authKey, customerKey, ko]);

  if (state === "loading") {
    return (
      <p className="text-white/60 text-sm">{ko ? "결제 등록 처리 중…" : "Completing registration…"}</p>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-4">
        <p className="text-coral-400 text-sm">{detail}</p>
        <Link href="/pricing" className="text-purple-400 text-sm hover:text-purple-300">
          ← {ko ? "요금제" : "Pricing"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-teal-400 text-sm font-semibold">{t.checkout.successBadge}</p>
      <h1 className="text-2xl font-bold text-white">{t.checkout.successTitle}</h1>
      <p className="text-white/60 text-sm">{t.checkout.successBody}</p>
      {detail && (
        <p className="text-white/35 text-xs">
          {ko ? "체험 종료 예정:" : "Trial ends:"} {new Date(detail).toLocaleString(locale)}
        </p>
      )}
      <Link
        href="https://app.geck0.ai"
        className="inline-block w-full py-3 rounded-xl bg-purple-400 hover:bg-purple-600 text-white font-semibold text-sm"
      >
        {t.checkout.appLink}
      </Link>
    </div>
  );
}
