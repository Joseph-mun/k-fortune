"use client";

import { useState, useEffect } from "react";
import type { ElementAnalysis, Element } from "@/lib/saju/types";
import { ELEMENT_COLORS, ELEMENT_HANJA } from "@/lib/saju/constants";
import { useTranslations } from "next-intl";
import { ElementIcon } from "@/components/icons/ElementIcon";

interface ElementChartProps {
  analysis: ElementAnalysis;
}

const ELEMENTS: Element[] = ["wood", "fire", "earth", "metal", "water"];

export function ElementChart({ analysis }: ElementChartProps) {
  const t = useTranslations("elements");
  const tReading = useTranslations("reading");
  const [mounted, setMounted] = useState(false);
  const [activeElement, setActiveElement] = useState<Element | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1.5">
        {ELEMENTS.map((element, index) => {
          const percentage = analysis[element];
          const color = ELEMENT_COLORS[element];
          const isDominant = element === analysis.dominant;
          const isLacking = element === analysis.lacking;
          const isActive = activeElement === element;

          return (
            <div key={element}>
              <div
                className="flex items-center gap-3 animate-slide-up cursor-pointer rounded-md px-1 py-1 -mx-1 transition-colors hover:bg-white/[0.03]"
                style={{ animationDelay: `${index * 80}ms` }}
                onMouseEnter={() => setActiveElement(element)}
                onMouseLeave={() => setActiveElement(null)}
                onClick={() => setActiveElement(isActive ? null : element)}
              >
                <ElementIcon element={element} size={18} />
                <span className="text-xs text-text-secondary w-16 capitalize">
                  {t(element)} <span className="text-text-muted">{ELEMENT_HANJA[element]}</span>
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
              {isActive && (
                <p className="text-[10px] text-text-muted pl-[calc(18px+0.75rem)] animate-fade-in" style={{ color }}>
                  {t(`${element}Desc`)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
