import { useTranslations } from "next-intl";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/payment/PricingTable";
import { Sparkles } from "lucide-react";

/**
 * Pricing page (/[locale]/pricing)
 * Section 5.2 - Display pricing plans for Basic (FREE), Detail ($2.99), Premium ($9.99/mo)
 */
export default function PricingPage() {
  const t = useTranslations("pricing");

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <NavBar />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-12 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          {t("badge")}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-4">
          {t("title")}
        </h1>

        <p className="text-text-secondary text-lg max-w-2xl mb-12">
          {t("subtitle")}
        </p>

        <PricingTable />
      </section>

      <Footer />
    </main>
  );
}
