"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import type { BasicReading } from "@/lib/saju/types";

interface DestinyCardProps {
  reading: BasicReading;
  style?: "classic" | "tarot" | "neon" | "ink" | "photo" | "seasonal";
  showDownload?: boolean;
  onDownload?: () => void;
  onShare?: () => void;
}

/**
 * DestinyCard - Personal destiny card in BTS photocard / tarot card style
 * Section 5.5 design spec - visual summary card for sharing and collecting
 *
 * Renders a 2:3 ratio card with:
 * - Day master metaphor icon + name (hero)
 * - Four pillars summary (metaphor icons + animal icons)
 * - Element distribution mini chart
 * - Lucky info
 * - Tagline + hashtag
 */
export function DestinyCard({
  reading,
  style = "classic",
  showDownload = false,
  onDownload,
  onShare,
}: DestinyCardProps) {
  const t = useTranslations("metaphors");
  const tElements = useTranslations("elements");

  const { dayMaster, fourPillars, elementAnalysis, luckyInfo } = reading;

  const styleClasses = getStyleClasses(style);
  const hashtag = `#${dayMaster.metaphorInfo.displayName.replace(/^The /, "").replace(/\s+/g, "")}Destiny`;

  return (
    <div className="relative" id={`destiny-card-${reading.id}`}>
      <div
        className={`
          w-[360px] aspect-[2/3] rounded-2xl overflow-hidden relative
          ${styleClasses.container}
        `}
      >
        {/* Background overlay */}
        <div className={`absolute inset-0 ${styleClasses.background}`} />

        {/* Card content */}
        <div className="relative z-10 flex flex-col h-full p-6">
          {/* Hero: Day Master */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-7xl mb-3">{dayMaster.metaphorInfo.icon}</div>
            <h2 className={`text-2xl font-bold mb-1 font-[family-name:var(--font-heading)] ${styleClasses.title}`}>
              {dayMaster.metaphorInfo.displayName.toUpperCase()}
            </h2>
            <p className={`text-sm ${styleClasses.subtitle}`}>
              {dayMaster.yinYang === "yang" ? "Yang" : "Yin"}{" "}
              {tElements(dayMaster.element)}
            </p>
          </div>

          {/* Divider */}
          <div className={`flex items-center gap-2 my-3 ${styleClasses.divider}`}>
            <div className="flex-1 h-px bg-current opacity-30" />
            <span className="text-xs tracking-widest">K-DESTINY</span>
            <div className="flex-1 h-px bg-current opacity-30" />
          </div>

          {/* Four Pillars Mini */}
          <div className="grid grid-cols-4 gap-2 text-center mb-3">
            {(["year", "month", "day", "hour"] as const).map((key) => {
              const pillar = fourPillars[key];
              const stem = dayMaster.metaphorInfo; // Placeholder: in real we'd look up each
              return (
                <div key={key} className="flex flex-col items-center gap-0.5">
                  <span className="text-lg">
                    {getMetaphorIcon(pillar.metaphor)}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {getAnimalIcon(pillar.animal)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Element Distribution Mini Bar */}
          <div className="flex gap-1 mb-3">
            {(["wood", "fire", "earth", "metal", "water"] as const).map(
              (el) => (
                <div
                  key={el}
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${elementAnalysis[el]}%`,
                    backgroundColor: ELEMENT_BAR_COLORS[el],
                  }}
                />
              )
            )}
          </div>

          {/* Tagline */}
          <p className={`text-xs text-center italic mb-2 ${styleClasses.text}`}>
            &ldquo;{t(`${dayMaster.metaphor}.nature`).slice(0, 80)}...&rdquo;
          </p>

          {/* Lucky Info Mini */}
          <div className={`flex justify-center gap-3 text-[10px] mb-3 ${styleClasses.muted}`}>
            <span>{luckyInfo.color}</span>
            <span>&middot;</span>
            <span>{luckyInfo.number}</span>
            <span>&middot;</span>
            <span>{luckyInfo.direction}</span>
          </div>

          {/* Footer */}
          <div className={`text-center text-[10px] ${styleClasses.muted}`}>
            <p className="font-bold tracking-wider">K-DESTINY &middot; {hashtag}</p>
          </div>
        </div>
      </div>

      {/* Action buttons (outside card for UI, not part of card image) */}
      {showDownload && (
        <div className="flex justify-center gap-3 mt-4">
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-4 py-2 text-sm bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              Download
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="px-4 py-2 text-sm bg-gold-500/20 text-gold-400 rounded-lg hover:bg-gold-500/30 transition-colors"
            >
              Share
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Style classes for different card styles */
function getStyleClasses(style: string) {
  const styles: Record<string, {
    container: string;
    background: string;
    title: string;
    subtitle: string;
    text: string;
    muted: string;
    divider: string;
  }> = {
    classic: {
      container: "border border-purple-500/30 shadow-lg shadow-purple-500/10",
      background: "bg-gradient-to-b from-[#1A1A2E] via-[#16213E] to-[#0A0A1A]",
      title: "text-gold-400",
      subtitle: "text-purple-300",
      text: "text-text-secondary",
      muted: "text-text-muted",
      divider: "text-gold-500",
    },
    tarot: {
      container: "border-2 border-gold-500/50 shadow-lg shadow-gold-500/10",
      background: "bg-gradient-to-b from-[#1A1020] via-[#0D0A1A] to-[#1A1020]",
      title: "text-gold-400",
      subtitle: "text-gold-500/70",
      text: "text-text-secondary",
      muted: "text-gold-500/50",
      divider: "text-gold-500",
    },
    neon: {
      container: "border border-purple-400/50 shadow-lg shadow-purple-400/20",
      background: "bg-gradient-to-b from-[#0A0020] via-[#150030] to-[#0A0020]",
      title: "text-purple-300",
      subtitle: "text-purple-400",
      text: "text-purple-200",
      muted: "text-purple-400/60",
      divider: "text-purple-400",
    },
    ink: {
      container: "border border-gray-600/30 shadow-lg",
      background: "bg-gradient-to-b from-[#F5F0E8] via-[#E8E0D0] to-[#F5F0E8]",
      title: "text-gray-900",
      subtitle: "text-gray-600",
      text: "text-gray-700",
      muted: "text-gray-500",
      divider: "text-gray-400",
    },
    photo: {
      container: "border border-white/20 shadow-lg",
      background: "bg-gradient-to-b from-purple-900/80 via-purple-800/60 to-purple-900/80",
      title: "text-white",
      subtitle: "text-white/80",
      text: "text-white/70",
      muted: "text-white/50",
      divider: "text-white/60",
    },
    seasonal: {
      container: "border border-pink-400/30 shadow-lg shadow-pink-400/10",
      background: "bg-gradient-to-b from-[#1A0A1A] via-[#2A1030] to-[#1A0A1A]",
      title: "text-pink-300",
      subtitle: "text-pink-400",
      text: "text-pink-200",
      muted: "text-pink-400/60",
      divider: "text-pink-400",
    },
  };

  return styles[style] || styles.classic;
}

/** Map metaphor ID to icon */
function getMetaphorIcon(metaphor: string): string {
  const icons: Record<string, string> = {
    "great-tree": "🌳",
    flower: "🌸",
    sun: "☀️",
    candle: "🕯️",
    mountain: "⛰️",
    garden: "🌿",
    sword: "⚔️",
    jewel: "💎",
    ocean: "🌊",
    rain: "🌧️",
  };
  return icons[metaphor] || "✨";
}

/** Map animal ID to icon */
function getAnimalIcon(animal: string): string {
  const icons: Record<string, string> = {
    rat: "🐀",
    ox: "🐂",
    tiger: "🐅",
    rabbit: "🐇",
    dragon: "🐉",
    snake: "🐍",
    horse: "🐎",
    goat: "🐐",
    monkey: "🐒",
    rooster: "🐓",
    dog: "🐕",
    pig: "🐖",
  };
  return icons[animal] || "🐾";
}

const ELEMENT_BAR_COLORS: Record<string, string> = {
  wood: "#22C55E",
  fire: "#EF4444",
  earth: "#EAB308",
  metal: "#F8FAFC",
  water: "#3B82F6",
};
