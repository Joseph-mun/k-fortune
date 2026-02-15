"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimalIcon } from "@/components/icons/AnimalIcon";
import { ElementIcon } from "@/components/icons/ElementIcon";
import type { Pillar } from "@/lib/saju/types";
import type { BranchAnimalInfo } from "@/lib/saju/types";

/**
 * InsightFlash — Instant "aha moment" shown immediately after form submit.
 * Displays zodiac animal + element + yin/yang while API loads in background.
 * Uses client-side calculateYearPillar() data (no server needed).
 */

interface InsightFlashProps {
  yearPillar: Pillar;
  animalInfo: BranchAnimalInfo;
}

const ELEMENT_LABELS: Record<string, string> = {
  wood: "Wood 木",
  fire: "Fire 火",
  earth: "Earth 土",
  metal: "Metal 金",
  water: "Water 水",
};

const ELEMENT_COLORS: Record<string, string> = {
  wood: "#22C55E",
  fire: "#F43F5E",
  earth: "#F59E0B",
  metal: "#A1A1AA",
  water: "#6366F1",
};

export function InsightFlash({ yearPillar, animalInfo }: InsightFlashProps) {
  const t = useTranslations("form");
  const [phase, setPhase] = useState(0);

  // Staggered reveal: 0 → animal, 1 → element, 2 → yin/yang, 3 → loading text
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const elementColor = ELEMENT_COLORS[yearPillar.stemElement] || "#A855F7";

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 animate-fade-in">
      {/* Animal reveal */}
      <div
        className={`transition-all duration-500 ease-out ${
          phase >= 0
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-glow-breathe"
            style={{
              background: `${elementColor}15`,
              border: `2px solid ${elementColor}40`,
            }}
          >
            <AnimalIcon animal={animalInfo.id} size={48} />
          </div>
          <p className="text-center mt-3 text-lg font-bold text-text-primary font-[family-name:var(--font-heading)]">
            {animalInfo.icon} {animalInfo.displayName}
          </p>
          <p className="text-center text-xs text-text-muted">
            {animalInfo.hanja} · {animalInfo.romanization}
          </p>
        </div>
      </div>

      {/* Element + Yin/Yang badges */}
      <div className="flex items-center gap-3">
        <div
          className={`transition-all duration-500 ease-out delay-100 ${
            phase >= 1
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{
              background: `${elementColor}10`,
              borderColor: `${elementColor}30`,
            }}
          >
            <ElementIcon element={yearPillar.stemElement} size={18} />
            <span
              className="text-sm font-semibold"
              style={{ color: elementColor }}
            >
              {ELEMENT_LABELS[yearPillar.stemElement] || yearPillar.stemElement}
            </span>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-out delay-200 ${
            phase >= 2
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.1] bg-white/[0.03]">
            <span className="text-sm text-text-secondary">
              {yearPillar.yinYang === "yang" ? "陽 Yang" : "陰 Yin"}
            </span>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div
        className={`transition-all duration-500 ease-out ${
          phase >= 3
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ backgroundColor: elementColor, animationDelay: "0ms" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ backgroundColor: elementColor, animationDelay: "150ms" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ backgroundColor: elementColor, animationDelay: "300ms" }}
            />
          </div>
          <p className="text-xs text-text-muted">{t("insightLoading")}</p>
        </div>
      </div>
    </div>
  );
}
