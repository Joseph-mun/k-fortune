"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Share2, Sparkles, ArrowRight, Compass, Palette, Hash } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { DayMasterHero } from "@/components/fortune/DayMasterHero";
import { FourPillarsDisplay } from "@/components/fortune/FourPillarsDisplay";
import { ElementChart } from "@/components/fortune/ElementChart";
import { PaywallOverlay } from "@/components/fortune/PaywallOverlay";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { reconstructReading } from "@/lib/saju";
import { useReadingStore } from "@/stores/useReadingStore";

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("reading");
  const tCommon = useTranslations("common");
  const storedReading = useReadingStore((s) => s.getReading(id));

  if (!storedReading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500/[0.3] border-t-purple-500 rounded-full animate-spin" />
          <p className="text-text-muted text-sm">{tCommon("loading")}</p>
        </div>
      </main>
    );
  }

  const reading = reconstructReading(storedReading);

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/[0.07] rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-indigo-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="relative w-full max-w-2xl px-4 flex flex-col items-center gap-10 py-8">
        {/* Section 1: Your Cosmic Identity */}
        <div className="animate-scale-in">
          <DayMasterHero dayMaster={reading.dayMaster} />
        </div>

        {/* Gradient divider */}
        <div className="divider-gradient w-full" />

        {/* Storytelling bridge */}
        <div className="w-full text-center animate-slide-up">
          <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
            {t("storyBridge")}
          </p>
        </div>

        {/* Section 2: Four Pillars */}
        <section className="w-full animate-slide-up delay-100">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-purple-500/[0.08] border border-purple-500/[0.1] flex items-center justify-center ring-glow-purple">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-sm font-semibold text-text-primary">{t("fourPillars")}</h2>
          </div>
          <Card className="w-full glass">
            <FourPillarsDisplay fourPillars={reading.fourPillars} />
          </Card>
        </section>

        {/* Gradient divider */}
        <div className="divider-gradient w-full" />

        {/* Section 3: Element Balance */}
        <section className="w-full animate-slide-up delay-200">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-purple-500/[0.08] border border-purple-500/[0.1] flex items-center justify-center ring-glow-purple">
              <span className="text-base">☯</span>
            </div>
            <h2 className="text-sm font-semibold text-text-primary">{t("elementBalance")}</h2>
          </div>
          <Card className="w-full glass">
            <ElementChart analysis={reading.elementAnalysis} />
          </Card>
        </section>

        {/* Gradient divider */}
        <div className="divider-gradient w-full" />

        {/* Section 4: Lucky Info */}
        <section className="w-full animate-slide-up delay-300">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gold-500/[0.08] border border-gold-500/[0.1] flex items-center justify-center" style={{ boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 0 20px rgba(245,158,11,0.08)" }}>
              <span className="text-base">✦</span>
            </div>
            <h2 className="text-sm font-semibold text-text-primary">{t("lucky.title")}</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center py-5 glass hover:-translate-y-1 transition-all duration-300 cursor-default">
              <Palette className="w-4 h-4 text-purple-400 mx-auto mb-2" />
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">{t("lucky.color")}</p>
              <p className="text-base font-semibold text-text-primary">{storedReading.luckyInfo.color}</p>
            </Card>
            <Card className="text-center py-5 glass hover:-translate-y-1 transition-all duration-300 cursor-default">
              <Hash className="w-4 h-4 text-gold-500 mx-auto mb-2" />
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">{t("lucky.number")}</p>
              <p className="text-base font-semibold text-text-primary font-[family-name:var(--font-mono)]">
                {storedReading.luckyInfo.number}
              </p>
            </Card>
            <Card className="text-center py-5 glass hover:-translate-y-1 transition-all duration-300 cursor-default">
              <Compass className="w-4 h-4 text-purple-400 mx-auto mb-2" />
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">{t("lucky.direction")}</p>
              <p className="text-base font-semibold text-text-primary">{storedReading.luckyInfo.direction}</p>
            </Card>
          </div>
        </section>

        {/* Gradient divider */}
        <div className="divider-gradient w-full" />

        {/* Section 5: Unlock Full Reading */}
        <div className="animate-slide-up delay-400">
          <PaywallOverlay readingId={id} />
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 w-full animate-slide-up delay-500">
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

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>
    </main>
  );
}
