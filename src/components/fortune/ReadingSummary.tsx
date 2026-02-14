"use client";

import type { BasicReading, ElementAnalysis, LuckyInfo } from "@/lib/saju/types";
import { useTranslations } from "next-intl";
import { MetaphorIcon } from "@/components/icons/MetaphorIcon";
import { ElementIcon } from "@/components/icons/ElementIcon";
import { ChevronDown } from "lucide-react";
import { ELEMENT_HANJA, YINYANG_HANJA } from "@/lib/saju/constants";
import type { Element } from "@/lib/saju/types";

interface ReadingSummaryProps {
  dayMaster: BasicReading["dayMaster"];
  elementAnalysis: ElementAnalysis;
  luckyInfo: LuckyInfo;
}

export function ReadingSummary({ dayMaster, elementAnalysis }: ReadingSummaryProps) {
  const t = useTranslations("reading");
  const tElements = useTranslations("elements");
  const tInterp = useTranslations("interpretation");

  const elementLabel = `${tElements(dayMaster.yinYang)} ${tElements(dayMaster.element)}`;

  const resolveKey = (key: string) => {
    const prefix = "interpretation.";
    return key.startsWith(prefix) ? tInterp(key.slice(prefix.length)) : key;
  };

  // Get top 3 elements by percentage
  const elements = (["wood", "fire", "earth", "metal", "water"] as Element[])
    .map((el) => ({ element: el, value: elementAnalysis[el] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <div className="w-full glass-premium rounded-lg p-6 flex flex-col items-center text-center">
      {/* Metaphor Icon with glow ring */}
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 animate-float accent-glow" style={{ background: "var(--accent-bg-tint)", border: "1px solid var(--accent-glow)" }}>
        <MetaphorIcon metaphor={dayMaster.metaphorInfo.id} size={64} />
      </div>

      {/* "You are" */}
      <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] mb-1.5">
        {t("youAre")}
      </p>

      {/* Metaphor Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-1">
        {dayMaster.metaphorInfo.displayName}
      </h1>

      {/* Hanja + Romanization */}
      <p className="text-sm text-text-secondary mb-1.5">
        {dayMaster.metaphorInfo.hanja} · {dayMaster.metaphorInfo.romanization}
      </p>

      {/* Element badge with hanja */}
      <span className="inline-flex px-2.5 py-0.5 rounded-full accent-badge text-[10px] tracking-wider mb-4">
        {elementLabel} · {YINYANG_HANJA[dayMaster.yinYang]}{ELEMENT_HANJA[dayMaster.element]}
      </span>

      {/* Personality description */}
      <p className="text-sm text-text-secondary max-w-lg mb-5 leading-relaxed">
        {resolveKey(dayMaster.personality)}
      </p>

      {/* Top 3 Elements mini pills */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-text-muted uppercase tracking-wider mr-1">
          {t("topElements")}
        </span>
        {elements.map(({ element, value }) => (
          <div
            key={element}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]"
          >
            <ElementIcon element={element} size={14} />
            <span className="text-[10px] text-text-secondary font-medium">
              {Math.round(value)}%
            </span>
          </div>
        ))}
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-5">
        {dayMaster.strengths.slice(0, 4).map((strength, i) => (
          <span
            key={strength}
            className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-text-secondary text-xs animate-slide-up"
            style={{ animationDelay: `${200 + i * 100}ms` }}
          >
            {resolveKey(strength)}
          </span>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="flex flex-col items-center gap-1 animate-bounce">
        <span className="text-[10px] text-text-muted">{t("scrollToExplore")}</span>
        <ChevronDown className="w-4 h-4 text-text-muted" />
      </div>
    </div>
  );
}