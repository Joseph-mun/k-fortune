"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Share2 } from "lucide-react";

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
        <p className="text-text-secondary">{tCommon("loading")}</p>
      </main>
    );
  }

  // Reconstruct pillar data for components that expect the internal type
  const reading = reconstructReading(storedReading);

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <NavBar />

      <div className="w-full max-w-2xl flex flex-col items-center gap-8 py-8">
        {/* Day Master Hero */}
        <DayMasterHero dayMaster={reading.dayMaster} />

        {/* Four Pillars */}
        <Card className="w-full">
          <FourPillarsDisplay fourPillars={reading.fourPillars} />
        </Card>

        {/* Element Balance */}
        <Card className="w-full">
          <ElementChart analysis={reading.elementAnalysis} />
        </Card>

        {/* Lucky Info */}
        <Card className="w-full">
          <h2 className="text-lg font-bold text-text-primary mb-4">{t("lucky.title")}</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-text-muted text-xs">{t("lucky.color")}</p>
              <p className="text-lg font-semibold text-text-primary">{storedReading.luckyInfo.color}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">{t("lucky.number")}</p>
              <p className="text-lg font-semibold text-text-primary font-[family-name:var(--font-mono)]">
                {storedReading.luckyInfo.number}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs">{t("lucky.direction")}</p>
              <p className="text-lg font-semibold text-text-primary">{storedReading.luckyInfo.direction}</p>
            </div>
          </div>
        </Card>

        {/* Paywall CTA - connects to Polar checkout */}
        <PaywallOverlay readingId={id} />

        {/* Share */}
        <Button variant="secondary" className="gap-2">
          <Share2 className="w-4 h-4" />
          {t("share")}
        </Button>
      </div>

      <Footer />
    </main>
  );
}
