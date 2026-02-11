"use client";

import { useTranslations } from "next-intl";
import { MetaphorIcon } from "@/components/icons/MetaphorIcon";
import type { MajorCycle } from "@/lib/saju/types";

interface LifeCycleTimelineProps {
  cycles: MajorCycle[];
  currentAge?: number;
}

const RATING_COLORS: Record<number, string> = {
  5: "text-gold-400",
  4: "text-purple-400",
  3: "text-text-secondary",
  2: "text-orange-400",
  1: "text-red-400",
};

const RATING_BG: Record<number, string> = {
  5: "bg-gold-500/10 border-gold-500/30",
  4: "bg-purple-500/10 border-purple-500/30",
  3: "bg-surface border-border",
  2: "bg-orange-500/10 border-orange-500/30",
  1: "bg-red-500/10 border-red-500/30",
};


function Stars({ count }: { count: number }) {
  return (
    <span className="text-xs tracking-tight">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

export function LifeCycleTimeline({ cycles, currentAge }: LifeCycleTimelineProps) {
  const t = useTranslations("reading");
  const tElements = useTranslations("elements");

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-text-primary mb-4 font-[family-name:var(--font-heading)]">
        Life Cycle Timeline
      </h3>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-8 md:overflow-visible scrollbar-hide">
        {cycles.map((cycle, i) => {
          const isCurrent =
            currentAge !== undefined &&
            currentAge >= cycle.startAge &&
            currentAge <= cycle.endAge;

          return (
            <div
              key={i}
              className={`
                flex-shrink-0 w-20 md:w-auto
                flex flex-col items-center gap-1.5 p-3 rounded-lg border
                transition-all
                ${isCurrent ? "ring-2 ring-gold-400 bg-gold-500/5 border-gold-400/50" : RATING_BG[cycle.rating]}
              `}
            >
              {/* Metaphor icon */}
              <MetaphorIcon metaphor={cycle.pillar.metaphor} size={28} />

              {/* Rating stars */}
              <span className={RATING_COLORS[cycle.rating]}>
                <Stars count={cycle.rating} />
              </span>

              {/* Age range */}
              <span className="text-sm font-bold text-text-primary">
                {cycle.startAge}-{cycle.endAge}
              </span>

              {/* Element */}
              <span className="text-[10px] text-text-muted">
                {tElements(cycle.pillar.stemElement)}
              </span>

              {/* Current indicator */}
              {isCurrent && (
                <span className="text-[9px] text-gold-400 font-semibold">NOW</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
