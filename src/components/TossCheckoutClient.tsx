"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { BillingPlan } from "@/lib/pricing";
import Link from "next/link";

export default function TossCheckoutClient() {
  const { locale, t } = useI18n();
  const ko = locale === "ko";
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = (searchParams.get("plan") ?? "starter") as BillingPlan;
  const seats = Math.max(1, Number.parseInt(searchParams.get("seats") ?? "1", 10) || 1);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "unavailable">("idle");
  const [message, setMessage] = useState("");

  const startCheckout = useCallback(async () => {
    setStatus("loading");
    setMessage("");

    try {
      const prep = await fetch("/api/billing/toss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, seats, email: email || undefined }),
      });
      const data = (await prep.json()) as {
        clientKey?: string;
        customerKey?: string;
        successUrl?: string;
        failUrl?: string;
        error?: string;
        detail?: string;
        reason?: string;
      };

      if (!prep.ok) {
        setStatus(data.reason === "toss_merchant_pending" ? "unavailable" : "error");
        setMessage(
          data.detail ??
            (ko ? "결제를 시작할 수 없습니다. 웨이트리스트를 이용해 주세요." : "Cannot start checkout.")
        );
        return;
      }

      if (!data.clientKey || !data.customerKey || !data.successUrl || !data.failUrl) {
        setStatus("error");
        setMessage(ko ? "결제 설정 오류" : "Checkout configuration error");
        return;
      }

      const tossPayments = await loadTossPayments(data.clientKey);
      const payment = tossPayments.payment({ customerKey: data.customerKey });

      await payment.requestBillingAuth({
        method: "CARD",
        successUrl: `${data.successUrl}?customerKey=${encodeURIComponent(data.customerKey)}`,
        failUrl: data.failUrl,
        customerEmail: email || undefined,
      });
    } catch (err) {
      console.error("[toss checkout client]", err);
      setStatus("error");
      setMessage(ko ? "결제창을 열지 못했습니다." : "Could not open payment window.");
    }
  }, [email, ko, plan, seats]);

  useEffect(() => {
    fetch("/api/billing/toss")
      .then((r) => r.json())
      .then((meta: { enabled?: boolean }) => {
        if (!meta.enabled) setStatus("unavailable");
      })
      .catch(() => setStatus("unavailable"));
  }, []);

  return (
    <div className="max-w-md w-full mx-auto text-center space-y-6">
      <h1 className="text-2xl font-bold text-white">
        {ko ? "토스 결제 · 1일 체험" : "Toss checkout · 1-day trial"}
      </h1>
      <p className="text-white/50 text-sm">
        {ko
          ? `${plan} · ${seats}석 · 카드 등록 후 1일 체험`
          : `${plan} · ${seats} seat(s) · card on file, then trial`}
      </p>

      {status === "unavailable" ? (
        <div className="space-y-4">
          <p className="text-white/45 text-sm">{t.pricing.paymentDeferred}</p>
          <Link
            href={`/#contact?plan=${plan}`}
            className="inline-block w-full py-3 rounded-xl bg-purple-400 hover:bg-purple-600 text-white font-semibold text-sm"
          >
            {ko ? "웨이트리스트" : "Join waitlist"}
          </Link>
        </div>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={ko ? "결제 영수증 이메일" : "Receipt email"}
            className="w-full min-h-[48px] bg-navy-800/80 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm"
          />
          <button
            type="button"
            onClick={() => void startCheckout()}
            disabled={status === "loading"}
            className="w-full min-h-[48px] bg-purple-400 hover:bg-purple-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm"
          >
            {status === "loading"
              ? ko
                ? "준비 중…"
                : "Preparing…"
              : ko
                ? "카드 등록 · 체험 시작"
                : "Register card · start trial"}
          </button>
        </>
      )}

      {message && <p className="text-coral-400 text-xs">{message}</p>}

      <button
        type="button"
        onClick={() => router.push("/pricing")}
        className="text-white/40 text-xs hover:text-white/70"
      >
        ← {ko ? "요금제" : "Pricing"}
      </button>
    </div>
  );
}
