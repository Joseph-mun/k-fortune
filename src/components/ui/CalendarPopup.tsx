"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

interface CalendarPopupProps {
  year: string;
  month: string;
  day: string;
  birthTime: string;
  unknownTime: boolean;
  onDateSelect: (year: string, month: string, day: string) => void;
  onTimeChange: (time: string) => void;
  onUnknownTimeChange: (unknown: boolean) => void;
  placeholder?: string;
  locale?: string;
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* Saju 12 time periods (시주) — earthly branches mapped to zodiac animals */
const SAJU_PERIODS = [
  { emoji: "🐀", range: "23-01", mid: 0 },
  { emoji: "🐂", range: "01-03", mid: 2 },
  { emoji: "🐅", range: "03-05", mid: 4 },
  { emoji: "🐇", range: "05-07", mid: 6 },
  { emoji: "🐉", range: "07-09", mid: 8 },
  { emoji: "🐍", range: "09-11", mid: 10 },
  { emoji: "🐴", range: "11-13", mid: 12 },
  { emoji: "🐑", range: "13-15", mid: 14 },
  { emoji: "🐵", range: "15-17", mid: 16 },
  { emoji: "🐔", range: "17-19", mid: 18 },
  { emoji: "🐕", range: "19-21", mid: 20 },
  { emoji: "🐷", range: "21-23", mid: 22 },
];

function getSelectedPeriodIndex(hour: number): number {
  if (hour >= 23 || hour < 1) return 0;
  return Math.floor((hour + 1) / 2);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export function CalendarPopup({
  year,
  month,
  day,
  birthTime,
  unknownTime,
  onDateSelect,
  onTimeChange,
  onUnknownTimeChange,
}: CalendarPopupProps) {
  const t = useTranslations("form.calendar");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  const now = new Date();
  const currentYear = now.getFullYear();

  const [viewYear, setViewYear] = useState(year ? Number(year) : currentYear - 30);
  const [viewMonth, setViewMonth] = useState(month ? Number(month) : now.getMonth() + 1);
  const [mode, setMode] = useState<"calendar" | "year" | "time">("calendar");

  const timeHour = birthTime ? parseInt(birthTime.split(":")[0], 10) : 9;
  const selectedPeriod = getSelectedPeriodIndex(timeHour);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (year) setViewYear(Number(year));
    if (month) setViewMonth(Number(month));
  }, [year, month]);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        popupRef.current && !popupRef.current.contains(target)
      ) {
        setOpen(false);
        setMode("calendar");
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = useCallback(() => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }, [viewMonth]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }, [viewMonth]);

  function selectDay(d: number) {
    onDateSelect(String(viewYear), String(viewMonth), String(d));
  }

  function selectYear(y: number) {
    setViewYear(y);
    setMode("calendar");
  }

  function selectPeriod(index: number) {
    const period = SAJU_PERIODS[index];
    onTimeChange(`${String(period.mid).padStart(2, "0")}:00`);
    setMode("calendar");
  }

  const isSelected = (d: number) =>
    Number(year) === viewYear && Number(month) === viewMonth && Number(day) === d;

  const isFuture = (d: number) => {
    const check = new Date(viewYear, viewMonth - 1, d);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return check > today;
  };

  const displayValue =
    year && month && day
      ? `${year}. ${month.padStart(2, "0")}. ${day.padStart(2, "0")}` +
        (!unknownTime && birthTime
          ? ` ${SAJU_PERIODS[selectedPeriod].emoji} ${SAJU_PERIODS[selectedPeriod].range}`
          : "")
      : "";

  const yearStart = Math.floor(viewYear / 12) * 12;
  const yearRange = Array.from({ length: 12 }, (_, i) => yearStart + i);

  const calendarPanel = (
    <div
      ref={popupRef}
      className="fixed z-[9999] animate-scale-in origin-top"
      style={{
        top: popupPos.top,
        left: popupPos.left,
        transform: "translateX(-50%)",
      }}
    >
      <div className="rounded-2xl bg-bg-card border border-white/[0.08] p-4 w-[min(340px,calc(100vw-2rem))] shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {mode === "calendar" ? (
          <>
            {/* Month/Year header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setMode("year")}
                className="flex items-center gap-1 text-sm font-semibold text-purple-400 hover:opacity-80 transition-opacity cursor-pointer"
              >
                {MONTHS_EN[viewMonth - 1]} {viewYear}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1">
                <button type="button" onClick={prevMonth} className="p-2 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer">
                  <ChevronLeft className="w-5 h-5 text-purple-400" />
                </button>
                <button type="button" onClick={nextMonth} className="p-2 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer">
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[11px] font-medium text-text-muted tracking-wider py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`e-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1;
                const future = isFuture(d);
                const selected = isSelected(d);
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={future}
                    onClick={() => selectDay(d)}
                    className={`
                      aspect-square flex items-center justify-center rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer
                      ${future ? "text-text-muted/30 cursor-not-allowed" : "hover:bg-white/[0.08] text-purple-400"}
                      ${selected ? "!bg-purple-500 !text-white" : ""}
                    `}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.08] my-3" />

            {/* Time section */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">{t("time")}</span>
              <div className="flex items-center gap-2">
                {!unknownTime && (
                  <button
                    type="button"
                    onClick={() => setMode("time")}
                    className="flex items-center gap-1.5 bg-bg-surface rounded-lg px-3 py-1.5 hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <span className="text-base leading-none">{SAJU_PERIODS[selectedPeriod].emoji}</span>
                    <span className="text-sm font-semibold text-purple-400">{SAJU_PERIODS[selectedPeriod].range}</span>
                  </button>
                )}
                <div className="flex bg-bg-surface rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      onUnknownTimeChange(false);
                      if (!birthTime) setMode("time");
                    }}
                    className={`px-2 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${!unknownTime ? "bg-purple-500/40 text-text-primary" : "text-text-muted hover:text-text-primary"}`}
                  >
                    {t("timeOn")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onUnknownTimeChange(true)}
                    className={`px-2 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${unknownTime ? "bg-purple-500/40 text-text-primary" : "text-text-muted hover:text-text-primary"}`}
                  >
                    {t("timeOff")}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : mode === "time" ? (
          <>
            {/* Time period selector */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setMode("calendar")}
                className="flex items-center gap-1 text-sm font-semibold text-purple-400 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                {t("backToCalendar")}
              </button>
            </div>
            <p className="text-xs text-text-muted mb-3">{t("selectTimePeriod")}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {SAJU_PERIODS.map((period, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectPeriod(i)}
                  className={`
                    flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer
                    ${selectedPeriod === i
                      ? "bg-purple-500 text-white ring-1 ring-purple-400/50"
                      : "hover:bg-white/[0.08] text-purple-400 bg-bg-surface"
                    }
                  `}
                >
                  <span className="text-lg leading-none">{period.emoji}</span>
                  <span className={`text-[11px] ${selectedPeriod === i ? "text-white/90" : "text-text-secondary"}`}>
                    {period.range}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Year selector */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => setViewYear((y) => y - 12)} className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4 text-purple-400" />
              </button>
              <span className="text-sm font-semibold text-text-primary">
                {yearRange[0]} – {yearRange[yearRange.length - 1]}
              </span>
              <button type="button" onClick={() => setViewYear((y) => y + 12)} className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {yearRange.map((y) => (
                <button
                  key={y}
                  type="button"
                  disabled={y > currentYear}
                  onClick={() => selectYear(y)}
                  className={`
                    py-2 rounded-lg text-xs font-medium transition-all cursor-pointer
                    ${y > currentYear ? "text-text-muted/30 cursor-not-allowed" : "hover:bg-white/[0.08] text-purple-400"}
                    ${y === viewYear ? "!bg-purple-500 !text-white" : ""}
                  `}
                >
                  {y}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMode("calendar")}
              className="mt-3 w-full text-center text-sm text-purple-400 hover:opacity-80 transition-opacity cursor-pointer py-2"
            >
              {t("backToCalendar")}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 rounded-lg bg-bg-surface border border-white/[0.08] px-4 py-2.5 text-sm text-left transition-all duration-200 cursor-pointer hover:border-white/[0.15] focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20"
      >
        <Calendar className="w-4 h-4 text-text-muted shrink-0" />
        <span className={displayValue ? "text-text-primary" : "text-text-muted"}>
          {displayValue || t("selectDate")}
        </span>
      </button>

      {/* Calendar popup rendered via Portal to escape overflow-hidden */}
      {open && mounted && createPortal(calendarPanel, document.body)}
    </div>
  );
}
