"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import { track } from "@vercel/analytics";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DestinyCard } from "@/components/fortune/DestinyCard";
import { DestinyCardGenerator } from "@/components/fortune/DestinyCardGenerator";
import { useReadingStore } from "@/stores/useReadingStore";
import { reconstructReading } from "@/lib/saju";
import { useAuth } from "@/features/auth/hooks/useAuth";

const STYLES = ["classic", "tarot", "neon", "ink", "photo", "seasonal"] as const;
const STYLE_ICONS: Record<string, string> = {
  classic: "\u{1F3B4}",
  tarot: "\u{1F52E}",
  neon: "\u2728",
  ink: "\u{1F58B}\uFE0F",
  photo: "\u{1F4F8}",
  seasonal: "\u{1F338}",
};

export default function CardCreatePage() {
  const t = useTranslations("cards.create");
  const tStyles = useTranslations("cardGenerator.styles");
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedStyle, setSelectedStyle] = useState<(typeof STYLES)[number]>("classic");
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | false>(false);

  const { isAuthenticated, isLoading: authLoading, login } = useAuth();

  // Get latest reading from store
  const readings = useReadingStore((s) => s.readings);
  const readingValues = Object.values(readings);
  const latestReading = readingValues.length > 0 ? readingValues[readingValues.length - 1] : null;

  if (!latestReading) {
    return (
      <main className="flex flex-col items-center min-h-screen px-4">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center max-w-sm">
            <p className="text-text-secondary mb-4">{t("needReading")}</p>
            <Button onClick={() => router.push("/")}>
              {t("needReadingAction")}
            </Button>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  const reading = reconstructReading(latestReading);

  const handleCreate = async () => {
    if (!isAuthenticated) {
      setSaveError("LOGIN_REQUIRED");
      setStep(3);
      return;
    }

    setCreating(true);
    setSaveError(false);
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: selectedStyle,
          readingData: latestReading,
          isPublic,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCardId(data.card.id);
        track("card_created", { style: selectedStyle, isPublic });
        setStep(3);
      } else if (response.status === 401) {
        setSaveError("LOGIN_REQUIRED");
        setStep(3);
      } else {
        setSaveError("SAVE_FAILED");
        setStep(3);
      }
    } catch {
      setSaveError("SAVE_FAILED");
      setStep(3);
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <NavBar />

      <div className="w-full max-w-lg flex flex-col items-center gap-6 py-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
          {t("title")}
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s
                  ? "bg-purple-500 text-white"
                  : "bg-surface text-text-muted"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Step 1: Choose style */}
        {step === 1 && (
          <div className="w-full space-y-4">
            <h2 className="text-lg text-text-secondary text-center">
              {t("chooseStyle")}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    selectedStyle === style
                      ? "border-purple-500 bg-purple-500/20 ring-2 ring-purple-500"
                      : "border-border bg-surface hover:border-purple-500/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{STYLE_ICONS[style]}</div>
                  <div className="text-xs text-text-secondary">
                    {tStyles(style)}
                  </div>
                </button>
              ))}
            </div>
            <Button onClick={() => setStep(2)} className="w-full">
              {t("next")} →
            </Button>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <div className="w-full space-y-4">
            <h2 className="text-lg text-text-secondary text-center">
              {t("preview")}
            </h2>

            <div className="flex justify-center">
              <DestinyCard reading={reading} style={selectedStyle} />
            </div>

            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-background text-purple-500 focus:ring-purple-500"
              />
              {t("makePublic")}
            </label>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                ← {t("back")}
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1"
              >
                {creating ? t("creating") : t("createButton")}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="w-full space-y-4 text-center">
            {saveError === "LOGIN_REQUIRED" ? (
              <div className="bg-amber-500/10 border border-amber-500 rounded-lg p-4 text-amber-600">
                <p className="font-semibold">로그인이 필요합니다</p>
                <p className="text-sm mt-1">카드를 저장하려면 먼저 로그인해 주세요.</p>
                <Button
                  onClick={() => login("google")}
                  className="mt-3"
                >
                  Google로 로그인
                </Button>
              </div>
            ) : saveError ? (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                <p className="font-semibold">카드 저장에 실패했습니다.</p>
                <p className="text-sm mt-1">잠시 후 다시 시도해 주세요.</p>
                <Button
                  variant="secondary"
                  onClick={() => { setSaveError(false); setStep(2); }}
                  className="mt-3"
                >
                  다시 시도
                </Button>
              </div>
            ) : (
              <h2 className="text-xl text-gold-400 font-bold">
                {t("success")}
              </h2>
            )}

            <DestinyCardGenerator reading={reading} defaultStyle={selectedStyle} />

            <div className="flex gap-3 justify-center">
              {cardId && (
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/cards/${cardId}`)}
                >
                  View Card
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => router.push("/gallery")}
              >
                {t("viewGallery")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
