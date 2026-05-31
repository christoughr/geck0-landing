"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { siteConfig } from "@/config/site";
import PageShell from "./PageShell";
import Reveal from "./Reveal";
import WaitlistForm from "./WaitlistForm";

export default function LoginView() {
  const { t } = useI18n();

  return (
    <PageShell>
      <div className="max-w-md mx-auto px-6 py-16">
        <Reveal className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t.login.title}</h1>
          <p className="text-white/50 text-sm">{t.login.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-navy-800/60 border border-navy-600/30 rounded-2xl p-6 mb-4 text-center">
            <p className="text-white/60 text-sm leading-relaxed mb-6">{t.login.betaNote}</p>

            <a
              href={siteConfig.appUrl}
              className="block w-full bg-purple-400 hover:bg-purple-600 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors mb-3 focus-visible:ring-2 focus-visible:ring-purple-400/60"
            >
              {t.login.continueToApp} →
            </a>

            <p className="text-white/30 text-xs">{t.login.redirectNote}</p>
          </div>

          <div className="bg-purple-900/20 border border-purple-600/20 rounded-xl p-4">
            <p className="text-purple-200 text-sm mb-4 text-center">{t.login.noAccess}</p>
            <WaitlistForm source="login" variant="inline" showLegal={false} />
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
