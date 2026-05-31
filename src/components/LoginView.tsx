"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { siteConfig } from "@/config/site";
import PageShell from "./PageShell";
import { ContentPage } from "./ContentPage";
import Reveal from "./Reveal";

export default function LoginView() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.location.href = siteConfig.appUrl;
  };

  const handleWaitlist = async () => {
    if (!email.trim()) {
      window.location.href = "/#contact";
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "login" }),
      });
    } finally {
      window.location.href = "/#contact";
    }
  };

  return (
    <PageShell>
      <div className="max-w-md mx-auto px-6 py-16">
        <Reveal className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t.login.title}</h1>
          <p className="text-white/50 text-sm">{t.login.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-navy-800/60 border border-navy-600/30 rounded-2xl p-6 mb-4">
            <form onSubmit={handleLogin}>
              <label className="block text-sm text-white/50 mb-2">{t.login.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-navy-900/60 border border-navy-600/50 text-white placeholder:text-white/30 px-4 py-3 rounded-xl text-sm mb-4 focus:outline-none focus:border-purple-400/60"
              />
              <label className="block text-sm text-white/50 mb-2">{t.login.password}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-navy-900/60 border border-navy-600/50 text-white placeholder:text-white/30 px-4 py-3 rounded-xl text-sm mb-4 focus:outline-none focus:border-purple-400/60"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-400 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors mb-3"
              >
                {loading ? "..." : t.login.signIn}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-600/40" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-navy-800 px-2 text-white/30">{t.login.or}</span>
              </div>
            </div>

            <div className="space-y-2">
              {(["Google", "Microsoft"] as const).map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => (window.location.href = siteConfig.appUrl)}
                  className="w-full border border-navy-600/50 hover:border-white/20 text-white/60 hover:text-white text-sm py-2.5 rounded-xl transition-colors"
                >
                  {t.login.continueWith} {provider}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-600/20 rounded-xl p-4 text-center">
            <p className="text-purple-200 text-sm mb-3">{t.login.betaNote}</p>
            <button
              onClick={handleWaitlist}
              disabled={loading}
              className="text-purple-400 hover:text-purple-300 text-sm font-semibold"
            >
              {t.login.waitlist} →
            </button>
          </div>

          <p className="text-white/25 text-xs text-center mt-6">
            {t.login.noAccount}{" "}
            <Link href="/#contact" className="text-purple-400 hover:text-purple-300">
              {t.login.signUp}
            </Link>
          </p>
        </Reveal>
      </div>
    </PageShell>
  );
}
