import type { HeavenlyStem, Pillar, MajorCycle, FourPillars } from './types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, STEM_YINYANG } from './constants';
import { STEM_METAPHORS, BRANCH_ANIMALS } from './metaphors';

/**
 * Calculate Major Cycles (대운)
 *
 * Major cycles change every 10 years, starting from a calculated age.
 * The direction of progression (forward or backward through the 60-cycle)
 * depends on gender and the yin/yang of the year stem.
 *
 * Rules:
 * - Male + Yang year stem OR Female + Yin year stem → Forward (순행)
 * - Male + Yin year stem OR Female + Yang year stem → Backward (역행)
 */

function makePillar(stemIndex: number, branchIndex: number): Pillar {
  const stem = HEAVENLY_STEMS[((stemIndex % 10) + 10) % 10];
  const branch = EARTHLY_BRANCHES[((branchIndex % 12) + 12) % 12];

  return {
    stem,
    branch,
    stemElement: STEM_METAPHORS[stem].element,
    branchElement: BRANCH_ANIMALS[branch].element,
    yinYang: STEM_YINYANG[stem],
    metaphor: STEM_METAPHORS[stem].id,
    animal: BRANCH_ANIMALS[branch].id,
  };
}

/**
 * Determine whether cycles progress forward or backward
 */
function isForwardProgression(
  yearStem: HeavenlyStem,
  gender: 'male' | 'female' | 'other'
): boolean {
  const yearYinYang = STEM_YINYANG[yearStem];

  if (gender === 'other') {
    // Default to forward for non-binary
    return true;
  }

  // Male + Yang = forward, Male + Yin = backward
  // Female + Yin = forward, Female + Yang = backward
  if (gender === 'male') {
    return yearYinYang === 'yang';
  }
  return yearYinYang === 'yin';
}

/**
 * Calculate the starting age of the first major cycle
 *
 * Based on the distance (in months) from birth to the next/previous
 * seasonal transition point. Each 3 days of distance = 1 year of starting age.
 *
 * Simplified calculation: use month pillar index to approximate.
 * In full production, this would use exact solar term dates.
 */
function calculateStartAge(
  fourPillars: FourPillars,
  gender: 'male' | 'female' | 'other'
): number {
  const forward = isForwardProgression(fourPillars.year.stem, gender);

  // Simplified: use a common starting pattern
  // The starting age typically ranges from 1-9
  // Full implementation would compute from solar terms
  const monthStemIndex = HEAVENLY_STEMS.indexOf(fourPillars.month.stem);
  const monthBranchIndex = EARTHLY_BRANCHES.indexOf(fourPillars.month.branch);

  // Use a deterministic but varied calculation based on pillars
  const base = forward
    ? (monthStemIndex + monthBranchIndex) % 9
    : (10 - monthStemIndex + monthBranchIndex) % 9;

  // Starting age is typically 1-9, minimum 1
  return Math.max(1, base + 1);
}

/**
 * Calculate 8 major cycles (대운) spanning ~80 years
 *
 * @param fourPillars - The four pillars of destiny
 * @param gender - Gender for determining cycle direction
 * @returns Array of MajorCycle objects
 */
export function calculateMajorCycles(
  fourPillars: FourPillars,
  gender: 'male' | 'female' | 'other'
): MajorCycle[] {
  const forward = isForwardProgression(fourPillars.year.stem, gender);
  const startAge = calculateStartAge(fourPillars, gender);

  const monthStemIndex = HEAVENLY_STEMS.indexOf(fourPillars.month.stem);
  const monthBranchIndex = EARTHLY_BRANCHES.indexOf(fourPillars.month.branch);

  const cycles: MajorCycle[] = [];
  const direction = forward ? 1 : -1;
  const CYCLE_COUNT = 8;

  for (let i = 0; i < CYCLE_COUNT; i++) {
    const stemIdx = monthStemIndex + direction * (i + 1);
    const branchIdx = monthBranchIndex + direction * (i + 1);

    const pillar = makePillar(stemIdx, branchIdx);
    const cycleStartAge = startAge + i * 10;
    const cycleEndAge = cycleStartAge + 9;

    // Calculate a rating based on element harmony with day master
    const rating = calculateCycleRating(fourPillars.day, pillar);

    cycles.push({
      startAge: cycleStartAge,
      endAge: cycleEndAge,
      pillar,
      description: `interpretation.cycles.${pillar.metaphor}`,
      rating,
    });
  }

  return cycles;
}

/**
 * Calculate a fortune rating (1-5) for a cycle based on element interactions
 * with the day master pillar
 */
function calculateCycleRating(dayPillar: Pillar, cyclePillar: Pillar): 1 | 2 | 3 | 4 | 5 {
  const dayElement = dayPillar.stemElement;
  const cycleElement = cyclePillar.stemElement;

  // Generating cycle (생): element that feeds day master
  const generatingMap: Record<string, string> = {
    wood: 'fire',   // wood feeds fire
    fire: 'earth',  // fire creates earth
    earth: 'metal', // earth produces metal
    metal: 'water', // metal generates water
    water: 'wood',  // water nurtures wood
  };

  // Same element: moderate harmony
  if (dayElement === cycleElement) {
    return 3;
  }

  // Generating for day master: very favorable
  if (generatingMap[cycleElement] === dayElement) {
    return 5;
  }

  // Day master generates cycle element: gives energy away, somewhat challenging
  if (generatingMap[dayElement] === cycleElement) {
    return 2;
  }

  // Controlling cycle (극): element that controls day master
  const controllingMap: Record<string, string> = {
    wood: 'earth',  // wood controls earth
    fire: 'metal',  // fire controls metal
    earth: 'water', // earth controls water
    metal: 'wood',  // metal controls wood
    water: 'fire',  // water controls fire
  };

  // Cycle controls day master: challenging period
  if (controllingMap[cycleElement] === dayElement) {
    return 1;
  }

  // Day master controls cycle: empowering period
  if (controllingMap[dayElement] === cycleElement) {
    return 4;
  }

  return 3;
}
