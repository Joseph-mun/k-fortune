"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles } from "lucide-react";
import { POLAR_PRODUCTS, PRICE_DISPLAY } from "@/lib/polar";
import { Link } from "@/i18n/navigation";

/**
 * PricingTable — MVP single product: $0.99 per reading
 */
export function PricingTable() {
  const t = useTranslations("pricing");

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      <Card className="glass-premium border-gold-500 relative ring-glow-purple w-full" glow>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-500 text-bg-dark text-xs font-bold rounded-full">
          {t("popular")}
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>

          <h3 className="text-2xl font-bold text-text-primary mb-2">
            {t("single.name")}
          </h3>

          <div className="mb-2">
            <span className="font-bold text-5xl text-gradient-gold">
              {PRICE_DISPLAY.SINGLE_READING}
            </span>
            <span className="text-text-muted text-sm ml-2">
              {t("single.perReading")}
            </span>
          </div>

          <p className="text-text-secondary text-sm mb-6 max-w-xs">
            {t("single.description")}
          </p>

          <ul className="space-y-3 mb-8 w-full text-left">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{t(`single.features.${i}`)}</span>
              </li>
            ))}
          </ul>

          <Link href="/start" className="w-full">
            <Button
              variant="gold"
              className="btn-cta animate-cta-pulse w-full"
            >
              {t("single.cta")}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
