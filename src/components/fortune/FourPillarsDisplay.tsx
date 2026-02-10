"use client";

import type { FourPillars } from "@/lib/saju/types";
import { FortunePillarCard } from "./FortunePillarCard";
import { useTranslations } from "next-intl";

interface FourPillarsDisplayProps {
  fourPillars: FourPillars;
}

export function FourPillarsDisplay({ fourPillars }: FourPillarsDisplayProps) {
  const t = useTranslations("reading");

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-text-primary mb-4 font-[family-name:var(--font-heading)]">
        {t("fourPillars")}
      </h2>
      <div className="grid grid-cols-4 gap-3">
        <FortunePillarCard pillar={fourPillars.year} label={t("year")} />
        <FortunePillarCard pillar={fourPillars.month} label={t("month")} />
        <FortunePillarCard pillar={fourPillars.day} label={t("day")} isHighlighted />
        <FortunePillarCard pillar={fourPillars.hour} label={t("hour")} />
      </div>
    </div>
  );
}
