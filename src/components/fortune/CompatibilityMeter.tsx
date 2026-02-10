"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface CompatibilityMeterProps {
  overallScore: number;
  categories: {
    romance: number;
    communication: number;
    values: number;
    lifestyle: number;
  };
  animate?: boolean;
}

function getHarmonyLevel(score: number): string {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "moderate";
  if (score >= 30) return "challenging";
  return "difficult";
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-gold-400";
  if (score >= 70) return "text-purple-400";
  if (score >= 50) return "text-text-primary";
  if (score >= 30) return "text-orange-400";
  return "text-red-400";
}

function getBarGradient(score: number): string {
  if (score >= 85) return "from-gold-500 to-gold-400";
  if (score >= 70) return "from-purple-600 to-purple-400";
  if (score >= 50) return "from-purple-700 to-purple-500";
  if (score >= 30) return "from-orange-600 to-orange-400";
  return "from-red-600 to-red-400";
}

const CATEGORY_ICONS: Record<string, string> = {
  romance: "\u{1F495}",
  communication: "\u{1F4AC}",
  values: "\u{1F3AF}",
  lifestyle: "\u{1F3E0}",
};

export function CompatibilityMeter({
  overallScore,
  categories,
  animate = true,
}: CompatibilityMeterProps) {
  const t = useTranslations("compatibilityPage.results");
  const [animatedScore, setAnimatedScore] = useState(animate ? 0 : overallScore);
  const [showBars, setShowBars] = useState(!animate);

  useEffect(() => {
    if (!animate) return;

    // Animate overall score
    let frame = 0;
    const totalFrames = 60;
    const interval = setInterval(() => {
      frame++;
      setAnimatedScore(Math.round((frame / totalFrames) * overallScore));
      if (frame >= totalFrames) {
        clearInterval(interval);
        setAnimatedScore(overallScore);
      }
    }, 16);

    // Show bars after a short delay
    const timer = setTimeout(() => setShowBars(true), 300);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [animate, overallScore]);

  const circumference = 2 * Math.PI * 70;
  const strokeOffset = circumference - (animatedScore / 100) * circumference;
  const level = getHarmonyLevel(overallScore);
  const scoreColor = getScoreColor(overallScore);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Overall Score Circle */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-border"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${scoreColor}`}>
            {animatedScore}%
          </span>
          <span className="text-xs text-text-muted uppercase tracking-wider mt-1">
            {t(level as "excellent" | "good" | "moderate" | "challenging" | "difficult"  )}
          </span>
        </div>
      </div>

      {/* Category Bars */}
      <div className="w-full space-y-4">
        {(Object.entries(categories) as [keyof typeof categories, number][]).map(
          ([key, score]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-lg w-8 text-center">{CATEGORY_ICONS[key]}</span>
              <span className="text-sm text-text-secondary w-28 shrink-0">
                {t(key)}
              </span>
              <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getBarGradient(score)} transition-all duration-700 ease-out`}
                  style={{ width: showBars ? `${Math.max(score, 5)}%` : "0%" }}
                />
              </div>
              <span className={`text-sm font-semibold w-10 text-right ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
