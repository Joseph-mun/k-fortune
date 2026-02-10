"use client";

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

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-text-primary mb-4">
        {tReading("elementBalance")}
      </h2>
      <div className="flex flex-col gap-3">
        {ELEMENTS.map((element) => {
          const percentage = analysis[element];
          const color = ELEMENT_COLORS[element];
          const icon = ELEMENT_ICONS[element];
          const isDominant = element === analysis.dominant;
          const isLacking = element === analysis.lacking;

          return (
            <div key={element} className="flex items-center gap-3">
              <span className="text-lg w-6">{icon}</span>
              <span className="text-sm text-text-secondary w-14 capitalize">
                {t(element)}
              </span>
              <div className="flex-1 h-3 rounded-full bg-bg-surface overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                    opacity: element === "metal" ? 0.8 : 1,
                  }}
                />
              </div>
              <span className="text-sm font-mono text-text-secondary w-10 text-right">
                {percentage}%
              </span>
              {isDominant && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {tReading("dominant")}
                </span>
              )}
              {isLacking && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
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
