"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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

/* Saju 12 time periods (시주) — earthly branches mapped to zodiac animals */
const SAJU_PERIODS = [
  { emoji: "🐀", start: 23, end: 1, mid: 0 },
  { emoji: "🐂", start: 1, end: 3, mid: 2 },
  { emoji: "🐅", start: 3, end: 5, mid: 4 },
  { emoji: "🐇", start: 5, end: 7, mid: 6 },
  { emoji: "🐉", start: 7, end: 9, mid: 8 },
  { emoji: "🐍", start: 9, end: 11, mid: 10 },
  { emoji: "🐴", start: 11, end: 13, mid: 12 },
  { emoji: "🐑", start: 13, end: 15, mid: 14 },
  { emoji: "🐵", start: 15, end: 17, mid: 16 },
  { emoji: "🐔", start: 17, end: 19, mid: 18 },
  { emoji: "🐕", start: 19, end: 21, mid: 20 },
  { emoji: "🐷", start: 21, end: 23, mid: 22 },
];

/** Format a single hour for display */
function fmtHour(h: number, locale: string): string {
  const h24 = ((h % 24) + 24) % 24;
  if (locale === "ko") {
    const period = h24 < 12 ? "오전" : "오후";
    const display = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
    return `${period} ${display}시`;
  }
  const period = h24 < 12 ? "AM" : "PM";
  const display = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${display}${period}`;
}

/** Compact format for grid cells */
function fmtHourShort(h: number, locale: string): string {
  const h24 = ((h % 24) + 24) % 24;
  if (locale === "ko") {
    const period = h24 < 12 ? "오전" : "오후";
    const display = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
    return `${period}${display}`;
  }
  const period = h24 < 12 ? "a" : "p";
  const display = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${display}${period}`;
}

/** Format time range for display */
function formatTimeRange(start: number, end: number, locale: string): string {
  return `${fmtHour(start, locale)}~${fmtHour(end, locale)}`;
}

/** Compact time range for grid */
function formatTimeRangeShort(start: number, end: number, locale: string): string {
  return `${fmtHourShort(start, locale)}~${fmtHourShort(end, locale)}`;
}

/** Get localized month name using Intl API */
function getMonthName(monthIndex: number, locale: string, style: "long" | "short" = "long"): string {
  return new Intl.DateTimeFormat(locale, { month: style }).format(new Date(2000, monthIndex));
}

