"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Share2, Sparkles, ArrowRight, Compass, Palette, Hash } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { SkeletonReading } from "@/components/fortune/SkeletonReading";
import { ReadingSummary } from "@/components/fortune/ReadingSummary";
import { DayMasterHero } from "@/components/fortune/DayMasterHero";
import { FourPillarsDisplay } from "@/components/fortune/FourPillarsDisplay";
import { ElementChart } from "@/components/fortune/ElementChart";
import { PaywallOverlay } from "@/components/fortune/PaywallOverlay";
import { Card } from "@/components/ui/Card";
import { GraphCard } from "@/components/ui/GraphCard";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { TiltCard } from "@/components/ui/TiltCard";
import { ElementThemeProvider } from "@/contexts/ElementThemeContext";
import { ElementPentagonChart } from "@/components/fortune/ElementPentagonChart";
import { ElementIcon } from "@/components/icons/ElementIcon";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { reconstructReading } from "@/lib/saju";
import { useReadingStore } from "@/stores/useReadingStore";
import { POLAR_PRODUCTS } from "@/lib/polar";

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("reading");
  const tCommon = useTranslations("common");
  const storedReading = useReadingStore((s) => s.getReading(id));

  if (!storedReading) {
    return (
      <main className="flex flex-col items-center min-h-screen">
        <div className="w-full px-4">
          <NavBar />
        </div>
        <SkeletonReading />
      </main>
    );
  }

  const reading = reconstructReading(storedReading);

  const paywallReveal = useIntersectionReveal();

  const handleShare = async () => {
    const text = t("shareText", { metaphor: reading.dayMaster.metaphorInfo.displayName });
    try {
      if (navigator.share) {
        await navigator.share({ text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      }
    } catch {
      // User cancelled share dialog or clipboard access denied
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full px-4">
        <NavBar />
      </div>

      {/* Multi-layer background glow */}
      <div className="relative w-full">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none animate-pulse-glow"
          style={{ background: "var(--accent-glow)" }}
        />
        <div
          className="absolute top-40 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "var(--accent-bg-tint)" }}
        />
      </div>

      <ElementThemeProvider element={reading.dayMaster.element}>
        <div className="relative w-full max-w-3xl px-4 sm:px-8 flex flex-col items-center gap-6 py-8">
          {/* Quick Summary — instantly visible */}
          <ReadingSummary
            dayMaster={reading.dayMaster}
            elementAnalysis={reading.elementAnalysis}
            luckyInfo={storedReading.luckyInfo}
          />

          {/* Accordion: Your Cosmic Identity */}
          <Accordion
            title={t("sectionIdentity")}
            icon={<Sparkles className="w-3.5 h-3.5 text-purple-400" />}
            defaultOpen
          >
            <TiltCard className="rounded-lg">
              <DayMasterHero dayMaster={reading.dayMaster} />
            </TiltCard>
          </Accordion>

          {/* Accordion: Four Pillars of Destiny */}
          <Accordion
            title={t("sectionPillars")}
            icon={<Sparkles className="w-3.5 h-3.5 text-purple-400" />}
          >
            <Card className="w-full glass">
              <FourPillarsDisplay fourPillars={reading.fourPillars} />
            </Card>
          </Accordion>

          {/* Accordion: Element Balance */}
          <Accordion
            title={t("sectionElements")}
            icon={<ElementIcon element={reading.dayMaster.element} size={14} />}
          >
            <GraphCard
              title={t("sectionElements")}
              icon={<ElementIcon element={reading.dayMaster.element} size={14} />}
              legend={[
                { label: "Wood", color: "#22C55E" },
                { label: "Fire", color: "#F43F5E" },
                { label: "Earth", color: "#F59E0B" },
                { label: "Metal", color: "#E4E4E7" },
                { label: "Water", color: "#6366F1" },
              ]}
            >
              <ElementPentagonChart analysis={reading.elementAnalysis} />
              <div className="mt-6">
                <ElementChart analysis={reading.elementAnalysis} />
              </div>
            </GraphCard>
          </Accordion>

          {/* Accordion: Lucky Info */}
          <Accordion
            title={t("sectionLucky")}
            icon={<span className="text-xs">✦</span>}
            defaultOpen
          >
            <div className="grid grid-cols-3 gap-3">
              <Card className="text-center py-5 glass hover:-translate-y-1 transition-all duration-300 cursor-default">
                <Palette className="w-4 h-4 text-purple-400 mx-auto mb-2" />
                <p className="typo-overline mb-1">{t("lucky.color")}</p>
                <p className="text-base font-semibold text-text-primary">{storedReading.luckyInfo.color}</p>
              </Card>
              <Card className="text-center py-5 glass hover:-translate-y-1 transition-all duration-300 cursor-default">
                <Hash className="w-4 h-4 text-gold-500 mx-auto mb-2" />
                <p className="typo-overline mb-1">{t("lucky.number")}</p>
                <p className="text-base font-semibold text-text-primary font-[family-name:var(--font-mono)]">
                  {storedReading.luckyInfo.number}
                </p>
              </Card>
              <Card className="text-center py-5 glass hover:-translate-y-1 transition-all duration-300 cursor-default">
                <Compass className="w-4 h-4 text-purple-400 mx-auto mb-2" />
                <p className="typo-overline mb-1">{t("lucky.direction")}</p>
                <p className="text-base font-semibold text-text-primary">{storedReading.luckyInfo.direction}</p>
              </Card>
            </div>
          </Accordion>

          {/* Gradient divider */}
          <div className="divider-gradient w-full" />

          {/* Section: Unlock Full Reading */}
          <div
            ref={paywallReveal.ref}
            className={`transition-all duration-700 ease-out ${
              paywallReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <PaywallOverlay readingId={id} productId={POLAR_PRODUCTS.DETAILED_READING} />
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-3">
              <Button variant="secondary" className="gap-2 hover:-translate-y-0.5 transition-all duration-300" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                {t("share")}
              </Button>
              <Link href="/cards/create">
                <Button variant="ghost" className="gap-2 group">
                  {t("createCard")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <p className="text-[10px] text-text-muted text-center max-w-xs">
              {tCommon("disclaimer")}
            </p>
          </div>
        </div>
      </ElementThemeProvider>

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>
    </main>
  );
}
