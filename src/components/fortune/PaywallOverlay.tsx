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
        <div className="p-6 rounded-2xl bg-bg-card border border-purple-500/10 mb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Career Path</h3>
          <p className="text-text-secondary">
            Your natural talents align with leadership roles where you can...
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-bg-card border border-purple-500/10 mb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Relationships</h3>
          <p className="text-text-secondary">
            In relationships, you tend to be supportive and understanding...
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-bg-card border border-purple-500/10">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Life Advice</h3>
          <p className="text-text-secondary">
            Focus on building strong foundations in your early years...
          </p>
        </div>
      </div>

      {/* CTA Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-bg-primary/95 backdrop-blur-xl p-8 rounded-3xl border border-purple-500/20 max-w-md mx-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-gold-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-2 font-[family-name:var(--font-heading)]">
            {t("title")}
          </h2>

          <p className="text-text-secondary mb-6">
            {t("description")}
          </p>

          <div className="flex flex-col gap-3">
            <Button variant="gold" size="lg" onClick={handleUnlock} disabled={loading}>
              <Sparkles className="w-5 h-5" />
              {t("unlockButton")} - $2.99
            </Button>

            <ul className="text-sm text-text-muted text-left space-y-2 mt-4">
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
