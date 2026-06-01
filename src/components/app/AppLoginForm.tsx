"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/translations";

export default function AppLoginForm({ locale }: { locale: Locale }) {
  const ko = locale === "ko";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/app/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string; message?: string };

      if (res.ok) {
        window.location.href = "/app/dashboard";
        return;
      }

      if (data.error === "not_invited") {
        setMessage(
          ko
            ? "베타 초대 목록에 없습니다. geck0.ai 웨이트리스트에 먼저 등록해 주세요."
            : data.message ?? "Not on the beta list. Join the waitlist at geck0.ai first."
        );
      } else {
        setMessage(data.message ?? (ko ? "로그인에 실패했습니다." : "Sign-in failed."));
      }
      setStatus("error");
    } catch {
      setMessage(ko ? "네트워크 오류" : "Network error");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 w-full max-w-sm mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={ko ? "회사 이메일" : "Work email"}
        className="w-full min-h-[48px] bg-navy-800/80 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full min-h-[48px] bg-purple-400 hover:bg-purple-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm"
      >
        {status === "loading" ? (ko ? "확인 중…" : "Checking…") : ko ? "베타 앱 입장" : "Enter beta app"}
      </button>
      {message && <p className="text-coral-400 text-xs text-center">{message}</p>}
    </form>
  );
}
