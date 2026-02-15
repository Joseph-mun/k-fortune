"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Mail, Check, ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";

import { calculateYearPillar } from "@/lib/saju/pillars";
import { BRANCH_ANIMALS } from "@/lib/saju/metaphors";
import { AnimalIcon } from "@/components/icons/AnimalIcon";
import { ElementIcon } from "@/components/icons/ElementIcon";
import type { Pillar } from "@/lib/saju/types";
import type { BranchAnimalInfo } from "@/lib/saju/types";

const ELEMENT_LABELS: Record<string, string> = {
  wood: "Wood 木",
  fire: "Fire 火",
  earth: "Earth 土",
  metal: "Metal 金",
  water: "Water 水",
};

const ELEMENT_COLORS: Record<string, string> = {
  wood: "#22C55E",
  fire: "#F43F5E",
  earth: "#F59E0B",
  metal: "#A1A1AA",
  water: "#6366F1",
};

type Phase = "input" | "reveal" | "email" | "done";

export function TeaserClient() {
  const t = useTranslations("teaser");
  const [phase, setPhase] = useState<Phase>("input");
  const [birthYear, setBirthYear] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Calculate year pillar client-side
  const yearData = useMemo<{
    pillar: Pillar;
    animal: BranchAnimalInfo;
  } | null>(() => {
    const y = Number(birthYear);
    if (!y || y < 1924 || y > 2025) return null;
    try {
      const pillar = calculateYearPillar(y);
      const animal = BRANCH_ANIMALS[pillar.branch];
      return { pillar, animal };
    } catch {
      return null;
    }
  }, [birthYear]);

  const handleReveal = useCallback(() => {
    if (!yearData) return;
    track("teaser_reveal", {
      year: birthYear,
      animal: yearData.animal.id,
      element: yearData.pillar.stemElement,
    });
    setPhase("reveal");
    // Auto-advance to email after animation
    setTimeout(() => setPhase("email"), 2500);
  }, [yearData, birthYear]);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !email.includes("@")) {
        setError(t("emailInvalid"));
        return;
      }

      setSubmitting(true);
      setError("");

      try {
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            birthYear: birthYear || null,
            element: yearData?.pillar.stemElement || null,
            animal: yearData?.animal.id || null,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to subscribe");
        }

        track("teaser_email_submitted", { element: yearData?.pillar.stemElement || "" });
        setPhase("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
    [email, birthYear, yearData, t],
  );

  const elementColor = yearData
    ? ELEMENT_COLORS[yearData.pillar.stemElement] || "#A855F7"
    : "#A855F7";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Logo / Brand */}
        <h1 className="ink-display text-4xl mb-2">SAJU</h1>
        <p className="text-text-muted text-sm mb-10">{t("tagline")}</p>

        {/* Phase: Birth year input */}
        {phase === "input" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-text-primary font-[family-name:var(--font-heading)]">
              {t("inputTitle")}
            </h2>
            <p className="text-text-secondary text-sm">{t("inputDesc")}</p>

            <div className="flex gap-3 justify-center">
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="1990"
                min={1924}
                max={2025}
                className="w-32 text-center text-lg font-bold rounded-lg border border-white/[0.1] bg-white/[0.03] text-text-primary py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                onClick={handleReveal}
                disabled={!yearData}
                className="px-6 py-3 rounded-lg bg-purple-500 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-400 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {t("revealButton")}
              </button>
            </div>

            {/* Subtle year animal preview */}
            {yearData && (
              <p className="text-xs text-text-muted animate-fade-in">
                {yearData.animal.icon} Year of the {yearData.animal.displayName}
              </p>
            )}

            <p className="text-[10px] text-text-muted mt-4">{t("comingSoon")}</p>
          </div>
        )}

        {/* Phase: Reveal animation */}
        {phase === "reveal" && yearData && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-glow-breathe"
                style={{
                  background: `${elementColor}15`,
                  border: `2px solid ${elementColor}40`,
                }}
              >
                <AnimalIcon animal={yearData.animal.id} size={56} />
              </div>
            </div>

            <div>
              <p className="text-2xl font-bold text-text-primary font-[family-name:var(--font-heading)]">
                {yearData.animal.icon} {yearData.animal.displayName}
              </p>
              <p className="text-sm text-text-muted">
                {yearData.animal.hanja} · {yearData.animal.romanization}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  background: `${elementColor}10`,
                  borderColor: `${elementColor}30`,
                }}
              >
                <ElementIcon element={yearData.pillar.stemElement} size={18} />
                <span className="text-sm font-semibold" style={{ color: elementColor }}>
                  {ELEMENT_LABELS[yearData.pillar.stemElement]}
                </span>
              </div>
              <div className="px-4 py-2 rounded-full border border-white/[0.1] bg-white/[0.03]">
                <span className="text-sm text-text-secondary">
                  {yearData.pillar.yinYang === "yang" ? "陽 Yang" : "陰 Yin"}
                </span>
              </div>
            </div>

            <div className="flex gap-1 mt-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: elementColor, animationDelay: "0ms" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: elementColor, animationDelay: "150ms" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: elementColor, animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        {/* Phase: Email collection */}
        {phase === "email" && yearData && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            {/* Mini reveal recap */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]">
              <AnimalIcon animal={yearData.animal.id} size={24} />
              <span className="text-sm text-text-secondary">
                {yearData.animal.displayName} · {ELEMENT_LABELS[yearData.pillar.stemElement]}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-text-primary font-[family-name:var(--font-heading)]">
              {t("emailTitle")}
            </h2>
            <p className="text-text-secondary text-sm max-w-xs">
              {t("emailDesc")}
            </p>

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3 w-full max-w-xs">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/[0.1] bg-white/[0.03] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-400 disabled:opacity-40 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>{t("emailSubmitting")}</span>
                ) : (
                  <>
                    {t("emailButton")}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-text-muted">{t("emailPrivacy")}</p>
            </form>
          </div>
        )}

        {/* Phase: Success */}
        {phase === "done" && (
          <div className="flex flex-col items-center gap-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500/10 border border-green-500/30">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary font-[family-name:var(--font-heading)]">
              {t("successTitle")}
            </h2>
            <p className="text-text-secondary text-sm max-w-xs">
              {t("successDesc")}
            </p>
            <p className="text-xs text-text-muted mt-4">{t("successFooter")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
