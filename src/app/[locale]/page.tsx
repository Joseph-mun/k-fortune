import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { Sparkles, Grid2x2, Flame, Compass, ArrowRight, Star, Users, Clock, Sun, Telescope } from "lucide-react";
import { WebGLShaderLazy as WebGLShader } from "@/components/ui/WebGLShaderLazy";
import { ElementIcon } from "@/components/icons/ElementIcon";
import { ServiceHighlight } from "@/components/landing/ServiceHighlight";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { RevealSection } from "@/components/landing/RevealSection";
import { MobileCTA } from "@/components/landing/MobileCTA";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const tCommon = await getTranslations("common");

  return (
    <main className="flex flex-col items-center min-h-screen" id="main-content" aria-label="Main content">
      {/* Hero Section — Full-screen WebGL background */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <WebGLShader />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        </div>

        <div className="absolute top-0 left-0 right-0 z-20 px-4 bg-black/70 backdrop-blur-md border-b border-white/[0.06]">
          <NavBar />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-3xl px-4">
          <div className="relative flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-white/80 text-xs mb-8 backdrop-blur-sm animate-slide-up">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              {tCommon("subtitle")}
            </div>

            <h1 className="typo-display mb-6 animate-slide-up delay-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              <span className="text-white">{t("heroTitle")}</span>
              <br />
              <span className="text-gradient-hero drop-shadow-none">{t("heroHighlight")}</span>
            </h1>

            <p className="typo-body-lg text-white/60 max-w-xl mb-12 animate-slide-up delay-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              {t("heroDescription")}
            </p>

            <Link
              href="/start"
              data-hero-cta
              className="inline-flex items-center gap-3 px-10 py-4 btn-cta text-white rounded-full font-semibold text-lg animate-cta-pulse group"
            >
              {t("cta")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-white/40 mt-4 animate-fade-in delay-400">
              {t("ctaSubtext")}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="w-full border-y border-white/[0.06] bg-white/[0.02] py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{t("trustBadge", { count: "10,000" })}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/[0.1]" />
          <span className="block sm:hidden w-1 h-1 rounded-full bg-white/[0.2]" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
            ))}
            <span className="ml-1.5 text-gold-400 font-semibold">4.9/5</span>
          </div>
        </div>
      </section>

      {/* What is Saju — Asymmetric layout */}
      <RevealSection as="section" className="w-full max-w-5xl px-4 sm:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-16">
          <div className="md:w-2/5 md:sticky md:top-24 text-center md:text-left">
            <h2 className="typo-h2 text-text-primary mb-3">
              {t("whatIsTitle")}
            </h2>
            <p className="text-text-secondary max-w-lg">
              {t("whatIsDescription")}
            </p>
          </div>
          <div className="md:w-3/5 flex flex-col gap-4">
            <FeatureCard
              icon={<Grid2x2 className="w-6 h-6 text-purple-400" />}
              title={t("features.fourPillars")}
              description={t("features.fourPillarsDesc")}
              accentColor="#8B5CF6"
            />
            <FeatureCard
              icon={<Flame className="w-6 h-6 text-gold-500" />}
              title={t("features.elements")}
              description={t("features.elementsDesc")}
              accentColor="#F59E0B"
            />
            <FeatureCard
              icon={<Compass className="w-6 h-6 text-indigo-400" />}
              title={t("features.dayMaster")}
              description={t("features.dayMasterDesc")}
              accentColor="#6366F1"
            />
          </div>
        </div>
      </RevealSection>

      {/* Section divider */}
      <div className="w-full max-w-5xl px-8">
        <div className="divider-gradient" />
      </div>

      {/* What You'll Discover — Past / Present / Future */}
      <RevealSection as="section" className="w-full max-w-5xl px-4 sm:px-8 py-20">
        <div className="text-center mb-10">
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
              icon: <Clock className="w-6 h-6 text-purple-400" />,
              title: t("services.pastTitle"),
              description: t("services.pastDesc"),
              href: "/start",
              color: "#8B5CF6",
            },
            {
              icon: <Sun className="w-6 h-6 text-gold-500" />,
              title: t("services.presentTitle"),
              description: t("services.presentDesc"),
              href: "/start",
              color: "#F59E0B",
              badge: "Popular",
            },
            {
              icon: <Telescope className="w-6 h-6 text-indigo-400" />,
              title: t("services.futureTitle"),
              description: t("services.futureDesc"),
              href: "/start",
              color: "#6366F1",
            },
          ]}
        />
      </RevealSection>

      {/* CTA Bottom */}
      <RevealSection as="section" className="relative w-full max-w-4xl px-4 sm:px-8 py-20 text-center overflow-hidden korean-pattern">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="cta-glow-bg rounded-full" />
        </div>
        <div className="relative z-10">
          <h2 className="typo-h1 text-text-primary mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            {t("ctaDescription")}
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-3 px-10 py-4 btn-cta text-white rounded-full font-semibold text-lg animate-cta-pulse group"
          >
            {t("cta")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </RevealSection>

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>

      <MobileCTA label={t("cta")} />
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
    <div className="flex flex-col flex-grow p-6 rounded-xl glass-interactive cursor-default group">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
          border: `1px solid ${accentColor}30`,
          boxShadow: `0 0 20px ${accentColor}10`,
        }}
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
