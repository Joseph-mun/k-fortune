import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { Sparkles, Layers, Sun, ArrowRight, Star, Users, Heart } from "lucide-react";
import { WebGLShaderLazy as WebGLShader } from "@/components/ui/WebGLShaderLazy";
import { ElementIcon } from "@/components/icons/ElementIcon";
import { ServiceHighlight } from "@/components/landing/ServiceHighlight";
import { CardPreview } from "@/components/landing/CardPreview";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const tCommon = await getTranslations("common");

  return (
    <main className="flex flex-col items-center min-h-screen" id="main-content" aria-label="Main content">
      {/* Hero Section — Full-screen WebGL background */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* WebGL Background */}
        <div className="absolute inset-0 z-0">
          <WebGLShader />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#F0EEE9]/90" />
        </div>

        {/* NavBar floating on top */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 bg-white/70 backdrop-blur-md border-b border-[#1A1611]/[0.06]">
          <NavBar />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center max-w-3xl px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs mb-8 backdrop-blur-sm animate-slide-up">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A80]" />
            {tCommon("subtitle")}
          </div>

          {/* Headline */}
          <h1 className="typo-display mb-6 animate-slide-up delay-100">
            <span className="text-white/90">{t("heroTitle")}</span>
            <br />
            <span className="text-gradient-hero">{t("heroHighlight")}</span>
          </h1>

          {/* Subheading */}
          <p className="typo-body-lg text-white/60 max-w-xl mb-12 animate-slide-up delay-200">
            {t("heroDescription")}
          </p>

          {/* CTA Button → /start */}
          <Link
            href="/start"
            className="inline-flex items-center gap-3 px-8 py-4 btn-cta text-white rounded-xl font-semibold text-lg animate-cta-pulse group"
          >
            {t("cta")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-white/50 mt-4 animate-fade-in delay-400">
            {t("ctaSubtext")}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/25 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="w-full border-y border-[#1A1611]/[0.06] bg-[#F5F0E8]/60 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{t("trustBadge", { count: "10,000" })}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#1A1611]/[0.08]" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
            ))}
            <span className="ml-1.5 text-gold-400 font-semibold">4.9/5</span>
          </div>
        </div>
      </section>

      {/* What is Saju */}
      <section className="w-full max-w-5xl px-4 sm:px-8 py-20">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="typo-h2 text-text-primary mb-3">
            {t("whatIsTitle")}
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            {t("whatIsDescription")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="animate-slide-up delay-100">
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-purple-400" />}
              title={t("features.fourPillars")}
              description={t("features.fourPillarsDesc")}
              accentColor="#8B5CF6"
            />
          </div>
          <div className="animate-slide-up delay-200">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-gold-500" />}
              title={t("features.elements")}
              description={t("features.elementsDesc")}
              accentColor="#F59E0B"
            />
          </div>
          <div className="animate-slide-up delay-300">
            <FeatureCard
              icon={<Sun className="w-6 h-6 text-indigo-400" />}
              title={t("features.dayMaster")}
              description={t("features.dayMasterDesc")}
              accentColor="#6366F1"
            />
          </div>
        </div>
      </section>

      {/* What You'll Discover — Service Highlights */}
      <section className="w-full max-w-5xl px-4 sm:px-8 py-20">
        <div className="text-center mb-10 animate-slide-up">
          <h2 className="typo-h2 text-text-primary mb-3">
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
      <section className="w-full bg-[#F5F0E8]/40 border-y border-[#1A1611]/[0.04] py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="typo-h2 text-text-primary mb-3 animate-slide-up">
            {t("cardSectionTitle")}
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-10 animate-slide-up delay-100">
            {t("cardSectionDesc")}
          </p>

          <CardPreview />

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-[#C5372E] hover:text-[#D4584F] transition-colors group"
          >
            {t("viewGallery")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="relative w-full max-w-4xl px-4 sm:px-8 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-purple-500/[0.08] rounded-full" style={{ width: "var(--size-glow-lg)", height: "300px", filter: "blur(var(--size-blur-lg))" }} />
        </div>
        <div className="relative z-10">
          <h2 className="typo-h1 text-text-primary mb-4 animate-slide-up">
            {t("ctaTitle")}
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto animate-slide-up delay-100">
            {t("ctaDescription")}
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-3 px-8 py-4 btn-cta text-white rounded-xl font-semibold text-lg animate-cta-pulse group"
          >
            {t("cta")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>

      {/* Mobile fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden pb-safe">
        <div className="px-4 py-3 bg-[#F0EEE9]/95 backdrop-blur-lg border-t border-[#1A1611]/[0.06]">
          <Link
            href="/start"
            className="flex items-center justify-center gap-2 w-full py-3 btn-cta text-white rounded-lg font-semibold text-sm"
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Onboarding for first-time visitors */}
      <OnboardingOverlay />
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
}) {
  return (
    <div className="flex flex-col p-6 rounded-xl glass-interactive cursor-default group">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors"
        style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
