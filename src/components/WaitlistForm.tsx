"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import HoneypotField from "./HoneypotField";
import TurnstileWidget from "./TurnstileWidget";
import { isTurnstileEnabled } from "@/lib/turnstile-client";
import { trackWaitlistSignup } from "@/lib/analytics-events";

export type WaitlistSource =
  | "waitlist"
  | "login"
  | "hero"
  | "footer"
  | "enterprise"
  | "blog"
  | "demo";

type WaitlistFormProps = {
  source: WaitlistSource;
  variant?: "footer" | "inline" | "compact";
  id?: string;
  className?: string;
  showLegal?: boolean;
};

export default function WaitlistForm({
  source,
  variant = "footer",
  id,
  className = "",
  showLegal = variant === "footer",
}: WaitlistFormProps) {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const plan = new URLSearchParams(window.location.search).get("plan");
    if (plan === "starter" || plan === "growth") {
      setSelectedPlan(plan);
    }
  }, []);

  const onTurnstile = useCallback((token: string) => setTurnstileToken(token), []);
  const onTurnstileExpire = useCallback(() => setTurnstileToken(""), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage(t.cta.invalid);
      setStatus("error");
      return;
    }

    if (isTurnstileEnabled() && !turnstileToken) {
      setMessage(t.cta.error);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          plan: selectedPlan ?? undefined,
          _gotcha: fd.get("_gotcha"),
          turnstileToken: turnstileToken || undefined,
        }),
      });

      const data = (await res.json()) as { pending?: boolean; error?: string };

      if (!res.ok) {
        setMessage(data.error === "Invalid email" ? t.cta.invalid : t.cta.error);
        setStatus("error");
        return;
      }

      setMessage(data.pending ? t.cta.successPending : t.cta.success);
      setStatus("success");
      setEmail("");
      setTurnstileToken("");
      trackWaitlistSignup(source);
    } catch {
      setMessage(t.cta.error);
      setStatus("error");
    }
  };

  const formLayout =
    variant === "footer"
      ? "flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative"
      : variant === "compact"
        ? "flex flex-col sm:flex-row gap-2 max-w-sm mx-auto relative"
        : "flex flex-col sm:flex-row gap-3 max-w-lg mx-auto relative";

  const inputClass =
    variant === "compact"
      ? "flex-1 min-h-[44px] bg-navy-800/80 border border-navy-600/50 text-white placeholder:text-white/30 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-400/60 focus-visible:ring-2 focus-visible:ring-purple-400/40 transition-colors disabled:opacity-50"
      : "flex-1 min-h-[48px] bg-navy-800/80 border border-navy-600/50 text-white placeholder:text-white/30 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60 focus-visible:ring-2 focus-visible:ring-purple-400/40 transition-colors disabled:opacity-50";

  const buttonClass =
    variant === "compact"
      ? "min-h-[44px] bg-purple-400 hover:bg-purple-600 disabled:bg-purple-600/50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-purple-400/60"
      : "min-h-[48px] bg-purple-400 hover:bg-purple-600 disabled:bg-purple-600/50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-purple-400/60";

  return (
    <div className={className}>
      {selectedPlan && (
        <p className="text-purple-300/90 text-xs text-center mb-3">
          {locale === "ko"
            ? `선택 플랜: ${selectedPlan === "starter" ? "Starter" : "Growth"}`
            : `Selected plan: ${selectedPlan === "starter" ? "Starter" : "Growth"}`}
        </p>
      )}
      <form id={id} className={formLayout} onSubmit={handleSubmit}>
        <HoneypotField />
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.cta.placeholder}
          aria-label={t.cta.placeholder}
          disabled={status === "loading"}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={status === "loading" || (isTurnstileEnabled() && !turnstileToken)}
          aria-busy={status === "loading"}
          className={buttonClass}
        >
          {status === "loading" ? t.cta.loading : t.cta.button}
        </button>
      </form>

      <TurnstileWidget onToken={onTurnstile} onExpire={onTurnstileExpire} />

      <div aria-live="polite" aria-atomic="true">
        {message && (
          <p
            className={`text-sm mt-3 text-center ${
              status === "success" ? "text-teal-400" : "text-coral-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {showLegal && (
        <p className="text-white/30 text-xs mt-4 text-center">
          {locale === "ko" ? (
            <>
              가입하면{" "}
              <Link href="/terms" className="underline hover:text-white/50">
                이용약관
              </Link>{" "}
              및{" "}
              <Link href="/privacy" className="underline hover:text-white/50">
                개인정보처리방침
              </Link>
              에 동의하는 것으로 간주됩니다
            </>
          ) : (
            <>
              By signing up you agree to our{" "}
              <Link href="/terms" className="underline hover:text-white/50">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-white/50">
                Privacy Policy
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}
