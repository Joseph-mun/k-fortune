"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Share2, Sparkles, ArrowRight, Compass, Palette, Hash, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { SkeletonReading } from "@/components/fortune/SkeletonReading";
import { ReadingSummary } from "@/components/fortune/ReadingSummary";
import { FourPillarsDisplay } from "@/components/fortune/FourPillarsDisplay";
import { ElementChart } from "@/components/fortune/ElementChart";
import { PaywallOverlay } from "@/components/fortune/PaywallOverlay";
import { Card } from "@/components/ui/Card";
import { GraphCard } from "@/components/ui/GraphCard";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { ElementThemeProvider } from "@/contexts/ElementThemeContext";
import { ElementPentagonChart } from "@/components/fortune/ElementPentagonChart";
import { ElementIcon } from "@/components/icons/ElementIcon";
import { MetaphorIcon } from "@/components/icons/MetaphorIcon";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { reconstructReading } from "@/lib/saju";
import { useReadingStore } from "@/stores/useReadingStore";
import { POLAR_PRODUCTS, PRICE_DISPLAY } from "@/lib/polar";

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("reading");
  const tCommon = useTranslations("common");
  const tInterp = useTranslations("interpretation");
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

  const resolveKey = (key: string) => {
    const prefix = "interpretation.";
    return key.startsWith(prefix) ? tInterp(key.slice(prefix.length)) : key;
  };

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
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full pointer-events-none animate-pulse-glow"
          style={{
            width: "var(--size-glow-lg)",
            height: "var(--size-glow-lg)",
            background: "var(--accent-glow)",
            filter: "blur(var(--size-blur-md))"
          }}
        />
        <div
          className="absolute top-40 right-1/4 rounded-full pointer-events-none"
          style={{
            width: "var(--size-glow-sm)",
            height: "var(--size-glow-sm)",
            background: "var(--accent-bg-tint)",
            filter: "blur(var(--size-blur-sm))"
          }}
        />
      </div>

      <ElementThemeProvider element={reading.dayMaster.element}>
        <div className="relative w-full max-w-3xl px-4 sm:px-8 flex flex-col items-center gap-6 py-8">
          {/* Quick Summary — merged hero (no more duplicate identity section) */}
          <ReadingSummary
            dayMaster={reading.dayMaster}
            elementAnalysis={reading.elementAnalysis}
            luckyInfo={storedReading.luckyInfo}
          />

          {/* Accordion: Four Pillars of Destiny */}
          <Accordion
            title={t("sectionPillars")}
            icon={<Sparkles className="w-3.5 h-3.5 text-purple-400" />}
            defaultOpen
          >
            <Card className="w-full glass">
              <FourPillarsDisplay fourPillars={reading.fourPillars} />
            </Card>
          </Accordion>

          {/* Accordion: Day Pillar Interpretation (free detailed section) */}
          <Accordion
            title={t("sectionDayPillar")}
            icon={<Star className="w-3.5 h-3.5 text-purple-400" />}
            defaultOpen
          >
            <Card className="w-full glass">
              <div className="flex flex-col items-center text-center p-2">
                {/* Day pillar metaphor icon */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 accent-glow" style={{ background: "var(--accent-bg-tint)", border: "1px solid var(--accent-glow)" }}>
                  <MetaphorIcon metaphor={reading.dayMaster.metaphorInfo.id} size={40} />
                </div>

                <h3 className="text-lg font-bold text-text-primary mb-1 font-[family-name:var(--font-heading)]">
                  {t("dayPillarTitle", { metaphor: reading.dayMaster.metaphorInfo.displayName })}
                </h3>

                <p className="text-sm text-text-secondary max-w-md mb-5 leading-relaxed">
                  {resolveKey(reading.dayMaster.personality)}
                </p>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-3">{t("strengths")}</p>
                    <ul className="space-y-2">
                      {reading.dayMaster.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                          <span className="mt-0.5" style={{ color: "var(--accent-primary, #a855f7)" }}>+</span>
                          {resolveKey(strength)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-3">{t("weaknesses")}</p>
                    <ul className="space-y-2">
                      {reading.dayMaster.weaknesses.map((weakness, i) => (
                        <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                          <span className="text-text-muted mt-0.5">-</span>
                          {resolveKey(weakness)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </Accordion>

          {/* Accordion: Element Balance */}
          <Accordion
            title={t("sectionElements")}
            icon={<ElementIcon element={reading.dayMaster.element} size={14} />}
          >
            <GraphCard
              className="w-full"
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
            className={`w-full transition-all duration-700 ease-out ${
              paywallReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <PaywallOverlay
              readingId={id}
              productId={POLAR_PRODUCTS.DETAILED_READING}
              price={PRICE_DISPLAY.DETAILED_READING}
              dayMasterName={reading.dayMaster.metaphorInfo.displayName}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4 w-full mt-4">
            <div className="flex flex-wrap justify-center gap-3">
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