"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const tCommon = useTranslations("common");
  const tLegal = useTranslations("legal.footer");

  return (
    <footer className="w-full max-w-5xl py-8">
      {/* Gradient divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent mb-8" />

      <div className="flex flex-col items-center gap-4">
        {/* Tagline */}
        <p className="text-xs text-purple-400/60 tracking-widest uppercase font-[family-name:var(--font-heading)]">
          {tCommon("tagline")}
        </p>

        <div className="flex items-center gap-4 text-text-muted text-xs">
          <Link href="/legal/privacy" className="hover:text-text-secondary transition-colors">
            {tLegal("privacy")}
          </Link>
          <span className="text-[#A89F91]">|</span>
          <Link href="/legal/terms" className="hover:text-text-secondary transition-colors">
            {tLegal("terms")}
          </Link>
        </div>
        <p className="text-text-muted text-xs max-w-md text-center">
          {tCommon("disclaimer")}
        </p>
        <p className="text-text-muted text-xs">
          &copy; {new Date().getFullYear()} SAJU
        </p>
      </div>
    </footer>
  );
}
