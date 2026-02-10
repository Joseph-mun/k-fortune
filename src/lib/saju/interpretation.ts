import type { Element, StemMetaphor, LuckyInfo } from './types';
import { ELEMENT_LUCKY_COLORS, ELEMENT_LUCKY_NUMBERS, ELEMENT_DIRECTIONS } from './constants';

/**
 * Returns i18n key path for personality description
 * Frontend should resolve: t(`interpretation.personality.${metaphor}`)
 */
export function getPersonality(metaphor: StemMetaphor): string {
  return `interpretation.personality.${metaphor}`;
}

/**
 * Returns i18n key paths for strengths
 * Frontend should resolve each key in array
 */
export function getStrengths(element: Element): string[] {
  // Return i18n key path - frontend will resolve to array
  return [`interpretation.strengths.${element}.0`, `interpretation.strengths.${element}.1`, `interpretation.strengths.${element}.2`, `interpretation.strengths.${element}.3`];
}

/**
 * Returns i18n key paths for weaknesses
 * Frontend should resolve each key in array
 */
export function getWeaknesses(element: Element): string[] {
  // Return i18n key path - frontend will resolve to array
  const weaknessCount: Record<Element, number> = {
    wood: 2,
    fire: 2,
    earth: 2,
    metal: 2,
    water: 2,
  };

  const count = weaknessCount[element];
  return Array.from({ length: count }, (_, i) => `interpretation.weaknesses.${element}.${i}`);
}

/** Calculate Lucky Info based on lacking or weak element */
export function calculateLuckyInfo(
  dominantElement: Element,
  lackingElement: Element | null
): LuckyInfo {
  // Lucky is based on the element that balances you
  const balancingElement = lackingElement ?? getControllingElement(dominantElement);

  return {
    color: ELEMENT_LUCKY_COLORS[balancingElement],
    number: ELEMENT_LUCKY_NUMBERS[balancingElement],
    direction: ELEMENT_DIRECTIONS[balancingElement],
  };
}

/** Five Elements interaction: what controls the given element */
function getControllingElement(element: Element): Element {
  const controlCycle: Record<Element, Element> = {
    wood: 'metal',  // metal cuts wood
    fire: 'water',  // water extinguishes fire
    earth: 'wood',  // wood breaks earth
    metal: 'fire',  // fire melts metal
    water: 'earth', // earth absorbs water
  };
  return controlCycle[element];
}
