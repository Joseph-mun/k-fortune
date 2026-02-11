"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { StepProgress } from "./StepProgress";
import { useReadingStore } from "@/stores/useReadingStore";
import { calculateYearPillar } from "@/lib/saju/pillars";
import { BRANCH_ANIMALS } from "@/lib/saju/metaphors";
import { TIME_TO_BRANCH } from "@/lib/saju/constants";
import { AnimalIcon } from "@/components/icons/AnimalIcon";

const TOTAL_STEPS = 3;

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

const TIME_SLOTS = [
  { value: "00:00", label: "23:00 – 01:00", labelKo: "자시 (子時) 23:00–01:00" },
  { value: "02:00", label: "01:00 – 03:00", labelKo: "축시 (丑時) 01:00–03:00" },
  { value: "04:00", label: "03:00 – 05:00", labelKo: "인시 (寅時) 03:00–05:00" },
  { value: "06:00", label: "05:00 – 07:00", labelKo: "묘시 (卯時) 05:00–07:00" },
  { value: "08:00", label: "07:00 – 09:00", labelKo: "진시 (辰時) 07:00–09:00" },
  { value: "10:00", label: "09:00 – 11:00", labelKo: "사시 (巳時) 09:00–11:00" },
  { value: "12:00", label: "11:00 – 13:00", labelKo: "오시 (午時) 11:00–13:00" },
  { value: "14:00", label: "13:00 – 15:00", labelKo: "미시 (未時) 13:00–15:00" },
  { value: "16:00", label: "15:00 – 17:00", labelKo: "신시 (申時) 15:00–17:00" },
  { value: "18:00", label: "17:00 – 19:00", labelKo: "유시 (酉時) 17:00–19:00" },
  { value: "20:00", label: "19:00 – 21:00", labelKo: "술시 (戌時) 19:00–21:00" },
  { value: "22:00", label: "21:00 – 23:00", labelKo: "해시 (亥時) 21:00–23:00" },
];

const selectClass =
  "w-full rounded-lg bg-bg-surface border border-white/[0.08] px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200 appearance-none cursor-pointer";

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
    !!year && !!month && !!day,
    unknownTime || !!birthTime,
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
          {/* Step 0: Birth Date — select dropdowns */}
          <div className="step-content px-1">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-text-primary text-center font-[family-name:var(--font-heading)]">
                {t("step1Title")}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">{t("year")}</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">{t("month")}</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">{t("day")}</option>
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.birthDate && <p className="text-xs text-red-400 text-center">{errors.birthDate}</p>}
              {yearAnimal && (
                <p className="text-xs text-text-muted text-center animate-fade-in">
                  {yearAnimal.icon} {t("yearInsight", { animal: yearAnimal.displayName })}
                </p>
              )}
            </div>
          </div>

          {/* Step 1: Birth Time — select from 12 time slots */}
          <div className="step-content px-1">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-text-primary text-center font-[family-name:var(--font-heading)]">
                {t("step2Title")}
              </h3>
              {!unknownTime && (
                <select
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("birthTimePlaceholder")}</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {locale === "ko" ? slot.labelKo : slot.label}
                    </option>
                  ))}
                </select>
              )}
              {timeAnimal && (
                <div className="flex items-center justify-center gap-2 text-xs text-text-muted animate-fade-in">
                  <AnimalIcon animal={timeAnimal.id} size={18} />
                  <span>{t("timeInsight", { animal: timeAnimal.displayName, hanja: timeAnimal.hanja })}</span>
                </div>
              )}
              <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                  className="rounded border-white/10 bg-bg-surface accent-purple-500"
                />
                {t("birthTimeUnknown")}
              </label>
            </div>
          </div>

          {/* Step 2: Gender + Submit */}
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

              <Button type="submit" size="lg" loading={loading} disabled={!stepValid[2]}>
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
