import { useTranslations } from "next-intl";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { BirthInputForm } from "@/components/forms/BirthInputForm";
import { Sparkles, Layers, Sun } from "lucide-react";

export default function LandingPage() {
  const t = useTranslations("landing");
  const tCommon = useTranslations("common");

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <NavBar />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-12 md:mt-20 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          {tCommon("subtitle")}
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-2">
          {t("heroTitle")}
        </h2>
        <h2 className="text-4xl md:text-6xl font-bold text-gradient-purple font-[family-name:var(--font-heading)] mb-6">
          {t("heroHighlight")}
        </h2>

        <p className="text-text-secondary text-lg max-w-xl mb-10">
          {t("heroDescription")}
        </p>

        <BirthInputForm />
      </section>

      {/* Features */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <FeatureCard
          icon={<Layers className="w-6 h-6 text-purple-400" />}
          title={t("features.fourPillars")}
          description={t("features.fourPillarsDesc")}
        />
        <FeatureCard
          icon={<Sparkles className="w-6 h-6 text-gold-500" />}
          title={t("features.elements")}
          description={t("features.elementsDesc")}
        />
        <FeatureCard
          icon={<Sun className="w-6 h-6 text-purple-400" />}
          title={t("features.dayMaster")}
          description={t("features.dayMasterDesc")}
        />
      </section>

      <Footer />
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-bg-card border border-purple-500/10 hover:border-purple-500/30 transition-all">
      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}
