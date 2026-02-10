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
        "flex flex-col items-center gap-1 rounded-xl p-3 bg-bg-surface border transition-all duration-300",
        isHighlighted
          ? "border-purple-500/60 glow-purple"
          : "border-purple-500/10 hover:border-purple-500/30",
      )}
    >
      <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
        {label}
      </span>

      {/* Stem Metaphor (top) */}
      <div className="flex flex-col items-center gap-0.5 py-2">
        <span className="text-3xl">{metaphor.icon}</span>
        <span className="text-sm font-semibold text-text-primary">
          {metaphor.displayName.replace("The ", "")}
        </span>
        <span
          className="text-xs"
          style={{ color: elementColor }}
        >
          {pillar.yinYang === "yang" ? "Yang" : "Yin"} {pillar.stemElement.charAt(0).toUpperCase() + pillar.stemElement.slice(1)}
        </span>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-purple-500/20" />

      {/* Branch Animal (bottom) */}
      <div className="flex flex-col items-center gap-0.5 py-2">
        <span className="text-2xl">{animal.icon}</span>
        <span className="text-sm text-text-secondary">
          {animal.displayName}
        </span>
      </div>
    </div>
  );
}
