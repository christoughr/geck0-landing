"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import PageShell from "./PageShell";
import Reveal from "./Reveal";
import InteractiveProductMockup from "./InteractiveProductMockup";
import WaitlistForm from "./WaitlistForm";
import {
  DEFAULT_DEMO_VIDEO_PATH,
  resolveDemoVideoSource,
  type DemoVideoSource,
} from "@/lib/demo-video";

type DemoPageClientProps = {
  videoSource?: DemoVideoSource | null;
};

export default function DemoPageClient({ videoSource }: DemoPageClientProps) {
  const { t } = useI18n();
  const resolved =
    videoSource ??
    resolveDemoVideoSource(process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? undefined) ?? {
      kind: "native" as const,
      src: DEFAULT_DEMO_VIDEO_PATH,
    };

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <Reveal className="text-center mb-12">
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            Demo
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.demo.title}</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">{t.demo.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          {resolved ? (
            <div className="aspect-video rounded-2xl overflow-hidden border border-navy-600/40 mb-10 bg-navy-900">
              {resolved.kind === "embed" ? (
                <iframe
                  src={resolved.src}
                  title={t.demo.videoTitle}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  poster="/demo/geck0-product-demo-poster.jpg"
                  title={t.demo.videoTitle}
                  className="w-full h-full object-contain bg-black"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src="/demo/geck0-product-demo.webm" type="video/webm" />
                  <source src="/demo/geck0-product-demo.mp4" type="video/mp4" />
                </video>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-2xl border border-dashed border-purple-400/30 bg-navy-800/40 flex flex-col items-center justify-center mb-10 px-6 text-center">
              <p className="text-white/60 text-sm mb-2">{t.demo.videoComing}</p>
              <p className="text-white/35 text-xs max-w-md">{t.demo.videoNote}</p>
            </div>
          )}
        </Reveal>

        <InteractiveProductMockup />

        <Reveal delay={0.2} className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t.demo.ctaTitle}</h2>
          <p className="text-white/50 text-sm mb-6">{t.demo.ctaSub}</p>
          <WaitlistForm source="demo" variant="inline" className="max-w-md mx-auto mb-6" />
          <p className="text-white/35 text-sm">
            {t.demo.emailAlt}{" "}
            <a href="mailto:hello@geck0.ai" className="text-purple-400 hover:text-purple-300">
              hello@geck0.ai
            </a>
            {" · "}
            <Link href="/docs" className="text-purple-400 hover:text-purple-300">
              {t.demo.docsLink}
            </Link>
          </p>
        </Reveal>
      </div>
    </PageShell>
  );
}
