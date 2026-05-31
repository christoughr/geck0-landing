"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.product, href: "/#features" },
    { label: t.nav.howItWorks, href: "/#how-it-works" },
    { label: t.nav.pricing, href: "/pricing" },
    { label: t.nav.testimonials, href: "/#testimonials" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.enterprise, href: "/enterprise" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-900/95 backdrop-blur-md border-b border-navy-600/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {t.nav.login}
          </Link>
          <Link
            href="/#contact"
            className="text-sm bg-purple-400 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            {t.nav.cta}
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <LanguageSwitcher />
          <button
            className="text-white/70 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t.nav.menuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <>
                  <line x1="3" y1="8" x2="21" y2="8" strokeLinecap="round" />
                  <line x1="3" y1="16" x2="21" y2="16" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-navy-800/98 backdrop-blur-md border-t border-navy-600/50 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-sm text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.login}
          </Link>
          <Link
            href="/#contact"
            className="text-sm bg-purple-400 text-white px-4 py-2 rounded-lg text-center font-medium"
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.cta}
          </Link>
        </div>
      )}
    </nav>
  );
}
