"use client";

import type { BasicReading } from "@/lib/saju/types";
import { useTranslations } from "next-intl";

interface DayMasterHeroProps {
  dayMaster: BasicReading["dayMaster"];
}

export function DayMasterHero({ dayMaster }: DayMasterHeroProps) {
  const t = useTranslations("reading");

  return (
    <div className="flex flex-col items-center text-center py-8">
      {/* Large metaphor icon */}
      <span className="text-7xl animate-float mb-4">
        {dayMaster.metaphorInfo.icon}
      </span>

      {/* "You are The Sun" */}
      <p className="text-text-secondary text-sm mb-1">{t("youAre")}</p>
      <h1 className="text-4xl md:text-5xl font-bold text-gradient-purple font-[family-name:var(--font-heading)] mb-3">
        {dayMaster.metaphorInfo.displayName}
      </h1>

      {/* Personality description */}
      <p className="text-text-secondary text-base md:text-lg max-w-lg leading-relaxed">
        {dayMaster.personality}
      </p>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {dayMaster.strengths.map((strength) => (
          <span
            key={strength}
            className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm"
          >
            {strength}
          </span>
        ))}
      </div>
    </div>
  );
}
