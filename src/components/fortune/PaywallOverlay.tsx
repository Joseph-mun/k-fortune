"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCheckout } from "@/features/payment/hooks/useCheckout";

interface PaywallOverlayProps {
  onUnlock?: () => void;
  readingId?: string;
  productId?: string;
}

export function PaywallOverlay({ onUnlock, readingId, productId }: PaywallOverlayProps) {
  const t = useTranslations("paywall");
  const { checkout, loading } = useCheckout();

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
    <div className="relative">
      {/* Blurred content preview */}
      <div className="blur-sm select-none pointer-events-none">
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Career Path</h3>
          <p className="text-xs text-text-secondary">
            Your natural talents align with leadership roles where you can...
          </p>
        </div>
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Relationships</h3>
          <p className="text-xs text-text-secondary">
            In relationships, you tend to be supportive and understanding...
          </p>
        </div>
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Life Advice</h3>
          <p className="text-xs text-text-secondary">
            Focus on building strong foundations in your early years...
          </p>
        </div>
      </div>

      {/* CTA Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-bg-dark/95 backdrop-blur-xl p-6 rounded-xl border border-white/[0.08] max-w-sm mx-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-purple-400" />
          </div>

          <h2 className="text-lg font-bold text-text-primary mb-1.5 font-[family-name:var(--font-heading)]">
            {t("title")}
          </h2>

          <p className="text-text-secondary text-sm mb-5">
            {t("description")}
          </p>

          <div className="flex flex-col gap-3">
            <Button variant="primary" size="lg" onClick={handleUnlock} disabled={loading}>
              <Sparkles className="w-4 h-4" />
              {t("unlockButton")} - $2.99
            </Button>

            <ul className="text-xs text-text-muted text-left space-y-1.5 mt-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>{t("feature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>{t("feature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>{t("feature3")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
