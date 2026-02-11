"use client";

import type { BasicReading } from "@/lib/saju/types";
import { useTranslations } from "next-intl";

interface DayMasterHeroProps {
  dayMaster: BasicReading["dayMaster"];
}

export function DayMasterHero({ dayMaster }: DayMasterHeroProps) {
  const t = useTranslations("reading");
  const tElements = useTranslations("elements");

  const elementLabel = `${tElements(dayMaster.yinYang)} ${tElements(dayMaster.element)}`;

  return (
    <div className="flex flex-col items-center text-center pt-6 pb-4">
      {/* Large metaphor icon with glow ring */}
      <div className="w-24 h-24 rounded-full bg-purple-500/[0.06] border border-purple-500/[0.15] flex items-center justify-center mb-5 animate-float ring-glow-purple">
        <span className="text-5xl">{dayMaster.metaphorInfo.icon}</span>
      </div>

      {/* "You are" label */}
      <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] mb-2">{t("youAre")}</p>

      {/* Metaphor name */}
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-1.5">
        {dayMaster.metaphorInfo.displayName}
      </h1>

      {/* Element tag */}
      <span className="inline-flex px-2.5 py-0.5 rounded-full bg-purple-500/[0.06] border border-purple-500/[0.15] text-purple-400 text-[10px] tracking-wider mb-5">
        {elementLabel}
      </span>

      {/* Personality description */}
      <p className="text-text-secondary text-sm md:text-base max-w-lg leading-relaxed mb-5">
        {dayMaster.personality}
      </p>

      {/* Keywords — stagger entrance */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {dayMaster.strengths.map((strength, i) => (
          <span
            key={strength}
            className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-text-secondary text-xs animate-slide-up"
            style={{ animationDelay: `${200 + i * 100}ms` }}
          >
            {strength}
          </span>
        ))}
      </div>
    </div>
  );
}
