"use client";

import { cn } from "@/lib/utils";
import type { Pillar } from "@/lib/saju/types";
import { STEM_METAPHORS, BRANCH_ANIMALS } from "@/lib/saju/metaphors";
import { ELEMENT_COLORS } from "@/lib/saju/constants";

interface FortunePillarCardProps {
  pillar: Pillar;
  label: string;
  isHighlighted?: boolean;
}

export function FortunePillarCard({ pillar, label, isHighlighted = false }: FortunePillarCardProps) {
  const metaphor = STEM_METAPHORS[pillar.stem];
  const animal = BRANCH_ANIMALS[pillar.branch];
  const elementColor = ELEMENT_COLORS[pillar.stemElement];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg p-3 bg-bg-surface border transition-all duration-200",
        isHighlighted
          ? "border-purple-500/40 bg-purple-500/[0.04]"
          : "border-white/[0.06] hover:border-white/[0.1]",
      )}
    >
      <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
        {label}
      </span>

      {/* Stem Metaphor (top) */}
      <div className="flex flex-col items-center gap-0.5 py-1.5">
        <span className="text-2xl">{metaphor.icon}</span>
        <span className="text-xs font-semibold text-text-primary">
          {metaphor.displayName.replace("The ", "")}
        </span>
        <span
          className="text-[10px]"
          style={{ color: elementColor }}
        >
          {pillar.yinYang === "yang" ? "Yang" : "Yin"} {pillar.stemElement.charAt(0).toUpperCase() + pillar.stemElement.slice(1)}
        </span>
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-white/[0.08]" />

      {/* Branch Animal (bottom) */}
      <div className="flex flex-col items-center gap-0.5 py-1.5">
        <span className="text-xl">{animal.icon}</span>
        <span className="text-xs text-text-secondary">
          {animal.displayName}
        </span>
      </div>
    </div>
  );
}
