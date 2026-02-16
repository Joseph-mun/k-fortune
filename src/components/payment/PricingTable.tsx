"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { POLAR_PRODUCTS, PRICE_DISPLAY, TRIAL_DAYS } from "@/lib/polar";

interface PricingPlan {
  id: string;
  polarProductId: string | null;
  name: string;
  price: string;
  originalPrice?: string;
  period?: string;
  saveBadge?: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  trialNote?: string;
}

/**
 * PricingTable - Display pricing plans (Section 5.2)
 *
 * Plans:
 * - Basic (FREE): Pillars, Element analysis, Lucky info
 * - Detail ($1.99): Full career, love, health, wealth, 2026 fortune
 * - Premium ($2.99/mo or $24.99/yr): All access + monthly updates + compatibility
 */
export function PricingTable() {
  const t = useTranslations("pricing");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const premiumProductId = billingPeriod === "annual"
    ? POLAR_PRODUCTS.PREMIUM_ANNUAL
    : POLAR_PRODUCTS.PREMIUM_SUBSCRIPTION;

  const premiumPrice = billingPeriod === "annual"
    ? t("premium.price", { price: PRICE_DISPLAY.PREMIUM_ANNUAL })
    : t("premium.price", { price: PRICE_DISPLAY.PREMIUM_SUBSCRIPTION });

  const premiumPeriod = billingPeriod === "annual"
    ? t("premium.periodYear")
    : t("premium.period");

  const plans: PricingPlan[] = [
    {
      id: "basic",
      polarProductId: null,
      name: t("basic.name"),
      price: t("basic.price"),
      features: [
        t("basic.features.0"),
        t("basic.features.1"),
        t("basic.features.2"),
      ],
      cta: t("basic.cta"),
    },
    {
      id: "detailed",
      polarProductId: POLAR_PRODUCTS.DETAILED_READING,
      name: t("detailed.name"),
      price: t("detailed.price", { price: PRICE_DISPLAY.DETAILED_READING }),
      features: [
        t("detailed.features.0"),
        t("detailed.features.1"),
        t("detailed.features.2"),
        t("detailed.features.3"),
        t("detailed.features.4"),
      ],
      highlighted: true,
      cta: t("detailed.cta"),
    },
    {
      id: "premium",
      polarProductId: premiumProductId,
      name: t("premium.name"),
      price: premiumPrice,
      originalPrice: billingPeriod === "annual" ? PRICE_DISPLAY.PREMIUM_SUBSCRIPTION : undefined,
      period: premiumPeriod,
      saveBadge: billingPeriod === "annual" ? t("premium.saveBadge") : undefined,
      features: [
        t("premium.features.0"),
        t("premium.features.1"),
        t("premium.features.2"),
        t("premium.features.3"),
      ],
      cta: t("premium.trialCta", { days: TRIAL_DAYS }),
      trialNote: t("premium.trialNote", { days: TRIAL_DAYS }),
    },
  ];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
      {/* Monthly / Annual Toggle */}
      <div className="flex items-center gap-3 bg-bg-card border border-[#1A1611]/[0.06] rounded-full p-1">
        <button
          type="button"
          onClick={() => {
            setBillingPeriod("monthly");
            track("pricing_toggle", { period: "monthly" });
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            billingPeriod === "monthly"
              ? "bg-purple-500/20 text-purple-300"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {t("toggle.monthly")}
        </button>
        <button
          type="button"
          onClick={() => {
            setBillingPeriod("annual");
            track("pricing_toggle", { period: "annual" });
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            billingPeriod === "annual"
              ? "bg-purple-500/20 text-purple-300"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {t("toggle.annual")}
          <span className="px-1.5 py-0.5 bg-green-500/15 text-green-400 text-[10px] font-bold rounded-full">
            {t("toggle.save")}
          </span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={plan.highlighted ? "glass-premium border-gold-500 relative ring-glow-purple" : ""}
            glow={plan.highlighted}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-500 text-bg-dark text-xs font-bold rounded-full animate-pulse">
                {t("popular")}
              </div>
            )}

            <div className="flex flex-col h-full">
              {/* Plan name */}
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                {plan.originalPrice && (
                  <span className="text-text-muted text-lg line-through mr-2">
                    {plan.originalPrice}
                  </span>
                )}
                <span className={`font-bold text-gradient-gold ${plan.highlighted ? "text-5xl" : "text-4xl"}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-text-muted text-sm ml-2">
                    {plan.period}
                  </span>
                )}
                {plan.saveBadge && (
                  <span className="ml-2 px-2 py-0.5 bg-green-500/15 text-green-400 text-xs font-semibold rounded-full">
                    {plan.saveBadge}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.polarProductId ? (
                <a href={`/api/checkout?products=${plan.polarProductId}`}>
                  <Button
                    variant={plan.highlighted ? "gold" : "secondary"}
                    className={plan.highlighted ? "btn-cta animate-cta-pulse w-full" : "w-full"}
                  >
                    {plan.cta}
                  </Button>
                </a>
              ) : (
                <a href="/">
                  <Button variant="secondary" className="w-full">
                    {plan.cta}
                  </Button>
                </a>
              )}

              {/* Trial note */}
              {plan.trialNote && (
                <p className="text-[10px] text-text-muted text-center mt-2">
                  {plan.trialNote}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
