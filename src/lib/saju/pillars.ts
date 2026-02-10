import type { HeavenlyStem, EarthlyBranch, Pillar } from './types';
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENTS,
  STEM_YINYANG,
  BRANCH_ELEMENTS,
  YEAR_STEM_TO_MONTH_STEM_START,
  DAY_STEM_TO_HOUR_STEM_START,
  TIME_TO_BRANCH,
  REFERENCE_DATE,
  REFERENCE_DAY_STEM_INDEX,
  REFERENCE_DAY_BRANCH_INDEX,
} from './constants';
import { STEM_METAPHORS } from './metaphors';
import { BRANCH_ANIMALS } from './metaphors';
import { solarToLunar, daysBetween } from './calendar';

function makePillar(stem: HeavenlyStem, branch: EarthlyBranch): Pillar {
  return {
    stem,
    branch,
    stemElement: STEM_ELEMENTS[stem],
    branchElement: BRANCH_ELEMENTS[branch],
    yinYang: STEM_YINYANG[stem],
    metaphor: STEM_METAPHORS[stem].id,
    animal: BRANCH_ANIMALS[branch].id,
  };
}

/**
 * Calculate Year Pillar (년주)
 * Based on lunar year: (year - 4) % 60 → sexagenary index
 */
export function calculateYearPillar(lunarYear: number): Pillar {
  const index = ((lunarYear - 4) % 60 + 60) % 60;
  const stem = HEAVENLY_STEMS[index % 10];
  const branch = EARTHLY_BRANCHES[index % 12];
  return makePillar(stem, branch);
}

/**
 * Calculate Month Pillar (월주)
 * Year stem determines the starting stem for months
 * Lunar month 1 = 인(Tiger), month 2 = 묘(Rabbit), etc.
 */
export function calculateMonthPillar(yearStem: HeavenlyStem, lunarMonth: number): Pillar {
  const startStemIndex = YEAR_STEM_TO_MONTH_STEM_START[yearStem];
  // Month 1 starts at 인(index 2), month adjusts from there
  const monthOffset = lunarMonth - 1;
  const stemIndex = (startStemIndex + monthOffset) % 10;
  const branchIndex = (2 + monthOffset) % 12; // 인=2 is the starting branch for month 1

  return makePillar(HEAVENLY_STEMS[stemIndex], EARTHLY_BRANCHES[branchIndex]);
}

/**
 * Calculate Day Pillar (일주)
 * Uses reference date method: count days from a known reference point
 * Reference: 1900-01-01 = 갑자일
 */
export function calculateDayPillar(year: number, month: number, day: number): Pillar {
  const targetDate = new Date(year, month - 1, day);
  const days = daysBetween(REFERENCE_DATE, targetDate);

  const stemIndex = ((REFERENCE_DAY_STEM_INDEX + days) % 10 + 10) % 10;
  const branchIndex = ((REFERENCE_DAY_BRANCH_INDEX + days) % 12 + 12) % 12;

  return makePillar(HEAVENLY_STEMS[stemIndex], EARTHLY_BRANCHES[branchIndex]);
}

/**
 * Calculate Hour Pillar (시주)
 * Day stem determines the starting stem for hours
 * Birth hour maps to one of 12 branches (2-hour intervals)
 */
export function calculateHourPillar(dayStem: HeavenlyStem, birthHour: number | null): Pillar {
  // Default to 午 (horse, 11:00-13:00) if birth time unknown
  if (birthHour === null) {
    birthHour = 12;
  }

  // Find the branch for this hour
  let branchIndex = 0;
  for (const timeSlot of TIME_TO_BRANCH) {
    if (timeSlot.start === 23) {
      // Special case: 子시 spans midnight (23:00-01:00)
      if (birthHour >= 23 || birthHour < 1) {
        branchIndex = EARTHLY_BRANCHES.indexOf(timeSlot.branch);
        break;
      }
    } else if (birthHour >= timeSlot.start && birthHour < timeSlot.end) {
      branchIndex = EARTHLY_BRANCHES.indexOf(timeSlot.branch);
      break;
    }
  }

  const startStemIndex = DAY_STEM_TO_HOUR_STEM_START[dayStem];
  const stemIndex = (startStemIndex + branchIndex) % 10;

  return makePillar(HEAVENLY_STEMS[stemIndex], EARTHLY_BRANCHES[branchIndex]);
}

/**
 * Calculate all Four Pillars from birth info
 */
export function calculateFourPillars(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  birthHour: number | null
) {
  const lunar = solarToLunar(solarYear, solarMonth, solarDay);

  const yearPillar = calculateYearPillar(lunar.year);
  const monthPillar = calculateMonthPillar(yearPillar.stem, lunar.month);
  const dayPillar = calculateDayPillar(solarYear, solarMonth, solarDay);
  const hourPillar = calculateHourPillar(dayPillar.stem, birthHour);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };
}
