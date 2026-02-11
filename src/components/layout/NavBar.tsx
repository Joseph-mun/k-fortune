"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function NavBar() {
  const tNav = useTranslations("nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/pricing" as const, label: tNav("pricing") },
    { href: "/compatibility" as const, label: tNav("compatibility") },
    { href: "/gallery" as const, label: tNav("gallery") },
    { href: "/star-match" as const, label: tNav("starMatch"), special: true },
  ];

  return (
    <nav className="w-full max-w-5xl mx-auto flex items-center justify-between py-4">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-semibold text-text-primary tracking-tight font-[family-name:var(--font-heading)]">
            SAJU
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.special
                  ? "px-3 py-1.5 text-sm text-pink-400/80 hover:text-pink-300 transition-colors rounded-md hover:bg-pink-500/5"
                  : "px-3 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors rounded-md hover:bg-white/[0.05]"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <LocaleSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 -mr-2 text-text-muted hover:text-text-primary transition-colors"
          aria-label={tNav("menu")}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-[280px] bg-bg-card border-l border-white/[0.06] flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <span className="text-sm font-semibold text-text-primary font-[family-name:var(--font-heading)]">
                {tNav("menu")}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                aria-label={tNav("close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={
                    link.special
                      ? "px-3 py-2.5 text-sm text-pink-400/80 hover:text-pink-300 transition-colors rounded-lg hover:bg-pink-500/5"
                      : "px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/[0.05]"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Footer: Locale switcher */}
            <div className="p-4 border-t border-white/[0.06]">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
