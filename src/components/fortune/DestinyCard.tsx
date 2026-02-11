"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useRef, useEffect } from "react";
import type { BasicReading } from "@/lib/saju/types";

interface DestinyCardProps {
  reading: BasicReading;
  style?: "classic" | "tarot" | "neon" | "ink" | "photo" | "seasonal";
  showDownload?: boolean;
  onDownload?: () => void;
  onShare?: () => void;
}

export function DestinyCard({
  reading,
  style = "classic",
  showDownload = false,
  onDownload,
  onShare,
}: DestinyCardProps) {
  const t = useTranslations("metaphors");
  const tElements = useTranslations("elements");
  const tCard = useTranslations("cardGenerator");

  const { dayMaster, fourPillars, elementAnalysis, luckyInfo } = reading;

  const styleClasses = getStyleClasses(style);
  const hashtag = `#${dayMaster.metaphorInfo.displayName.replace(/^The /, "").replace(/\s+/g, "")}Destiny`;

  // 3D tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (0.5 - y) * 10,
      rotateY: (x - 0.5) * 10,
    });
    setShine({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div className="relative perspective-1000" id={`destiny-card-${reading.id}`}>
      <div
        ref={cardRef}
        className={`w-[320px] aspect-[2/3] rounded-xl overflow-hidden relative preserve-3d transition-all duration-300 ${styleClasses.container} ${isHovered ? "ring-glow-purple" : ""}`}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Shine overlay */}
        {isHovered && (
          <div
            className="absolute inset-0 z-20 pointer-events-none rounded-xl"
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
            }}
          />
        )}
        {/* Background */}
        <div className={`absolute inset-0 ${styleClasses.background}`} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }} />

        {/* Card content */}
        <div className="relative z-10 flex flex-col h-full p-5">
          {/* Top badge */}
          <div className={`flex items-center justify-between text-[9px] tracking-[0.15em] uppercase ${styleClasses.muted}`}>
            <span>K-DESTINY</span>
            <span>{tElements(dayMaster.yinYang)} {tElements(dayMaster.element)}</span>
          </div>

          {/* Hero: Day Master */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {/* SVG-based icon circle */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${styleClasses.iconBg}`}>
              <span className="text-4xl">{getMetaphorSymbol(dayMaster.metaphor)}</span>
            </div>

            <h2 className={`text-lg font-bold tracking-wide font-[family-name:var(--font-heading)] mb-1 ${styleClasses.title}`}>
              {dayMaster.metaphorInfo.displayName.toUpperCase()}
            </h2>
            <p className={`text-[11px] leading-relaxed max-w-[240px] ${styleClasses.text}`}>
              {t(`${dayMaster.metaphor}.nature`).slice(0, 80)}...
            </p>
          </div>

          {/* Element Distribution — animated on mount */}
          <div className="flex gap-0.5 mb-3 rounded-full overflow-hidden h-1.5">
            {(["wood", "fire", "earth", "metal", "water"] as const).map((el) => (
              <div
                key={el}
                className="h-full transition-all duration-700 ease-out"
                style={{
                  width: mounted ? `${Math.max(elementAnalysis[el], 5)}%` : "0%",
                  backgroundColor: ELEMENT_BAR_COLORS[el],
                  opacity: el === "metal" ? 0.7 : 0.85,
                }}
              />
            ))}
          </div>

          {/* Four Pillars Mini */}
          <div className="grid grid-cols-4 gap-1.5 text-center mb-3">
            {(["year", "month", "day", "hour"] as const).map((key) => {
              const pillar = fourPillars[key];
              return (
                <div
                  key={key}
                  className={`rounded-md py-1.5 ${styleClasses.pillarBg}`}
                >
                  <span className="text-sm block">{getMetaphorSymbol(pillar.metaphor)}</span>
                  <span className={`text-[8px] block ${styleClasses.muted}`}>
                    {getAnimalSymbol(pillar.animal)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Lucky Info */}
          <div className={`flex justify-between items-center text-[9px] px-1 mb-2 ${styleClasses.muted}`}>
            <span>{luckyInfo.color}</span>
            <span className="opacity-30">|</span>
            <span>{luckyInfo.number}</span>
            <span className="opacity-30">|</span>
            <span>{luckyInfo.direction}</span>
          </div>

          {/* Footer */}
          <div className={`text-center text-[8px] tracking-[0.2em] uppercase ${styleClasses.muted}`}>
            {hashtag}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {showDownload && (
        <div className="flex justify-center gap-2 mt-3">
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-3 py-1.5 text-xs bg-white/[0.04] text-text-secondary rounded-lg border border-white/[0.08] hover:border-white/[0.15] transition-colors"
            >
              {tCard("download")}
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="px-3 py-1.5 text-xs bg-purple-500/[0.1] text-purple-300 rounded-lg border border-purple-500/[0.2] hover:bg-purple-500/[0.15] transition-colors"
            >
              {tCard("share")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function getStyleClasses(style: string) {
  const styles: Record<string, {
    container: string;
    background: string;
    title: string;
    text: string;
    muted: string;
    iconBg: string;
    pillarBg: string;
  }> = {
    classic: {
      container: "border border-white/[0.08] shadow-xl shadow-purple-500/[0.05]",
      background: "bg-gradient-to-b from-[#131316] via-[#18181B] to-[#0C0C0E]",
      title: "text-text-primary",
      text: "text-text-secondary",
      muted: "text-text-muted",
      iconBg: "bg-purple-500/[0.1] border border-purple-500/[0.2]",
      pillarBg: "bg-white/[0.03]",
    },
    tarot: {
      container: "border border-gold-500/[0.2] shadow-xl shadow-gold-500/[0.05]",
      background: "bg-gradient-to-b from-[#141008] via-[#1A150D] to-[#141008]",
      title: "text-gold-400",
      text: "text-gold-500/[0.6]",
      muted: "text-gold-500/[0.4]",
      iconBg: "bg-gold-500/[0.1] border border-gold-500/[0.2]",
      pillarBg: "bg-gold-500/[0.04]",
    },
    neon: {
      container: "border border-purple-400/[0.3] shadow-xl shadow-purple-400/[0.1]",
      background: "bg-gradient-to-b from-[#0A0015] via-[#120020] to-[#0A0015]",
      title: "text-purple-300",
      text: "text-purple-200/[0.6]",
      muted: "text-purple-400/[0.5]",
      iconBg: "bg-purple-500/[0.15] border border-purple-400/[0.3]",
      pillarBg: "bg-purple-500/[0.06]",
    },
    ink: {
      container: "border border-gray-300/[0.3] shadow-xl",
      background: "bg-gradient-to-b from-[#F5F0E8] via-[#EDE8DF] to-[#F5F0E8]",
      title: "text-gray-900",
      text: "text-gray-600",
      muted: "text-gray-400",
      iconBg: "bg-gray-900/[0.05] border border-gray-300/[0.3]",
      pillarBg: "bg-gray-900/[0.03]",
    },
    photo: {
      container: "border border-white/[0.1] shadow-xl",
      background: "bg-gradient-to-b from-purple-900/[0.9] via-purple-800/[0.7] to-purple-900/[0.9]",
      title: "text-white",
      text: "text-white/[0.6]",
      muted: "text-white/[0.4]",
      iconBg: "bg-white/[0.1] border border-white/[0.2]",
      pillarBg: "bg-white/[0.05]",
    },
    seasonal: {
      container: "border border-pink-400/[0.2] shadow-xl shadow-pink-400/[0.05]",
      background: "bg-gradient-to-b from-[#150810] via-[#1A0D15] to-[#150810]",
      title: "text-pink-300",
      text: "text-pink-200/[0.6]",
      muted: "text-pink-400/[0.4]",
      iconBg: "bg-pink-500/[0.1] border border-pink-400/[0.2]",
      pillarBg: "bg-pink-500/[0.04]",
    },
  };

  return styles[style] || styles.classic;
}

/** Stylized symbol for metaphor — using refined unicode symbols instead of emoji */
function getMetaphorSymbol(metaphor: string): string {
  const symbols: Record<string, string> = {
    "great-tree": "🌲",
    flower: "✿",
    sun: "☀",
    candle: "🕯",
    mountain: "⛰",
    garden: "🌱",
    sword: "⚔",
    jewel: "◆",
    ocean: "🌊",
    rain: "☔",
  };
  return symbols[metaphor] || "✦";
}

function getAnimalSymbol(animal: string): string {
  const symbols: Record<string, string> = {
    rat: "子",
    ox: "丑",
    tiger: "寅",
    rabbit: "卯",
    dragon: "辰",
    snake: "巳",
    horse: "午",
    goat: "未",
    monkey: "申",
    rooster: "酉",
    dog: "戌",
    pig: "亥",
  };
  return symbols[animal] || "·";
}

const ELEMENT_BAR_COLORS: Record<string, string> = {
  wood: "#22C55E",
  fire: "#F43F5E",
  earth: "#F59E0B",
  metal: "#E4E4E7",
  water: "#6366F1",
};
