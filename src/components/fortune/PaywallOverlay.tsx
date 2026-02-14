"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCheckout } from "@/features/payment/hooks/useCheckout";
import { PRICE_DISPLAY } from "@/lib/polar";

interface PaywallOverlayProps {
  onUnlock?: () => void;
  readingId?: string;
  productId?: string;
  price?: string;
  dayMasterName?: string;
}

export function PaywallOverlay({ onUnlock, readingId, productId, price, dayMasterName }: PaywallOverlayProps) {
  const t = useTranslations("paywall");
  const { checkout, loading } = useCheckout();
  const displayPrice = price || PRICE_DISPLAY.DETAILED_READING;

  const handleUnlock = () => {
    if (onUnlock) {
      onUnlock();
      return;
    }

    // Default behavior: redirect to Polar checkout
    if (productId) {
      checkout({
        productId,
        readingId,
      });
    }
  };

  return (
    <div className="relative" style={{ minHeight: "var(--size-paywall-min-h)" }}>
      {/* Blurred content preview */}
      <div className="blur-sm select-none pointer-events-none" aria-hidden="true">
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3">
          <h3 className="text-sm font-semibold text-text-primary mb-2">{t("previewCareer")}</h3>
          <p className="text-xs text-text-secondary">{t("previewCareerDesc")}</p>
        </div>
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3">
          <h3 className="text-sm font-semibold text-text-primary mb-2">{t("previewRelationship")}</h3>
          <p className="text-xs text-text-secondary">{t("previewRelationshipDesc")}</p>
        </div>
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3">
          <h3 className="text-sm font-semibold text-text-primary mb-2">{t("previewAdvice")}</h3>
          <p className="text-xs text-text-secondary">{t("previewAdviceDesc")}</p>
        </div>
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-text-primary mb-2">&nbsp;</h3>
          <p className="text-xs text-text-secondary">&nbsp;</p>
        </div>
      </div>

      {/* CTA Overlay */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="text-center glass p-6 rounded-lg max-w-md mx-4 shadow-2xl" style={{ boxShadow: "0 0 40px var(--accent-glow, rgba(168,85,247,0.15))" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow" style={{ background: "var(--accent-bg-tint, rgba(168,85,247,0.1))", borderColor: "var(--accent-primary, #a855f7)", borderWidth: "1px" }}>
            <Lock className="w-5 h-5" style={{ color: "var(--accent-primary, #a855f7)" }} />
          </div>

          <h2 className="text-lg font-bold text-text-primary mb-1.5 font-[family-name:var(--font-heading)]">
            {t("title")}
          </h2>

          <p className="text-text-secondary text-sm mb-2">
            {dayMasterName
              ? t("personalTeaser", { dayMaster: dayMasterName })
              : t("description")}
          </p>

          <p className="text-text-muted text-xs mb-5">
            {t("socialProof", { count: "2,500" })}
          </p>

          <div className="flex flex-col gap-3">
            <Button variant="primary" size="lg" onClick={handleUnlock} disabled={loading}>
              <Sparkles className="w-4 h-4" />
              {t("unlockButton")} - {t("price", { price: displayPrice })}
            </Button>

            <ul className="text-xs text-text-muted text-left space-y-1.5 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: "var(--accent-primary, #a855f7)" }}>✓</span>
                <span>{t("feature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: "var(--accent-primary, #a855f7)" }}>✓</span>
                <span>{t("feature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: "var(--accent-primary, #a855f7)" }}>✓</span>
                <span>{t("feature3")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
