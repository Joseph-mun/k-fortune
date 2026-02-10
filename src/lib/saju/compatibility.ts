import type { BasicReading, CompatibilityReading, Element, BirthInput } from './types';
import { calculateBasicReading } from './index';

/**
 * Five Elements compatibility analysis
 *
 * Generating cycle (상생): Wood->Fire->Earth->Metal->Water->Wood
 * Controlling cycle (상극): Wood->Earth->Water->Fire->Metal->Wood
 */

const GENERATING_CYCLE: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

const CONTROLLING_CYCLE: Record<Element, Element> = {
  wood: 'earth',
  fire: 'metal',
  earth: 'water',
  metal: 'wood',
  water: 'fire',
};

/**
 * Calculate element harmony score between two elements
 * Returns 0-100 score
 */
function elementHarmony(el1: Element, el2: Element): number {
  // Same element: moderate (similar energies can clash or harmonize)
  if (el1 === el2) return 70;

  // Generating relationship: very favorable
  if (GENERATING_CYCLE[el1] === el2 || GENERATING_CYCLE[el2] === el1) return 90;

  // Controlling relationship: challenging
  if (CONTROLLING_CYCLE[el1] === el2 || CONTROLLING_CYCLE[el2] === el1) return 40;

  // No direct relationship: neutral
  return 60;
}

/**
 * Calculate romance compatibility
 * Based on day master elements and their interaction
 */
function calculateRomance(person1: BasicReading, person2: BasicReading): number {
  const dayHarmony = elementHarmony(
    person1.dayMaster.element,
    person2.dayMaster.element
  );

  // Check if yin-yang complement (opposite attracts in romance)
  const yinYangBonus =
    person1.dayMaster.yinYang !== person2.dayMaster.yinYang ? 10 : -5;

  return Math.min(100, Math.max(0, dayHarmony + yinYangBonus));
}

/**
 * Calculate communication compatibility
 * Based on month pillars (social expression) and element balance
 */
function calculateCommunication(person1: BasicReading, person2: BasicReading): number {
  const monthHarmony = elementHarmony(
    person1.fourPillars.month.stemElement,
    person2.fourPillars.month.stemElement
  );

  // Check dominant element compatibility
  const dominantHarmony = elementHarmony(
    person1.elementAnalysis.dominant,
    person2.elementAnalysis.dominant
  );

  return Math.round((monthHarmony + dominantHarmony) / 2);
}

/**
 * Calculate values compatibility
 * Based on year pillars (upbringing, values) and element balance
 */
function calculateValues(person1: BasicReading, person2: BasicReading): number {
  const yearHarmony = elementHarmony(
    person1.fourPillars.year.stemElement,
    person2.fourPillars.year.stemElement
  );

  // Check if lacking elements complement each other
  const complementBonus =
    person1.elementAnalysis.lacking &&
    person2.elementAnalysis.dominant === person1.elementAnalysis.lacking
      ? 10
      : 0;

  const complementBonus2 =
    person2.elementAnalysis.lacking &&
    person1.elementAnalysis.dominant === person2.elementAnalysis.lacking
      ? 10
      : 0;

  return Math.min(100, yearHarmony + complementBonus + complementBonus2);
}

/**
 * Calculate lifestyle compatibility
 * Based on hour pillars (inner self, aspirations) and overall element balance
 */
function calculateLifestyle(person1: BasicReading, person2: BasicReading): number {
  const hourHarmony = elementHarmony(
    person1.fourPillars.hour.stemElement,
    person2.fourPillars.hour.stemElement
  );

  // Calculate how well their element distributions complement
  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  let balanceDiff = 0;
  for (const el of elements) {
    balanceDiff += Math.abs(
      person1.elementAnalysis[el] - person2.elementAnalysis[el]
    );
  }
  // Lower difference = better balance compatibility
  const balanceScore = Math.max(0, 100 - balanceDiff);

  return Math.round((hourHarmony + balanceScore) / 2);
}

/**
 * Calculate full compatibility reading between two people
 */
export function calculateCompatibility(
  input1: BirthInput,
  input2: BirthInput
): CompatibilityReading {
  const person1 = calculateBasicReading(input1);
  const person2 = calculateBasicReading(input2);

  const romance = calculateRomance(person1, person2);
  const communication = calculateCommunication(person1, person2);
  const values = calculateValues(person1, person2);
  const lifestyle = calculateLifestyle(person1, person2);

  const overallScore = Math.round(
    romance * 0.35 + communication * 0.25 + values * 0.2 + lifestyle * 0.2
  );

  return {
    person1,
    person2,
    overallScore,
    categories: {
      romance,
      communication,
      values,
      lifestyle,
    },
    analysis: `interpretation.compatibility.analysis.${getHarmonyLevel(overallScore)}`,
    advice: `interpretation.compatibility.advice.${getHarmonyLevel(overallScore)}`,
  };
}

function getHarmonyLevel(score: number): string {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'moderate';
  if (score >= 30) return 'challenging';
  return 'difficult';
}
