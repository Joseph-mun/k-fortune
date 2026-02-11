"use client";

import type { BasicReading } from "@/lib/saju/types";
import { ELEMENT_HANJA, YINYANG_HANJA } from "@/lib/saju/constants";
import { useTranslations } from "next-intl";
import { MetaphorIcon } from "@/components/icons/MetaphorIcon";

interface DayMasterHeroProps {
  dayMaster: BasicReading["dayMaster"];
}

export function DayMasterHero({ dayMaster }: DayMasterHeroProps) {
  const t = useTranslations("reading");
  const tElements = useTranslations("elements");
  const tInterp = useTranslations("interpretation");

  const elementLabel = `${tElements(dayMaster.yinYang)} ${tElements(dayMaster.element)}`;

  // Resolve i18n key paths: "interpretation.personality.candle" → tInterp("personality.candle")
  const resolveKey = (key: string) => {
    const prefix = "interpretation.";
    return key.startsWith(prefix) ? tInterp(key.slice(prefix.length)) : key;
  };

  return (
    <div className="flex flex-col items-center text-center pt-6 pb-4">
      {/* Large metaphor icon with glow ring */}
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 animate-float accent-glow" style={{ background: "var(--accent-bg-tint)", border: "1px solid var(--accent-glow)" }}>
        <MetaphorIcon metaphor={dayMaster.metaphorInfo.id} size={64} />
      </div>

      {/* "You are" label */}
      <p className="typo-overline mb-2">{t("youAre")}</p>

      {/* Metaphor name */}
      <h1 className="typo-h1 text-text-primary mb-1">
        {dayMaster.metaphorInfo.displayName}
      </h1>

      {/* Hanja + Romanization */}
      <p className="text-sm text-text-secondary mb-1.5">
        {dayMaster.metaphorInfo.hanja} · {dayMaster.metaphorInfo.romanization}
      </p>

      {/* Element tag */}
      <span className="inline-flex px-2.5 py-0.5 rounded-full accent-badge typo-overline mb-5">
        {elementLabel} · {YINYANG_HANJA[dayMaster.yinYang]}{ELEMENT_HANJA[dayMaster.element]}
      </span>

      {/* Personality description */}
      <p className="typo-body text-text-secondary max-w-lg mb-5">
        {resolveKey(dayMaster.personality)}
      </p>

      {/* Keywords — stagger entrance */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {dayMaster.strengths.map((strength, i) => (
          <span
            key={strength}
            className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-text-secondary text-xs animate-slide-up"
            style={{ animationDelay: `${200 + i * 100}ms` }}
          >
            {resolveKey(strength)}
          </span>
        ))}
      </div>
    </div>
  );
}
