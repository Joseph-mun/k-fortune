"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, X, Sparkles, LogIn, LogOut } from "lucide-react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function NavBar() {
  const tNav = useTranslations("nav");
  const { isAuthenticated, user, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Focus trap and Escape key handling
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    // Handle Tab key for focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/pricing" as const, label: tNav("pricing") },
    { href: "/compatibility" as const, label: tNav("compatibility") },
    { href: "/gallery" as const, label: tNav("gallery") },
    { href: "/star-match" as const, label: tNav("starMatch"), special: true },
  ];

  return (
    <nav
      className="w-full max-w-5xl mx-auto flex items-center justify-between py-4"
      aria-label="Primary navigation"
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
          <span className="text-lg font-bold text-text-primary tracking-widest font-[family-name:var(--font-heading)]">
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

        {/* Auth state — desktop */}
        <div className="hidden md:block">
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors rounded-md hover:bg-white/[0.05]"
              title={user?.email || ""}
            >
              {user?.image ? (
                <img src={user.image} alt="" className="w-5 h-5 rounded-full" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-300">
                  {user?.name?.[0] || "U"}
                </div>
              )}
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => login("google")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors rounded-md hover:bg-white/[0.05]"
            >
              <LogIn className="w-3.5 h-3.5" />
              {tNav("signIn")}
            </button>
          )}
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
          ref={modalRef}
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={tNav("menu")}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-0 right-0 bottom-0 bg-bg-card border-l border-white/[0.06] flex flex-col animate-slide-in-right" style={{ width: "var(--size-menu-mobile)" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <span className="text-sm font-semibold text-text-primary font-[family-name:var(--font-heading)]">
                {tNav("menu")}
              </span>
              <button
                ref={closeButtonRef}
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

            {/* Footer: Auth + Locale switcher */}
            <div className="p-4 border-t border-white/[0.06] flex flex-col gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/[0.05] w-full"
                >
                  {user?.image ? (
                    <img src={user.image} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-300">
                      {user?.name?.[0] || "U"}
                    </div>
                  )}
                  <span className="flex-1 text-left truncate">{user?.name || user?.email}</span>
                  <LogOut className="w-3.5 h-3.5 text-text-muted" />
                </button>
              ) : (
                <button
                  onClick={() => { login("google"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/[0.05] w-full"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  {tNav("signIn")}
                </button>
              )}
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
