import KoreanLunarCalendar from 'korean-lunar-calendar';

interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

/**
 * Convert solar date to lunar date
 * Uses korean-lunar-calendar library
 */
export function solarToLunar(year: number, month: number, day: number): LunarDate {
  const calendar = new KoreanLunarCalendar();
  calendar.setSolarDate(year, month, day);

  return {
    year: calendar.getLunarCalendar().year,
    month: calendar.getLunarCalendar().month,
    day: calendar.getLunarCalendar().day,
    isLeapMonth: calendar.getLunarCalendar().intercalation ?? false,
  };
}

/**
 * Parse birth date string into components
 */
export function parseBirthDate(birthDate: string): { year: number; month: number; day: number } {
  const [year, month, day] = birthDate.split('-').map(Number);
  return { year, month, day };
}

/**
 * Parse birth time string "HH:MM" into hour
 */
export function parseBirthTime(birthTime: string | null): number | null {
  if (!birthTime) return null;
  const [hours] = birthTime.split(':').map(Number);
  return hours;
}

/**
 * Calculate the number of days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}
