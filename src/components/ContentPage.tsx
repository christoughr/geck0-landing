"use client";

import Link from "next/link";
import Reveal from "./Reveal";

interface ContentPageProps {
  label?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ContentPage({ label, title, subtitle, children }: ContentPageProps) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Reveal>
        {label && (
          <p className="text-sm text-purple-400 font-semibold tracking-widest uppercase mb-3">
            {label}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        {subtitle && <p className="text-white/50 text-lg mb-10">{subtitle}</p>}
      </Reveal>
      <Reveal delay={0.1}>
        <div className="prose-geck0">{children}</div>
      </Reveal>
    </div>
  );
}

export function PageCard({
  title,
  desc,
  href,
  cta,
}: {
  title: string;
  desc: string;
  href: string;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-navy-800/60 border border-navy-600/30 rounded-2xl p-6 hover:border-purple-400/40 transition-colors group"
    >
      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
        {title}
      </h3>
      <p className="text-white/55 text-sm leading-relaxed mb-3">{desc}</p>
      {cta && <span className="text-purple-400 text-sm font-medium">{cta} →</span>}
    </Link>
  );
}

export function PageButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls =
    variant === "primary"
      ? "bg-purple-400 hover:bg-purple-600 text-white"
      : "border border-white/20 hover:border-white/40 text-white/70 hover:text-white";
  return (
    <Link
      href={href}
      className={`inline-block font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm ${cls}`}
    >
      {children}
    </Link>
  );
}
