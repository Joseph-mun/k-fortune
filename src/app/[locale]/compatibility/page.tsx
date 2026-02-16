"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CompatibilityMeter } from "@/components/fortune/CompatibilityMeter";

interface PersonInput {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: "male" | "female" | "other";
}

const DEFAULT_PERSON: PersonInput = {
  name: "",
  birthDate: "",
  birthTime: "",
  gender: "other",
};

export default function CompatibilityPage() {
  const t = useTranslations("compatibilityPage");
  const tForm = useTranslations("form");
  const tInterpretation = useTranslations("interpretation.compatibility");

  const [person1, setPerson1] = useState<PersonInput>({ ...DEFAULT_PERSON });
  const [person2, setPerson2] = useState<PersonInput>({ ...DEFAULT_PERSON });
  const [result, setResult] = useState<{
    overallScore: number;
    categories: { romance: number; communication: number; values: number; lifestyle: number };
    analysis: string;
    advice: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/fortune/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person1: {
            birthDate: person1.birthDate,
            birthTime: person1.birthTime || null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            gender: person1.gender,
            locale: "en",
          },
          person2: {
            birthDate: person2.birthDate,
            birthTime: person2.birthTime || null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            gender: person2.gender,
            locale: "en",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to check compatibility");
      }

      const data = await response.json();
      setResult({
        overallScore: data.overallScore,
        categories: data.categories,
        analysis: data.analysis,
        advice: data.advice,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <NavBar />

      <div className="w-full max-w-lg flex flex-col items-center gap-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
            {t("title")}
          </h1>
          <p className="text-text-secondary mt-2">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Person 1 */}
          <PersonForm
            label={t("person1")}
            person={person1}
            onChange={setPerson1}
            tForm={tForm}
          />

          {/* Person 2 */}
          <PersonForm
            label={t("person2")}
            person={person2}
            onChange={setPerson2}
            tForm={tForm}
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !person1.birthDate || !person2.birthDate}
            className="w-full"
          >
            {loading ? "..." : t("submit")}
          </Button>
        </form>

        {/* Results */}
        {result && (
          <Card className="w-full p-6 space-y-6">
            <h2 className="text-xl font-bold text-center font-[family-name:var(--font-heading)] text-text-primary">
              {t("results.title")}
            </h2>

            <CompatibilityMeter
              overallScore={result.overallScore}
              categories={result.categories}
            />

            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-1">
                  {t("results.analysis")}
                </h3>
                <p className="text-text-primary text-sm leading-relaxed">
                  {getInterpretationText(tInterpretation, "analysis", result.analysis)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-1">
                  {t("results.advice")}
                </h3>
                <p className="text-text-primary text-sm leading-relaxed">
                  {getInterpretationText(tInterpretation, "advice", result.advice)}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </main>
  );
}

function getInterpretationText(
  t: ReturnType<typeof useTranslations>,
  category: string,
  key: string
): string {
  // key format: "interpretation.compatibility.analysis.excellent"
  const level = key.split(".").pop() || "moderate";
  const validLevels = ["excellent", "good", "moderate", "challenging", "difficult"];
  const safeLevel = validLevels.includes(level) ? level : "moderate";
  const translationKey = `${category}.${safeLevel}` as Parameters<typeof t>[0];
  try {
    const result = t(translationKey);
    // next-intl returns the key path if translation is missing
    if (result === translationKey || result.startsWith("interpretation.")) {
      return t(`${category}.moderate` as Parameters<typeof t>[0]);
    }
    return result;
  } catch {
    return t(`${category}.moderate` as Parameters<typeof t>[0]);
  }
}

function PersonForm({
  label,
  person,
  onChange,
  tForm,
}: {
  label: string;
  person: PersonInput;
  onChange: (p: PersonInput) => void;
  tForm: ReturnType<typeof useTranslations>;
}) {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold text-purple-400">{label}</h3>

      <div>
        <label className="block text-xs text-text-muted mb-1">
          {tForm("birthDate")}
        </label>
        <input
          type="date"
          value={person.birthDate}
          onChange={(e) => onChange({ ...person, birthDate: e.target.value })}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-1">
          {tForm("birthTime")}
        </label>
        <input
          type="time"
          value={person.birthTime}
          onChange={(e) => onChange({ ...person, birthTime: e.target.value })}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-1">
          {tForm("gender")}
        </label>
        <div className="flex gap-2">
          {(["male", "female", "other"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onChange({ ...person, gender: g })}
              className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                person.gender === g
                  ? "border-purple-500 bg-purple-500/20 text-purple-300"
                  : "border-border text-text-muted hover:border-purple-500/50"
              }`}
            >
              {tForm(g)}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
