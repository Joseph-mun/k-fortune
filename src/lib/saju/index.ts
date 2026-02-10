import type { BasicReading, DetailedReading, BirthInput, HeavenlyStem, EarthlyBranch, Element, YinYang, StemMetaphor, BranchAnimal, MajorCycle } from './types';
import { parseBirthDate, parseBirthTime } from './calendar';
import { calculateFourPillars } from './pillars';
import { analyzeElements } from './elements';
import { getStemMetaphor, STEM_METAPHORS, BRANCH_ANIMALS } from './metaphors';
import { getPersonality, getStrengths, getWeaknesses, calculateLuckyInfo } from './interpretation';
import { calculateMajorCycles } from './cycles';

/**
 * Calculate a basic (free) reading from birth input
 */
export function calculateBasicReading(input: BirthInput): BasicReading {
  const { year, month, day } = parseBirthDate(input.birthDate);
  const birthHour = parseBirthTime(input.birthTime);

  const fourPillars = calculateFourPillars(year, month, day, birthHour);
  const elementAnalysis = analyzeElements(fourPillars);

  const dayMasterStem = fourPillars.day.stem;
  const metaphorInfo = getStemMetaphor(dayMasterStem);

  const id = `read_${Date.now().toString(36)}`;

  return {
    id,
    fourPillars,
    elementAnalysis,
    dayMaster: {
      element: metaphorInfo.element,
      yinYang: metaphorInfo.yinYang,
      metaphor: metaphorInfo.id,
      metaphorInfo,
      personality: getPersonality(metaphorInfo.id),
      strengths: getStrengths(metaphorInfo.element),
      weaknesses: getWeaknesses(metaphorInfo.element),
    },
    luckyInfo: calculateLuckyInfo(elementAnalysis.dominant, elementAnalysis.lacking),
  };
}

/**
 * Calculate a detailed (paid) reading from birth input
 * Extends BasicReading with career, relationship, health, wealth, yearly fortune, and major cycles
 *
 * TODO: Implement full interpretation logic for detailed readings
 * - Career analysis based on day master and element balance
 * - Relationship compatibility patterns
 * - Health indicators from elements
 * - Wealth flow analysis
 * - Yearly fortune for current year
 * - Major cycles (대운) calculation
 */
export function calculateDetailedReading(input: BirthInput): DetailedReading {
  const basicReading = calculateBasicReading(input);

  // Calculate real major cycles using the cycles module
  const majorCycles = calculateMajorCycles(basicReading.fourPillars, input.gender);

  return {
    ...basicReading,
    career: `interpretation.career.${basicReading.dayMaster.metaphor}`,
    relationship: `interpretation.relationship.${basicReading.dayMaster.metaphor}`,
    health: `interpretation.health.${basicReading.dayMaster.element}`,
    wealth: `interpretation.wealth.${basicReading.elementAnalysis.dominant}`,
    yearlyFortune: `interpretation.yearly.${new Date().getFullYear()}`,
    advice: `interpretation.advice.${basicReading.dayMaster.metaphor}`,
    majorCycles,
  };
}

/**
 * Reconstruct API response data into component-compatible BasicReading type
 * Used when reading data from storage/API that may not have full Pillar objects
 */
export function reconstructReading(data: any): BasicReading {
  function reconstructPillar(p: {
    metaphor: string;
    animal: string;
    element: string;
    yinYang: string;
    display: { stemName: string; stemIcon: string; animalName: string; animalIcon: string }
  }) {
    const stemEntry = Object.entries(STEM_METAPHORS).find(([, v]) => v.id === p.metaphor);
    const branchEntry = Object.entries(BRANCH_ANIMALS).find(([, v]) => v.id === p.animal);

    return {
      stem: (stemEntry?.[0] ?? '병') as HeavenlyStem,
      branch: (branchEntry?.[0] ?? '오') as EarthlyBranch,
      stemElement: p.element as Element,
      branchElement: (branchEntry?.[1]?.element ?? p.element) as Element,
      yinYang: p.yinYang as YinYang,
      metaphor: p.metaphor as StemMetaphor,
      animal: p.animal as BranchAnimal,
    };
  }

  const fourPillars = {
    year: reconstructPillar(data.fourPillars.year),
    month: reconstructPillar(data.fourPillars.month),
    day: reconstructPillar(data.fourPillars.day),
    hour: reconstructPillar(data.fourPillars.hour),
  };

  const dayMasterStem = Object.entries(STEM_METAPHORS).find(
    ([, v]) => v.id === data.dayMaster.metaphor
  );
  const metaphorInfo = dayMasterStem ? STEM_METAPHORS[dayMasterStem[0] as HeavenlyStem] : STEM_METAPHORS['병'];

  return {
    id: data.id,
    fourPillars,
    elementAnalysis: data.elementAnalysis as BasicReading["elementAnalysis"],
    dayMaster: {
      element: data.dayMaster.element as Element,
      yinYang: data.dayMaster.yinYang as YinYang,
      metaphor: data.dayMaster.metaphor as StemMetaphor,
      metaphorInfo,
      personality: data.dayMaster.personality,
      strengths: data.dayMaster.strengths,
      weaknesses: data.dayMaster.weaknesses,
    },
    luckyInfo: data.luckyInfo,
  };
}

// Re-export types
export type { BasicReading, DetailedReading, BirthInput, FourPillars, Pillar, ElementAnalysis, MajorCycle } from './types';
export type { StemMetaphor, StemMetaphorInfo, BranchAnimal } from './types';