/** Get localized weekday names using Intl API */
function getWeekdayNames(locale: string): string[] {
  const base = new Date(2024, 0, 7); // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d);
  });
}

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
  locale = "en",
}: CalendarPopupProps) {
  const t = useTranslations("form.calendar");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  const now = new Date();
  const currentYear = now.getFullYear();

  const [viewYear, setViewYear] = useState(year ? Number(year) : 1995);
  const [viewMonth, setViewMonth] = useState(month ? Number(month) : 3);
  const [mode, setMode] = useState<"calendar" | "year" | "month" | "time">("calendar");

  const timeHour = birthTime ? parseInt(birthTime.split(":")[0], 10) : 9;
  const selectedPeriod = getSelectedPeriodIndex(timeHour);

  const weekdays = useMemo(() => getWeekdayNames(locale), [locale]);

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
    setMode("month");
  }

  function selectMonth(m: number) {
    setViewMonth(m);
    setMode("calendar");
  }

  function selectPeriod(index: number) {
    const period = SAJU_PERIODS[index];
    onTimeChange(`${String(period.mid).padStart(2, "0")}:00`);
    setMode("calendar");
  }

  const isSelected = (d: number) =>
    Number(year) === viewYear && Number(month) === viewMonth && Number(day) === d;

  const isToday = (d: number) =>
    currentYear === viewYear && (now.getMonth() + 1) === viewMonth && now.getDate() === d;

  const isFuture = (d: number) => {
    const check = new Date(viewYear, viewMonth - 1, d);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return check > today;
  };

  const period = SAJU_PERIODS[selectedPeriod];
  const displayValue =
    year && month && day
      ? `${year}. ${month.padStart(2, "0")}. ${day.padStart(2, "0")}` +
        (!unknownTime && birthTime
          ? `  ${period.emoji} ${formatTimeRange(period.start, period.end, locale)}`
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
      <div className="rounded-2xl bg-zinc-900 border border-white/[0.08] p-4 w-[min(340px,calc(100vw-2rem))] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
        {mode === "calendar" ? (
          <>
            {/* Month/Year header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setMode("year")}
                className="flex items-center gap-1 text-sm font-semibold text-purple-400 hover:opacity-80 transition-opacity cursor-pointer"
              >
                {locale === "ko"
                  ? `${viewYear}년 ${viewMonth}월`
                  : `${getMonthName(viewMonth - 1, locale)} ${viewYear}`}
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
              {weekdays.map((d) => (
                <div key={d} className="text-center text-[11px] font-medium text-zinc-400 tracking-wider py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-0.5" role="grid">
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`e-${i}`} className="min-w-[44px] min-h-[44px]" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1;
                const future = isFuture(d);
                const selected = isSelected(d);
                const today = isToday(d);
                const dateLabel = locale === "ko"
                  ? `${viewYear}년 ${viewMonth}월 ${d}일`
                  : `${getMonthName(viewMonth - 1, locale)} ${d}, ${viewYear}`;
                return (
                  <button
                    key={d}
                    type="button"
                    role="gridcell"
                    aria-label={dateLabel}
                    aria-selected={selected}
                    disabled={future}
                    onClick={() => selectDay(d)}
                    className={`
                      min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer
                      ${future ? "text-text-muted/30 cursor-not-allowed" : "hover:bg-purple-500/10 text-white"}
                      ${selected ? "!bg-purple-500 !text-white" : ""}
                      ${today && !selected ? "border border-purple-500/30" : ""}
                    `}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] my-3" />

            {/* Time section */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{t("time")}</span>
              <div className="flex items-center gap-2">
                {!unknownTime && (
                  <button
                    type="button"
                    onClick={() => setMode("time")}
                    className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg px-3 py-1.5 hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <span className="text-base leading-none">{SAJU_PERIODS[selectedPeriod].emoji}</span>
                    <span className="text-sm font-semibold text-purple-400">
                      {formatTimeRange(SAJU_PERIODS[selectedPeriod].start, SAJU_PERIODS[selectedPeriod].end, locale)}
                    </span>
                  </button>
                )}
                <div className="flex bg-white/[0.04] rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      onUnknownTimeChange(false);
                      if (!birthTime) setMode("time");
                    }}
                    className={`px-2 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${!unknownTime ? "bg-purple-500/40 text-white" : "text-zinc-400 hover:text-white"}`}
                  >
                    {t("timeOn")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onUnknownTimeChange(true)}
                    className={`px-2 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${unknownTime ? "bg-purple-500/40 text-white" : "text-zinc-400 hover:text-white"}`}
                    title={locale === "ko" ? "시간을 모르면 시주(時柱)가 제외됩니다" : "If you don't know the time, the hour pillar will be excluded"}
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
            <p className="text-xs text-zinc-400 mb-3">{t("selectTimePeriod")}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {SAJU_PERIODS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectPeriod(i)}
                  className={`
                    flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer
                    ${selectedPeriod === i
                      ? "bg-purple-500 text-white ring-1 ring-purple-400/50"
                      : "hover:bg-white/[0.08] text-purple-400 bg-white/[0.04]"
                    }
                  `}
                >
                  <span className="text-lg leading-none">{p.emoji}</span>
                  <span className={`text-[10px] leading-tight ${selectedPeriod === i ? "text-white/90" : "text-zinc-400"}`}>
                    {formatTimeRangeShort(p.start, p.end, locale)}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : mode === "month" ? (
          <>
            {/* Month selector grid */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setMode("year")}
                className="flex items-center gap-1 text-sm font-semibold text-purple-400 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                {viewYear}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 12 }, (_, i) => {
                const m = i + 1;
                const isFutureMonth = viewYear === currentYear && m > now.getMonth() + 1;
                return (
                  <button
                    key={m}
                    type="button"
                    disabled={isFutureMonth}
                    onClick={() => selectMonth(m)}
                    className={`
                      py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                      ${isFutureMonth ? "text-zinc-400/30 cursor-not-allowed" : "hover:bg-white/[0.08] text-white"}
                      ${m === viewMonth ? "!bg-purple-500 !text-white" : ""}
                    `}
                  >
                    {getMonthName(i, locale, "short")}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setMode("calendar")}
              className="mt-3 w-full text-center text-sm text-[#C5372E] hover:opacity-80 transition-opacity cursor-pointer py-2"
            >
              {t("backToCalendar")}
            </button>
          </>
        ) : (
          <>
            {/* Year selector */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => setViewYear((y) => y - 12)} className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4 text-purple-400" />
              </button>
              <span className="text-sm font-semibold text-white">
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
                    ${y > currentYear ? "text-zinc-400/30 cursor-not-allowed" : "hover:bg-white/[0.08] text-purple-400"}
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
              className="mt-3 w-full text-center text-sm text-[#C5372E] hover:opacity-80 transition-opacity cursor-pointer py-2"
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
        className="w-full flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-left transition-all duration-200 cursor-pointer hover:border-purple-500/30 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/30"
      >
        <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
        <span className={displayValue ? "text-white" : "text-zinc-400"}>
          {displayValue || t("selectDate")}
        </span>
      </button>

      {/* Calendar popup rendered via Portal to escape overflow-hidden */}
      {open && mounted && createPortal(calendarPanel, document.body)}
    </div>
  );
}
