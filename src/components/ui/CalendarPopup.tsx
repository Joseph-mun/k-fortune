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
  const [mode, setMode] = useState<"calendar" | "year">("calendar");

  const timeHour = birthTime ? parseInt(birthTime.split(":")[0], 10) : 9;
  const timeMin = birthTime ? parseInt(birthTime.split(":")[1], 10) : 41;
  const isAM = timeHour < 12;

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

  function toggleAMPM() {
    const h = timeHour >= 12 ? timeHour - 12 : timeHour + 12;
    onTimeChange(`${String(h).padStart(2, "0")}:${String(timeMin).padStart(2, "0")}`);
  }

  function setHour(h: number) {
    const clamped = Math.max(0, Math.min(23, h));
    onTimeChange(`${String(clamped).padStart(2, "0")}:${String(timeMin).padStart(2, "0")}`);
  }

  function setMinute(m: number) {
    const clamped = Math.max(0, Math.min(59, m));
    onTimeChange(`${String(timeHour).padStart(2, "0")}:${String(clamped).padStart(2, "0")}`);
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
        (!unknownTime && birthTime ? ` ${String(timeHour % 12 || 12).padStart(2, "0")}:${String(timeMin).padStart(2, "0")} ${isAM ? t("am") : t("pm")}` : "")
      : "";

  const yearStart = Math.floor(viewYear / 12) * 12;
  const yearRange = Array.from({ length: 12 }, (_, i) => yearStart + i);
  const display12Hour = timeHour % 12 || 12;

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
      <div className="rounded-2xl bg-bg-card border border-white/[0.08] p-5 w-[min(480px,calc(100vw-2rem))] shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {mode === "calendar" ? (
          <>
            {/* Month/Year header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setMode("year")}
                className="flex items-center gap-1 text-base font-semibold text-purple-400 hover:opacity-80 transition-opacity cursor-pointer"
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
                      aspect-square flex items-center justify-center rounded-full text-[15px] font-medium transition-all duration-150 cursor-pointer
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
            <div className="h-px bg-white/[0.08] my-4" />

            {/* Time section */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-text-primary">{t("time")}</span>
              <div className="flex items-center gap-3">
                {!unknownTime && (
                  <div className="flex items-center bg-bg-surface rounded-lg overflow-hidden">
                    <div className="flex items-center px-3 py-1.5">
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={display12Hour}
                        onChange={(e) => {
                          let v = parseInt(e.target.value, 10) || 0;
                          if (v > 12) v = 12;
                          if (v < 1) v = 1;
                          const h24 = isAM ? (v === 12 ? 0 : v) : (v === 12 ? 12 : v + 12);
                          setHour(h24);
                        }}
                        className="w-7 bg-transparent text-center text-lg font-semibold text-text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-lg font-semibold text-text-primary mx-0.5">:</span>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={String(timeMin).padStart(2, "0")}
                        onChange={(e) => {
                          let v = parseInt(e.target.value, 10) || 0;
                          if (v > 59) v = 59;
                          if (v < 0) v = 0;
                          setMinute(v);
                        }}
                        className="w-7 bg-transparent text-center text-lg font-semibold text-text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div className="flex border-l border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => { if (!isAM) toggleAMPM(); }}
                        className={`px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${isAM ? "bg-purple-500 text-white" : "text-text-muted hover:text-text-primary"}`}
                      >
                        {t("am")}
                      </button>
                      <button
                        type="button"
                        onClick={() => { if (isAM) toggleAMPM(); }}
                        className={`px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${!isAM ? "bg-purple-500 text-white" : "text-text-muted hover:text-text-primary"}`}
                      >
                        {t("pm")}
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex bg-bg-surface rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onUnknownTimeChange(false)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${!unknownTime ? "bg-purple-500/40 text-text-primary" : "text-text-muted hover:text-text-primary"}`}
                  >
                    {t("timeOn")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onUnknownTimeChange(true)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${unknownTime ? "bg-purple-500/40 text-text-primary" : "text-text-muted hover:text-text-primary"}`}
                  >
                    {t("timeOff")}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <button type="button" onClick={() => setViewYear((y) => y - 12)} className="p-2 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer">
                <ChevronLeft className="w-5 h-5 text-purple-400" />
              </button>
              <span className="text-base font-semibold text-text-primary">
                {yearRange[0]} – {yearRange[yearRange.length - 1]}
              </span>
              <button type="button" onClick={() => setViewYear((y) => y + 12)} className="p-2 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer">
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {yearRange.map((y) => (
                <button
                  key={y}
                  type="button"
                  disabled={y > currentYear}
                  onClick={() => selectYear(y)}
                  className={`
                    py-3 rounded-lg text-sm font-medium transition-all cursor-pointer
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
