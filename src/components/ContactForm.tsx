"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

export default function ContactForm() {
  const { locale } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const labels =
    locale === "ko"
      ? {
          name: "이름",
          email: "이메일",
          message: "메시지",
          submit: "문의 보내기",
          success: "문의가 접수되었습니다. 곧 연락드리겠습니다.",
          error: "오류가 발생했습니다. hello@geck0.ai 으로 직접 연락해 주세요.",
        }
      : {
          name: "Name",
          email: "Email",
          message: "Message",
          submit: "Send message",
          success: "Message received. We'll be in touch soon.",
          error: "Something went wrong. Email us at hello@geck0.ai",
        };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <Reveal>
      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
        <div>
          <label className="block text-sm text-white/50 mb-2">{labels.name}</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">{labels.email}</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">{labels.message}</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-purple-400 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          {status === "loading" ? "..." : labels.submit}
        </button>
        {status === "success" && <p className="text-teal-400 text-sm">{labels.success}</p>}
        {status === "error" && <p className="text-coral-400 text-sm">{labels.error}</p>}
      </form>
    </Reveal>
  );
}
