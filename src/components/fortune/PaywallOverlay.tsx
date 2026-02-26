"use client";

import { useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  Lock,
  Users,
  Sun,
  Telescope,
} from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useCheckout } from "@/features/payment/hooks/useCheckout";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PRICE_DISPLAY } from "@/lib/polar";
import type { Element, StemMetaphor } from "@/lib/saju/types";

/* ─── Checkout intent persistence ─── */

const CHECKOUT_INTENT_KEY = "saju-checkout-intent";

export interface CheckoutIntent {
  readingId?: string;
  productId: string;
  returnPath: string;
}

function saveCheckoutIntent(intent: CheckoutIntent): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify(intent));
  }
}

export function getCheckoutIntent(): CheckoutIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHECKOUT_INTENT_KEY);
    return raw ? (JSON.parse(raw) as CheckoutIntent) : null;
  } catch {
    return null;
  }
}

export function clearCheckoutIntent(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CHECKOUT_INTENT_KEY);
  }
}

/* ─── Element-specific teaser map ─── */

const ELEMENT_TEASERS: Record<Element, string> = {
  wood: "personalTeaser_wood",
  fire: "personalTeaser_fire",
  earth: "personalTeaser_earth",
  metal: "personalTeaser_metal",
  water: "personalTeaser_water",
};

/* ─── Component ─── */

interface PaywallOverlayProps {
  onUnlock?: () => void;
  readingId?: string;
  productId?: string;
  price?: string;
  dayMasterName?: string;
  dayMasterElement?: Element;
  dayMasterMetaphor?: StemMetaphor;
}

export function PaywallOverlay({
  onUnlock,
  readingId,
  productId,
  price,
  dayMasterName,
  dayMasterElement,
}: PaywallOverlayProps) {
  const t = useTranslations("paywall");
  const { checkout, loading } = useCheckout();
  const { isAuthenticated, user } = useAuth();
  const displayPrice = price || PRICE_DISPLAY.SINGLE_READING;
  const trackedRef = useRef(false);

  // Track paywall view (once)
  if (!trackedRef.current) {
    track("paywall_viewed", {
      productId: productId || "",
      element: dayMasterElement || "",
    });
    trackedRef.current = true;
  }

  const handleUnlock = useCallback(() => {
    track("checkout_initiated", {
      source: "paywall",
      productId: productId || "",
      authenticated: String(isAuthenticated),
    });

    if (onUnlock) {
      onUnlock();
      return;
    }

    if (!isAuthenticated) {
      if (productId) {
        saveCheckoutIntent({
          readingId,
          productId,
          returnPath: window.location.pathname,
        });
      }
      signIn("google", { callbackUrl: window.location.href });
      return;
    }

    if (productId) {
      checkout({
        productId,
        readingId,
        customerEmail: user?.email || undefined,
        userId: (user as Record<string, unknown>)?.id as string | undefined,
      });
    }
  }, [onUnlock, productId, readingId, checkout, isAuthenticated, user]);

  // Resolve element-specific personalized teaser
  const elementTeaserKey = dayMasterElement
    ? ELEMENT_TEASERS[dayMasterElement]
    : null;

  const personalMessage =
    elementTeaserKey && safeT(t, elementTeaserKey)
      ? (safeT(t, elementTeaserKey) as string)
      : dayMasterName
        ? t("personalTeaser", { dayMaster: dayMasterName })
        : t("description");

  return (
    <div className="relative" style={{ minHeight: "var(--size-paywall-min-h)" }}>
      {/* Progressive reveal: blurred Present + Future sections */}
      <div className="select-none pointer-events-none" aria-hidden="true">
        {/* Present — lightly blurred */}
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3 blur-[4px]">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-primary">
              {t("previewPresent")}
            </h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {t("previewPresentDesc")}
          </p>
        </div>

        {/* Future — medium blur */}
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3 blur-[6px]">
          <div className="flex items-center gap-2 mb-2">
            <Telescope className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-primary">
              {t("previewFuture")}
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            {t("previewFutureDesc")}
          </p>
        </div>

        {/* Guidance — heavy blur */}
        <div className="p-5 rounded-lg bg-bg-card border border-[#1A1611]/[0.06] blur-[8px]">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            {t("previewGuidance")}
          </h3>
          <p className="text-xs text-text-secondary">
            {t("previewGuidanceDesc")}
          </p>
        </div>
      </div>

      {/* CTA Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center glass-premium p-8 rounded-xl max-w-md mx-4 ring-glow-purple">
          {/* Lock icon */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 animate-glow-breathe"
            style={{
              background: "var(--accent-bg-tint, rgba(168,85,247,0.1))",
              borderColor: "var(--accent-primary, #a855f7)",
              borderWidth: "1px",
            }}
          >
            <Lock
              className="w-6 h-6"
              style={{ color: "var(--accent-primary, #a855f7)" }}
            />
          </div>

          <h2 className="text-xl font-bold text-text-primary mb-2 font-[family-name:var(--font-heading)]">
            {t("title")}
          </h2>

          <p className="text-text-secondary text-sm mb-3 leading-relaxed">
            {personalMessage}
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-1.5 text-text-muted text-xs mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>{t("socialProof", { count: "2,500" })}</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Price badge */}
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-sm font-bold">
                {t("priceTag", { price: displayPrice })}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="btn-cta animate-cta-pulse w-full"
              onClick={handleUnlock}
              disabled={loading}
            >
              <Sparkles className="w-4 h-4" />
              {!isAuthenticated ? t("loginToUnlock") : t("unlockButton")}
            </Button>

            <p className="text-[10px] text-text-muted">
              {t("urgency")}
            </p>

            {/* Feature checklist */}
            <ul className="text-xs text-text-muted text-left space-y-1.5 mt-2">
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: "var(--accent-primary, #a855f7)" }}>&#10003;</span>
                <span>{t("feature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: "var(--accent-primary, #a855f7)" }}>&#10003;</span>
                <span>{t("feature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: "var(--accent-primary, #a855f7)" }}>&#10003;</span>
                <span>{t("feature3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: "var(--accent-primary, #a855f7)" }}>&#10003;</span>
                <span>{t("feature4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function safeT(
  t: ReturnType<typeof useTranslations>,
  key: string,
): string | null {
  try {
    const result = t(key as never);
    return typeof result === "string" && result !== key ? result : null;
  } catch {
    return null;
  }
}
