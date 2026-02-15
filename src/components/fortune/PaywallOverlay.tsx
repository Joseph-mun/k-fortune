"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  Lock,
  Users,
  Clock,
  TrendingUp,
  Heart,
  Shield,
  Calendar,
} from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useCheckout } from "@/features/payment/hooks/useCheckout";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { POLAR_PRODUCTS, PRICE_DISPLAY, TRIAL_DAYS } from "@/lib/polar";
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

/* ─── 24h countdown discount logic ─── */

const DISCOUNT_STORAGE_KEY = "saju-paywall-discount-start";
const DISCOUNT_DURATION_MS = 24 * 60 * 60 * 1000;
const DISCOUNT_PRICE = "$0.99";

function getDiscountStart(): number | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(DISCOUNT_STORAGE_KEY);
  return stored ? Number(stored) : null;
}

function initDiscountTimer(): number {
  const now = Date.now();
  if (typeof window !== "undefined") {
    localStorage.setItem(DISCOUNT_STORAGE_KEY, String(now));
  }
  return now;
}

function getRemainingMs(start: number): number {
  return Math.max(0, start + DISCOUNT_DURATION_MS - Date.now());
}

function formatCountdown(ms: number): string {
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((ms % (1000 * 60)) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
  dayMasterMetaphor,
}: PaywallOverlayProps) {
  const t = useTranslations("paywall");
  const { checkout, loading } = useCheckout();
  const { isAuthenticated, user } = useAuth();
  const displayPrice = price || PRICE_DISPLAY.DETAILED_READING;
  const trackedRef = useRef(false);

  // 24h countdown state
  const [discountStart, setDiscountStart] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const discountActive = remaining > 0;

  // Initialize discount timer on mount
  useEffect(() => {
    let start = getDiscountStart();
    if (!start) {
      start = initDiscountTimer();
    }
    setDiscountStart(start);
    setRemaining(getRemainingMs(start));
  }, []);

  // Tick countdown
  useEffect(() => {
    if (!discountStart) return;
    const interval = setInterval(() => {
      const r = getRemainingMs(discountStart);
      setRemaining(r);
      if (r <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [discountStart]);

  // Track paywall view (once)
  useEffect(() => {
    if (!trackedRef.current) {
      track("paywall_viewed", {
        productId: productId || "",
        discountActive: String(discountActive),
        element: dayMasterElement || "",
      });
      trackedRef.current = true;
    }
  }, [productId, discountActive, dayMasterElement]);

  const handleUnlock = useCallback(() => {
    track("checkout_initiated", {
      source: "paywall",
      productId: productId || "",
      discountActive: String(discountActive),
      authenticated: String(isAuthenticated),
    });

    if (onUnlock) {
      onUnlock();
      return;
    }

    if (!isAuthenticated) {
      // Save checkout intent before redirecting to login
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

    // Authenticated — proceed to checkout
    if (productId) {
      checkout({
        productId,
        readingId,
        customerEmail: user?.email || undefined,
        userId: (user as Record<string, unknown>)?.id as string | undefined,
      });
    }
  }, [onUnlock, productId, readingId, checkout, discountActive, isAuthenticated, user]);

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

  const effectivePrice = discountActive ? DISCOUNT_PRICE : displayPrice;

  return (
    <div className="relative" style={{ minHeight: "var(--size-paywall-min-h)" }}>
      {/* Progressive reveal: graduated blur preview */}
      <div className="select-none pointer-events-none" aria-hidden="true">
        {/* Career — partially visible (lightest blur) */}
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp
              className="w-4 h-4"
              style={{ color: "var(--ink-element-accent, var(--accent-primary, #a855f7))" }}
            />
            <h3 className="text-sm font-semibold text-text-primary">
              {t("previewCareer")}
            </h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {t("previewCareerDesc")}
          </p>
        </div>

        {/* Relationship — lightly blurred */}
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3 blur-[3px]">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-primary">
              {t("previewRelationship")}
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            {t("previewRelationshipDesc")}
          </p>
        </div>

        {/* Health — medium blur */}
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3 blur-[5px]">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-primary">
              {t("previewHealth")}
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            {t("previewHealthDesc")}
          </p>
        </div>

        {/* Fortune — heavy blur */}
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] mb-3 blur-[7px]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-primary">
              {t("previewFortune")}
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            {t("previewFortuneDesc")}
          </p>
        </div>

        {/* Advice — heaviest blur */}
        <div className="p-5 rounded-lg bg-bg-card border border-white/[0.06] blur-[9px]">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            {t("previewAdvice")}
          </h3>
          <p className="text-xs text-text-secondary">
            {t("previewAdviceDesc")}
          </p>
        </div>
      </div>

      {/* CTA Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center glass-premium p-8 rounded-xl max-w-md mx-4 ring-glow-purple">
          {/* Lock icon with element accent */}
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

          {/* Personalized element-specific teaser */}
          <p className="text-text-secondary text-sm mb-3 leading-relaxed">
            {personalMessage}
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-1.5 text-text-muted text-xs mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>{t("socialProof", { count: "2,500" })}</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* 24h discount countdown banner */}
            {discountActive && (
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-rose-400 text-sm font-semibold">
                  {t("discountBanner", { time: formatCountdown(remaining) })}
                </span>
              </div>
            )}

            {/* Price badge */}
            <div className="flex items-center justify-center gap-2">
              {discountActive && (
                <span className="text-text-muted text-sm line-through">
                  {displayPrice}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-sm font-bold">
                {t("priceTag", { price: effectivePrice })}
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
              {!isAuthenticated
                ? t("loginToUnlock")
                : discountActive
                  ? t("unlockButtonDiscount")
                  : t("unlockButton")}
            </Button>

            <p className="text-[10px] text-text-muted">
              {discountActive ? t("urgencyDiscount") : t("urgency")}
            </p>

            {/* Premium trial upsell */}
            <button
              type="button"
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                track("checkout_initiated", {
                  source: "paywall_trial",
                  productId: POLAR_PRODUCTS.PREMIUM_SUBSCRIPTION,
                });
                if (!isAuthenticated) {
                  saveCheckoutIntent({
                    productId: POLAR_PRODUCTS.PREMIUM_SUBSCRIPTION,
                    returnPath: window.location.pathname,
                  });
                  signIn("google", { callbackUrl: window.location.href });
                  return;
                }
                window.location.href = `/api/checkout?products=${POLAR_PRODUCTS.PREMIUM_SUBSCRIPTION}`;
              }}
            >
              {t("trialUpsell", { days: TRIAL_DAYS })}
            </button>

            {/* Feature checklist */}
            <ul className="text-xs text-text-muted text-left space-y-1.5 mt-2">
              <li className="flex items-start gap-2">
                <span
                  className="mt-0.5"
                  style={{ color: "var(--accent-primary, #a855f7)" }}
                >
                  &#10003;
                </span>
                <span>{t("feature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-0.5"
                  style={{ color: "var(--accent-primary, #a855f7)" }}
                >
                  &#10003;
                </span>
                <span>{t("feature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-0.5"
                  style={{ color: "var(--accent-primary, #a855f7)" }}
                >
                  &#10003;
                </span>
                <span>{t("feature3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-0.5"
                  style={{ color: "var(--accent-primary, #a855f7)" }}
                >
                  &#10003;
                </span>
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
