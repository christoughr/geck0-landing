"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";
import HoneypotField from "./HoneypotField";
import TurnstileWidget from "./TurnstileWidget";
import { isTurnstileEnabled } from "@/lib/turnstile-client";
import { trackContactSubmit } from "@/lib/analytics-events";

export default function ContactForm() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const onTurnstile = useCallback((token: string) => setTurnstileToken(token), []);
  const onTurnstileExpire = useCallback(() => setTurnstileToken(""), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consent) return;
    if (isTurnstileEnabled() && !turnstileToken) return;

    const fd = new FormData(e.currentTarget);
    setStatus("loading");
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          _gotcha: fd.get("_gotcha"),
          turnstileToken: turnstileToken || undefined,
        }),
      });

      const data = (await res.json()) as { emailSent?: boolean; error?: string };

      if (!res.ok) throw new Error(data.error ?? "failed");

      setForm({ name: "", email: "", company: "", message: "" });
      setConsent(false);
      setTurnstileToken("");
      trackContactSubmit();
      setStatus("success");
      setStatusMessage(data.emailSent === false ? t.contact.successNoEmail : t.contact.success);
    } catch {
      setStatus("error");
      setStatusMessage(t.contact.error);
    }
  };

  return (
    <Reveal>
      <form onSubmit={handleSubmit} className="space-y-4 mt-8 relative" noValidate>
        <HoneypotField />

        <div>
          <label htmlFor="contact-name" className="block text-sm text-white/50 mb-2">
            {t.contact.name}
          </label>
          <input
            id="contact-name"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60 focus-visible:ring-2 focus-visible:ring-purple-400/40"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm text-white/50 mb-2">
            {t.contact.email}
          </label>
          <input
            id="contact-email"
            required
            type="email"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60 focus-visible:ring-2 focus-visible:ring-purple-400/40"
          />
        </div>
        <div>
          <label htmlFor="contact-company" className="block text-sm text-white/50 mb-2">
            {t.contact.company}
          </label>
          <input
            id="contact-company"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60 focus-visible:ring-2 focus-visible:ring-purple-400/40"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm text-white/50 mb-2">
            {t.contact.message}
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60 focus-visible:ring-2 focus-visible:ring-purple-400/40 resize-none"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 accent-purple-400"
            required
          />
          <span className="text-white/45 text-xs leading-relaxed">{t.contact.consent}</span>
        </label>

        <TurnstileWidget onToken={onTurnstile} onExpire={onTurnstileExpire} />

        <button
          type="submit"
          disabled={
            status === "loading" ||
            !consent ||
            (isTurnstileEnabled() && !turnstileToken)
          }
          aria-busy={status === "loading"}
          className="w-full sm:w-auto bg-purple-400 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors focus-visible:ring-2 focus-visible:ring-purple-400/60"
        >
          {status === "loading" ? (
            <span aria-hidden="true">⋯</span>
          ) : (
            t.contact.submit
          )}
        </button>

        <div aria-live="polite" aria-atomic="true">
          {status === "success" && (
            <p className="text-teal-400 text-sm">{statusMessage || t.contact.success}</p>
          )}
          {status === "error" && (
            <p className="text-coral-400 text-sm">{statusMessage || t.contact.error}</p>
          )}
        </div>
      </form>
    </Reveal>
  );
}
