"use client";

import { useState, useEffect } from "react";
import type { ElementAnalysis, Element } from "@/lib/saju/types";
import { ELEMENT_COLORS, ELEMENT_ICONS } from "@/lib/saju/constants";
import { useTranslations } from "next-intl";

interface ElementChartProps {
  analysis: ElementAnalysis;
}

const ELEMENTS: Element[] = ["wood", "fire", "earth", "metal", "water"];

export function ElementChart({ analysis }: ElementChartProps) {
  const t = useTranslations("elements");
  const tReading = useTranslations("reading");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {ELEMENTS.map((element, index) => {
          const percentage = analysis[element];
          const color = ELEMENT_COLORS[element];
          const icon = ELEMENT_ICONS[element];
          const isDominant = element === analysis.dominant;
          const isLacking = element === analysis.lacking;

          return (
            <div key={element} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
              <span className="text-base w-5">{icon}</span>
              <span className="text-xs text-text-secondary w-12 capitalize">
                {t(element)}
              </span>
              <div
                className="flex-1 h-2 rounded-full bg-bg-surface overflow-hidden"
                role="meter"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${t(element)} ${percentage}%`}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: mounted ? `${Math.max(percentage, 3)}%` : "0%",
                    backgroundColor: color,
                    opacity: element === "metal" ? 0.8 : 1,
                    transitionDelay: `${index * 100}ms`,
                  }}
                />
              </div>
              <span className="text-xs font-[family-name:var(--font-mono)] text-text-muted w-9 text-right">
                {percentage}%
              </span>
              {isDominant && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/[0.15]">
                  {tReading("dominant")}
                </span>
              )}
              {isLacking && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/[0.15]">
                  {tReading("lacking")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
