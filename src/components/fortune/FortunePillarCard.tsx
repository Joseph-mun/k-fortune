"use client";

import { cn } from "@/lib/utils";
import type { Pillar } from "@/lib/saju/types";
import { STEM_METAPHORS, BRANCH_ANIMALS } from "@/lib/saju/metaphors";
import { ELEMENT_COLORS, ELEMENT_HANJA, YINYANG_HANJA } from "@/lib/saju/constants";
import { MetaphorIcon } from "@/components/icons/MetaphorIcon";
import { AnimalIcon } from "@/components/icons/AnimalIcon";

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
          ? "accent-glow"
          : "border-white/[0.06] hover:border-white/[0.1]",
      )}
      style={isHighlighted ? { background: "var(--accent-bg-tint)", borderColor: "var(--accent-glow)" } : undefined}
    >
      <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
        {label}
      </span>

      {/* Stem Metaphor (top) */}
      <div className="flex flex-col items-center gap-0.5 py-1.5">
        <MetaphorIcon metaphor={metaphor.id} size={36} />
        <span className="text-sm font-bold text-text-primary">
          {metaphor.displayName.replace("The ", "")}
        </span>
        <span className="text-[10px] text-text-muted">
          {metaphor.hanja} ({metaphor.romanization})
        </span>
        <span
          className="text-[10px]"
          style={{ color: elementColor }}
        >
          {pillar.yinYang === "yang" ? "Yang" : "Yin"} {pillar.stemElement.charAt(0).toUpperCase() + pillar.stemElement.slice(1)} · {YINYANG_HANJA[pillar.yinYang]}{ELEMENT_HANJA[pillar.stemElement]}
        </span>
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-white/[0.08]" />

      {/* Branch Animal (bottom) */}
      <div className="flex flex-col items-center gap-0.5 py-1.5">
        <AnimalIcon animal={animal.id} size={28} />
        <span className="text-xs text-text-secondary">
          {animal.displayName}
        </span>
        <span className="text-[10px] text-text-muted">
          {animal.hanja} ({animal.romanization})
        </span>
      </div>
    </div>
  );
}
