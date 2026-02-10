"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useReadingStore } from "@/stores/useReadingStore";

export function BirthInputForm() {
  const t = useTranslations("form");
  const locale = useLocale();
  const router = useRouter();
  const setReading = useReadingStore((s) => s.setReading);

  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!birthDate) newErrors.birthDate = t("validation.birthDateRequired");
    if (!gender) newErrors.gender = t("validation.genderRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/fortune/basic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate,
          birthTime: unknownTime ? null : birthTime || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          gender,
          locale,
        }),
      });

      if (!res.ok) throw new Error("Failed to calculate");

      const data = await res.json();
      setReading(data.id, data);
      router.push(`/${locale}/reading/${data.id}`);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md">
      <Input
        id="birthDate"
        type="date"
        label={t("birthDate")}
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        error={errors.birthDate}
        max={new Date().toISOString().split("T")[0]}
        min="1920-01-01"
      />

      {!unknownTime && (
        <Input
          id="birthTime"
          type="time"
          label={t("birthTime")}
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          placeholder={t("birthTimePlaceholder")}
        />
      )}

      <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
        <input
          type="checkbox"
          checked={unknownTime}
          onChange={(e) => setUnknownTime(e.target.checked)}
          className="rounded border-purple-500/30 bg-bg-surface"
        />
        {t("birthTimeUnknown")}
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-secondary">{t("gender")}</span>
        <div className="flex gap-3">
          {(["male", "female", "other"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                gender === g
                  ? "bg-purple-500/20 border-purple-500/60 text-purple-300"
                  : "bg-bg-surface border-purple-500/10 text-text-secondary hover:border-purple-500/30"
              }`}
            >
              {t(g)}
            </button>
          ))}
        </div>
        {errors.gender && <p className="text-sm text-red-400">{errors.gender}</p>}
      </div>

      {errors.form && (
        <p className="text-sm text-red-400 text-center">{errors.form}</p>
      )}

      <Button type="submit" size="lg" loading={loading} className="mt-2">
        {t("submit")}
      </Button>
    </form>
  );
}
