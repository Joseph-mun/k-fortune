import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

interface PricingPlan {
  id: string;
  polarProductId: string | null;
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

/**
 * PricingTable - Display pricing plans (Section 5.2)
 *
 * Plans:
 * - Basic (FREE): Pillars, Element analysis, Lucky info
 * - Detail ($2.99): Full career, love, health, wealth, 2026 fortune
 * - Premium ($9.99/mo): All access + monthly updates + compatibility
 */
export function PricingTable() {
  const t = useTranslations("pricing");

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
      polarProductId: "50ad1cfe-da26-41cd-80c7-862258baaa39",
      name: t("detailed.name"),
      price: t("detailed.price"),
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
      polarProductId: "e6efae19-0081-4df3-8c17-2f9fd76fd89c",
      name: t("premium.name"),
      price: t("premium.price"),
      period: t("premium.period"),
      features: [
        t("premium.features.0"),
        t("premium.features.1"),
        t("premium.features.2"),
        t("premium.features.3"),
      ],
      cta: t("premium.cta"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={plan.highlighted ? "border-gold-500 relative" : ""}
          glow={plan.highlighted}
        >
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-500 text-bg-dark text-xs font-bold rounded-full">
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
              <span className="text-4xl font-bold text-gradient-gold">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-text-muted text-sm ml-2">
                  {plan.period}
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
                  className="w-full"
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
          </div>
        </Card>
      ))}
    </div>
  );
}
