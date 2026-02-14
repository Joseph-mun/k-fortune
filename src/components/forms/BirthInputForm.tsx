"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { CalendarPopup } from "@/components/ui/CalendarPopup";
import { StepProgress } from "./StepProgress";
import { useReadingStore } from "@/stores/useReadingStore";
import { calculateYearPillar } from "@/lib/saju/pillars";
import { BRANCH_ANIMALS } from "@/lib/saju/metaphors";
import { TIME_TO_BRANCH } from "@/lib/saju/constants";
import { AnimalIcon } from "@/components/icons/AnimalIcon";

const TOTAL_STEPS = 2;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function BirthInputForm() {
  const t = useTranslations("form");
  const locale = useLocale();
  const router = useRouter();
  const setReading = useReadingStore((s) => s.setReading);

  const [currentStep, setCurrentStep] = useState(0);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const birthDate = year && month && day
    ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    : "";

  const days = useMemo(() => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => i + 1);
    const max = getDaysInMonth(Number(year), Number(month));
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [year, month]);

  // Auto-correct day if it exceeds month's max
  useEffect(() => {
    if (day && days.length < Number(day)) {
      setDay(String(days.length));
    }
  }, [days, day]);

  const stepValid = [
    !!year && !!month && !!day && (unknownTime || !!birthTime),
    !!gender,
  ];

  const yearAnimal = useMemo(() => {
    if (!year) return null;
    try {
      const pillar = calculateYearPillar(Number(year));
      return BRANCH_ANIMALS[pillar.branch];
    } catch {
      return null;
    }
  }, [year]);

  const timeAnimal = useMemo(() => {
    if (!birthTime || unknownTime) return null;
    try {
      const hour = parseInt(birthTime.split(":")[0], 10);
      const slot = TIME_TO_BRANCH.find((s) =>
        s.start === 23
          ? hour >= 23 || hour < 1
          : hour >= s.start && hour < s.end
      );
      return slot ? BRANCH_ANIMALS[slot.branch] : null;
    } catch {
      return null;
    }
  }, [birthTime, unknownTime]);

  function nextStep() {
    if (currentStep < TOTAL_STEPS - 1 && stepValid[currentStep]) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {/* Step slides */}
      <div className="overflow-hidden">
        <div
          className="step-container"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {/* Step 0: Birth Date + Time — Calendar Popup */}
          <div className="step-content px-1">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-text-primary text-center font-[family-name:var(--font-heading)]">
                {t("step1Title")}
              </h3>
              <CalendarPopup
                year={year}
                month={month}
                day={day}
                birthTime={birthTime}
                unknownTime={unknownTime}
                onDateSelect={(y, m, d) => {
                  setYear(y);
                  setMonth(m);
                  setDay(d);
                }}
                onTimeChange={(time) => setBirthTime(time)}
                onUnknownTimeChange={(unknown) => setUnknownTime(unknown)}
                placeholder={t("birthTimePlaceholder")}
                locale={locale}
              />
              {errors.birthDate && <p className="text-xs text-red-400 text-center">{errors.birthDate}</p>}
              {yearAnimal && (
                <p className="text-xs text-text-muted text-center animate-fade-in">
                  {yearAnimal.icon} {t("yearInsight", { animal: yearAnimal.displayName })}
                </p>
              )}
              {timeAnimal && (
                <div className="flex items-center justify-center gap-2 text-xs text-text-muted animate-fade-in">
                  <AnimalIcon animal={timeAnimal.id} size={18} />
                  <span>{t("timeInsight", { animal: timeAnimal.displayName, hanja: timeAnimal.hanja })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 1: Gender + Submit */}
          <div className="step-content px-1">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-text-primary text-center font-[family-name:var(--font-heading)]">
                {t("step3Title")}
              </h3>
              <div className="flex gap-2">
                {(["male", "female", "other"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      gender === g
                        ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                        : "bg-transparent border-white/[0.08] text-text-muted hover:border-white/[0.15]"
                    }`}
                  >
                    {t(g)}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="text-xs text-red-400">{errors.gender}</p>}

              {errors.form && (
                <p className="text-xs text-red-400 text-center">{errors.form}</p>
              )}

              <Button type="submit" size="lg" loading={loading} disabled={!stepValid[1]} className="btn-cta">
                {t("submit")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      {currentStep < TOTAL_STEPS - 1 && (
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("back")}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={nextStep}
            disabled={!stepValid[currentStep]}
            className="gap-1"
          >
            {t("next")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
      {currentStep === TOTAL_STEPS - 1 && (
        <div className="flex justify-start">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={prevStep}
            className="gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("back")}
          </Button>
        </div>
      )}
    </form>
  );
}
