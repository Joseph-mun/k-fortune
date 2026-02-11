import { useTranslations } from "next-intl";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { Sparkles, Layers, Sun, ArrowRight, Star, Users, Heart } from "lucide-react";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { MetaphorIcon } from "@/components/icons/MetaphorIcon";
import { ElementIcon } from "@/components/icons/ElementIcon";
import { ServiceHighlight } from "@/components/landing/ServiceHighlight";
import { TiltCard } from "@/components/ui/TiltCard";

export default function LandingPage() {
  const t = useTranslations("landing");
  const tCommon = useTranslations("common");

  return (
    <main className="flex flex-col items-center min-h-screen">
      {/* Hero Section — Full-screen WebGL background */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* WebGL Background */}
        <div className="absolute inset-0 z-0">
          <WebGLShader />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>

        {/* NavBar floating on top */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4">
          <NavBar />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center max-w-3xl px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-white/70 text-xs mb-8 backdrop-blur-sm animate-slide-up">
            <Sparkles className="w-3 h-3 text-purple-400" />
            {tCommon("subtitle")}
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight font-[family-name:var(--font-heading)] leading-[1.05] mb-6 animate-slide-up delay-100">
            <span className="text-white">{t("heroTitle")}</span>
            <br />
            <span className="text-gradient-hero">{t("heroHighlight")}</span>
          </h1>

          {/* Subheading */}
          <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-12 animate-slide-up delay-200">
            {t("heroDescription")}
          </p>

          {/* CTA Button → /start */}
          <Link
            href="/start"
            className="inline-flex items-center gap-3 px-8 py-4 bg-purple-500 text-white rounded-xl font-semibold text-lg hover:bg-purple-400 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 group animate-scale-in delay-300"
          >
            {t("cta")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="w-full border-y border-white/[0.04] py-6 px-4 animate-shimmer">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-text-muted text-sm">
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

      {/* What is Saju */}
      <section className="w-full max-w-5xl px-4 sm:px-8 py-20">
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

      {/* What You'll Discover — Service Highlights */}
      <section className="w-full max-w-5xl px-4 sm:px-8 py-20">
        <div className="text-center mb-10 animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-3">
            {t("discoverTitle")}
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            {t("discoverDescription")}
          </p>
        </div>
        <ServiceHighlight
          services={[
            {
              icon: <ElementIcon element="fire" size={20} />,
              title: t("services.sajuTitle"),
              description: t("services.sajuDesc"),
              href: "/start",
              color: "#8B5CF6",
            },
            {
              icon: <Star className="w-5 h-5 text-pink-400" />,
              title: t("services.starTitle"),
              description: t("services.starDesc"),
              href: "/star-match",
              color: "#EC4899",
              badge: "Popular",
            },
            {
              icon: <Heart className="w-5 h-5 text-rose-400" />,
              title: t("services.compatTitle"),
              description: t("services.compatDesc"),
              href: "/compatibility",
              color: "#F43F5E",
            },
            {
              icon: <Layers className="w-5 h-5 text-gold-500" />,
              title: t("services.galleryTitle"),
              description: t("services.galleryDesc"),
              href: "/gallery",
              color: "#F59E0B",
            },
          ]}
        />
      </section>

      {/* Card Preview Section */}
      <section className="w-full bg-white/[0.01] border-y border-white/[0.04] py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-3 animate-slide-up">
            {t("cardSectionTitle")}
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-10 animate-slide-up delay-100">
            {t("cardSectionDesc")}
          </p>

          <div className="perspective-1000 mb-10">
            <div className="flex justify-center items-end gap-4 md:gap-6">
              <TiltCard className="w-28 md:w-36 aspect-[2/3] rounded-lg glass-premium p-3 flex flex-col items-center justify-center text-center opacity-80 hover:opacity-100 transition-all duration-500 animate-slide-up delay-100" tiltMax={8} style={{ transform: "rotate(-6deg)" }}>
                <MetaphorIcon metaphor="great-tree" size={48} className="mb-2" />
                <span className="text-[10px] md:text-xs text-gold-400 font-semibold font-[family-name:var(--font-heading)]">THE GREAT TREE</span>
                <span className="text-[8px] md:text-[10px] text-text-muted mt-0.5">Yang Wood</span>
              </TiltCard>
              <TiltCard className="w-32 md:w-40 aspect-[2/3] rounded-lg glass-premium p-3 flex flex-col items-center justify-center text-center z-10 ring-glow-purple transition-all duration-500 animate-slide-up delay-200" tiltMax={8}>
                <MetaphorIcon metaphor="sun" size={56} className="mb-2" />
                <span className="text-xs md:text-sm text-gold-400 font-semibold font-[family-name:var(--font-heading)]">THE SUN</span>
                <span className="text-[9px] md:text-xs text-text-muted mt-0.5">Yang Fire</span>
                <div className="flex gap-0.5 mt-2">
                  {(["wood", "fire", "earth", "metal", "water"] as const).map((el) => (
                    <ElementIcon key={el} element={el} size={12} />
                  ))}
                </div>
              </TiltCard>
              <TiltCard className="w-28 md:w-36 aspect-[2/3] rounded-lg glass-premium p-3 flex flex-col items-center justify-center text-center opacity-80 hover:opacity-100 transition-all duration-500 animate-slide-up delay-300" tiltMax={8} style={{ transform: "rotate(6deg)" }}>
                <MetaphorIcon metaphor="ocean" size={48} className="mb-2" />
                <span className="text-[10px] md:text-xs text-gold-400 font-semibold font-[family-name:var(--font-heading)]">THE OCEAN</span>
                <span className="text-[8px] md:text-[10px] text-text-muted mt-0.5">Yang Water</span>
              </TiltCard>
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
      <section className="relative w-full max-w-4xl px-4 sm:px-8 py-20 text-center overflow-hidden">
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
            href="/start"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-400 hover:shadow-lg hover:shadow-purple-500/[0.2] transition-all duration-300 hover:-translate-y-0.5 group animate-slide-up delay-200"
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>

      {/* Mobile fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden pb-safe">
        <div className="px-4 py-3 bg-bg-dark/90 backdrop-blur-lg border-t border-white/[0.06]">
          <Link
            href="/start"
            className="flex items-center justify-center gap-2 w-full py-3 bg-purple-500 text-white rounded-lg font-semibold text-sm hover:bg-purple-400 transition-colors"
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
