"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";

export default function ContactForm() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
          <label htmlFor="contact-name" className="block text-sm text-white/50 mb-2">
            {t.contact.name}
          </label>
          <input
            id="contact-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60"
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
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60"
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
            className="w-full bg-navy-900/60 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-purple-400 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          {status === "loading" ? "..." : t.contact.submit}
        </button>
        {status === "success" && <p className="text-teal-400 text-sm">{t.contact.success}</p>}
        {status === "error" && <p className="text-coral-400 text-sm">{t.contact.error}</p>}
      </form>
    </Reveal>
  );
}
