"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ELEMENT_CATEGORIES, getStarsByElement, formatStarLabel } from "@/lib/saju/celebrities";
import { track } from "@vercel/analytics";
import { Heart, Sparkles, Share2 } from "lucide-react";

const ELEMENT_LABELS: Record<string, { ko: string; en: string; es: string; icon: string }> = {
  wood: { ko: "목 (木)", en: "Wood", es: "Madera", icon: "🌿" },
  fire: { ko: "화 (火)", en: "Fire", es: "Fuego", icon: "🔥" },
  earth: { ko: "토 (土)", en: "Earth", es: "Tierra", icon: "🏔️" },
  metal: { ko: "금 (金)", en: "Metal", es: "Metal", icon: "⚔️" },
  water: { ko: "수 (水)", en: "Water", es: "Agua", icon: "💧" },
};

interface StarMatchResult {
  star: { id: string; emoji: string; birthDate: string; element: string };
  overallScore: number;
  categories: Record<string, number>;
  analysis: string;
  advice: string;
  user: {
    dayMaster: { element: string; yinYang: string; metaphor: string; displayName: string; icon: string };
  };
  starReading: {
    dayMaster: { element: string; yinYang: string; metaphor: string; displayName: string; icon: string };
  };
}

export default function StarMatchPage() {
  const t = useTranslations("starMatch");
  const tForm = useTranslations("form");
  const tElements = useTranslations("elements");
  const locale = useLocale();

  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [selectedStar, setSelectedStar] = useState("");
  const [activeElement, setActiveElement] = useState<string>(ELEMENT_CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StarMatchResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate) {
      setError(t("errors.birthDateRequired"));
      return;
    }
    if (!gender) {
      setError(t("errors.genderRequired"));
      return;
    }
    if (!selectedStar) {
      setError(t("errors.starRequired"));
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/fortune/star-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate,
          birthTime: unknownTime ? null : birthTime || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          gender,
          starId: selectedStar,
          locale,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to check compatibility");
      }
      const data = await res.json();
      setResult(data);
      track("star_match_completed", { score: data.overallScore, element: data.star?.element });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-gold-400";
    if (score >= 40) return "text-purple-400";
    return "text-text-muted";
  }

  function getElementLabel(element: string): string {
    const labels = ELEMENT_LABELS[element];
    if (!labels) return element;
    return labels[locale as keyof typeof labels] || labels.en;
  }

  function formatMatchLabel(birthDate: string): string {
    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (locale === "ko") return `${year}년 ${month}월생`;
    if (locale === "es") {
      const m = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return `${m[month - 1]} ${year}`;
    }
    const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${m[month - 1]} ${year}`;
  }

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full px-4">
        <NavBar />
      </div>

      <div className="w-full max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/[0.06] border border-pink-500/15 text-pink-400 text-xs mb-4">
            <Heart className="w-3 h-3" />
            {t("badge")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary font-[family-name:var(--font-heading)] mb-2">
            {t("title")}
          </h1>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Step 1: Your Info */}
            <Card>
              <h2 className="text-sm font-semibold text-text-primary mb-4">{t("yourInfo")}</h2>
              <div className="flex flex-col gap-3">
                <Input
                  id="birthDate"
                  type="date"
                  label={tForm("birthDate")}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  min="1920-01-01"
                />
                {!unknownTime && (
                  <Input
                    id="birthTime"
                    type="time"
                    label={tForm("birthTime")}
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                  />
                )}
                <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={unknownTime}
                    onChange={(e) => setUnknownTime(e.target.checked)}
                    className="rounded border-white/[0.08] bg-bg-surface accent-purple-500"
                  />
                  {tForm("birthTimeUnknown")}
                </label>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-text-secondary">{tForm("gender")}</span>
                  <div className="flex gap-2">
                    {(["male", "female", "other"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          gender === g
                            ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                            : "bg-transparent border-white/[0.08] text-text-muted hover:border-white/[0.15]"
                        }`}
                      >
                        {tForm(g)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 2: Choose Profile by Element */}
            <Card>
              <h2 className="text-sm font-semibold text-text-primary mb-4">{t("chooseStar")}</h2>

              {/* Element tabs */}
              <div className="flex gap-1 flex-wrap mb-4">
                {ELEMENT_CATEGORIES.map((el) => (
                  <button
                    key={el}
                    type="button"
                    onClick={() => setActiveElement(el)}
                    className={`px-2.5 py-1 text-[11px] rounded-md transition-colors flex items-center gap-1 ${
                      activeElement === el
                        ? "bg-white/[0.08] text-text-primary"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    <span>{ELEMENT_LABELS[el]?.icon}</span>
                    {getElementLabel(el)}
                  </button>
                ))}
              </div>

              {/* Profile grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {getStarsByElement(activeElement).map((star) => (
                  <button
                    key={star.id}
                    type="button"
                    onClick={() => setSelectedStar(star.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                      selectedStar === star.id
                        ? "bg-purple-500/10 border-purple-500/30 text-text-primary"
                        : "bg-transparent border-white/[0.06] text-text-muted hover:border-white/[0.1]"
                    }`}
                  >
                    <span className="text-2xl">{star.emoji}</span>
                    <span className="text-[10px] font-medium text-center leading-tight">
                      {formatStarLabel(star, locale)}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            <Button type="submit" size="lg" loading={loading}>
              <Heart className="w-4 h-4" />
              {t("checkMatch")}
            </Button>
          </form>
        ) : (
          /* Result */
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Score Hero */}
            <Card className="text-center py-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-1">{result.user.dayMaster.icon}</span>
                  <span className="text-xs text-text-muted">{t("you")}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="w-6 h-6 text-pink-400 animate-pulse-glow" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-1">{result.star.emoji}</span>
                  <span className="text-xs text-text-muted">{formatMatchLabel(result.star.birthDate)}</span>
                </div>
              </div>
              <div className={`text-5xl font-bold font-[family-name:var(--font-heading)] mb-1 ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}%
              </div>
              <p className="text-text-muted text-xs">{t("compatibilityScore")}</p>
            </Card>

            {/* Categories */}
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-4">{t("breakdown")}</h3>
              <div className="flex flex-col gap-3">
                {Object.entries(result.categories).map(([key, score]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-text-muted w-24 capitalize">{key}</span>
                    <div className="flex-1 h-2 rounded-full bg-bg-surface overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500 transition-all duration-700"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary w-10 text-right">{score}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Analysis */}
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-2">{t("analysis")}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{result.analysis}</p>
            </Card>

            {/* Advice */}
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-2">{t("advice")}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{result.advice}</p>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setResult(null)}>
                {t("tryAnother")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const text = `${t("shareText", { score: result.overallScore })}`;
                  if (navigator.share) {
                    navigator.share({ text, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(`${text} ${window.location.href}`);
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                {t("share")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>
    </main>
  );
}
