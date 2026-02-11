import { useTranslations } from "next-intl";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { BirthInputForm } from "@/components/forms/BirthInputForm";
import { Link } from "@/i18n/navigation";
import { Sparkles, Layers, Sun, ArrowRight, Star, Users } from "lucide-react";

export default function LandingPage() {
  const t = useTranslations("landing");
  const tCommon = useTranslations("common");

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full px-4">
        <NavBar />
      </div>

      {/* Hero Section — cinematic, layered depth */}
      <section className="relative w-full flex flex-col items-center text-center px-4 pt-16 md:pt-28 pb-20 overflow-hidden">
        {/* Multi-layer animated background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none animate-gradient-shift" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)" }} />
        <div className="absolute top-32 right-1/4 w-[400px] h-[400px] bg-indigo-500/[0.04] rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-purple-600/[0.03] rounded-full blur-[80px] pointer-events-none" />

        {/* Floating oriental symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <span className="absolute top-20 left-[15%] text-2xl text-white/[0.03] animate-float">☰</span>
          <span className="absolute top-40 right-[18%] text-xl text-white/[0.03] animate-float delay-200">☵</span>
          <span className="absolute top-60 left-[25%] text-lg text-white/[0.02] animate-float delay-400">☲</span>
          <span className="absolute bottom-32 right-[28%] text-2xl text-white/[0.03] animate-float delay-300">☷</span>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-3xl">
          {/* Badge with shimmer */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-text-muted text-xs mb-8 animate-slide-up animate-shimmer">
            <Sparkles className="w-3 h-3 text-purple-400" />
            {tCommon("subtitle")}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-[family-name:var(--font-heading)] leading-[1.1] mb-6 animate-slide-up delay-100">
            <span className="text-text-primary">{t("heroTitle")}</span>
            <br />
            <span className="text-gradient-hero">{t("heroHighlight")}</span>
          </h1>

          {/* Subheading */}
          <p className="text-text-secondary text-base md:text-lg max-w-xl leading-relaxed mb-12 animate-slide-up delay-200">
            {t("heroDescription")}
          </p>

          {/* Form — glass card with glow */}
          <div className="w-full max-w-md glass rounded-xl p-6 ring-glow-purple animate-scale-in delay-300">
            <BirthInputForm />
          </div>
        </div>
      </section>

      {/* Social Proof Strip — shimmer bg */}
      <section className="w-full border-y border-white/[0.04] py-6 px-4 animate-shimmer">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{t("trustBadge", { count: "10,000" })}</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
            ))}
            <span className="ml-1.5">4.9/5</span>
          </div>
        </div>
      </section>

      {/* What is K-Fortune — Education for foreigners */}
      <section className="w-full max-w-4xl px-4 py-20">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-3">
            {t("whatIsTitle")}
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            {t("whatIsDescription")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="animate-slide-up delay-100">
            <FeatureCard
              icon={<Layers className="w-5 h-5 text-purple-400" />}
              title={t("features.fourPillars")}
              description={t("features.fourPillarsDesc")}
            />
          </div>
          <div className="animate-slide-up delay-200">
            <FeatureCard
              icon={<Sparkles className="w-5 h-5 text-gold-500" />}
              title={t("features.elements")}
              description={t("features.elementsDesc")}
            />
          </div>
          <div className="animate-slide-up delay-300">
            <FeatureCard
              icon={<Sun className="w-5 h-5 text-purple-400" />}
              title={t("features.dayMaster")}
              description={t("features.dayMasterDesc")}
            />
          </div>
        </div>
      </section>

      {/* Card Preview Section */}
      <section className="w-full bg-white/[0.01] border-y border-white/[0.04] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-3 animate-slide-up">
            {t("cardSectionTitle")}
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-10 animate-slide-up delay-100">
            {t("cardSectionDesc")}
          </p>

          {/* Sample card showcase — 3D perspective floating cards */}
          <div className="perspective-1000 mb-10">
            <div className="flex justify-center items-end gap-4 md:gap-6">
              <div className="w-28 md:w-36 aspect-[2/3] rounded-lg bg-gradient-to-b from-[#1A1A2E] to-[#0A0A1A] border border-purple-500/[0.2] p-3 flex flex-col items-center justify-center text-center opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-110 hover:-translate-y-2 animate-slide-up delay-100 card-shine" style={{ transform: "rotateY(8deg) rotateX(2deg) rotate(-6deg)" }}>
                <span className="text-3xl md:text-4xl mb-2">🌳</span>
                <span className="text-[10px] md:text-xs text-gold-400 font-semibold font-[family-name:var(--font-heading)]">THE GREAT TREE</span>
                <span className="text-[8px] md:text-[10px] text-text-muted mt-0.5">Yang Wood</span>
              </div>
              <div className="w-32 md:w-40 aspect-[2/3] rounded-lg bg-gradient-to-b from-[#1A1A2E] to-[#0A0A1A] border border-purple-500/[0.3] p-3 flex flex-col items-center justify-center text-center z-10 ring-glow-purple hover:scale-110 hover:-translate-y-3 transition-all duration-500 animate-slide-up delay-200 card-shine">
                <span className="text-4xl md:text-5xl mb-2">☀️</span>
                <span className="text-xs md:text-sm text-gold-400 font-semibold font-[family-name:var(--font-heading)]">THE SUN</span>
                <span className="text-[9px] md:text-xs text-text-muted mt-0.5">Yang Fire</span>
                <div className="flex gap-0.5 mt-2">
                  {["#22C55E", "#F43F5E", "#F59E0B", "#E4E4E7", "#6366F1"].map((c) => (
                    <div key={c} className="w-1.5 h-4 rounded-full" style={{ backgroundColor: c, opacity: 0.7 }} />
                  ))}
                </div>
              </div>
              <div className="w-28 md:w-36 aspect-[2/3] rounded-lg bg-gradient-to-b from-[#1A1A2E] to-[#0A0A1A] border border-purple-500/[0.2] p-3 flex flex-col items-center justify-center text-center opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-110 hover:-translate-y-2 animate-slide-up delay-300 card-shine" style={{ transform: "rotateY(-8deg) rotateX(2deg) rotate(6deg)" }}>
                <span className="text-3xl md:text-4xl mb-2">🌊</span>
                <span className="text-[10px] md:text-xs text-gold-400 font-semibold font-[family-name:var(--font-heading)]">THE OCEAN</span>
                <span className="text-[8px] md:text-[10px] text-text-muted mt-0.5">Yang Water</span>
              </div>
            </div>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group"
          >
            {t("viewGallery")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="relative w-full max-w-3xl px-4 py-20 text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[200px] bg-purple-500/[0.05] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-4 animate-slide-up">
            {t("ctaTitle")}
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto animate-slide-up delay-100">
            {t("ctaDescription")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-400 hover:shadow-lg hover:shadow-purple-500/[0.2] transition-all duration-300 hover:-translate-y-0.5 group animate-slide-up delay-200"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>
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
    <div className="flex flex-col p-5 rounded-lg glass hover:border-white/[0.1] transition-all duration-300 group hover:-translate-y-1 hover:ring-glow-purple cursor-default">
      <div className="w-9 h-9 rounded-lg bg-purple-500/[0.06] border border-purple-500/[0.1] flex items-center justify-center mb-3 group-hover:bg-purple-500/[0.1] transition-colors">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1.5">{title}</h3>
      <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
