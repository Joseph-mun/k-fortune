import type { Element, FourPillars, ElementAnalysis } from './types';
import { HIDDEN_STEMS, STEM_ELEMENTS, BRANCH_ELEMENTS } from './constants';

/**
 * Analyze Five Elements distribution from Four Pillars
 * Considers both main stems/branches and hidden stems (장간)
 */
export function analyzeElements(fourPillars: FourPillars): ElementAnalysis {
  const counts: Record<Element, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  const pillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour];

  for (const pillar of pillars) {
    // Count stem element (weight: 1.0)
    counts[pillar.stemElement] += 1.0;

    // Count branch element (weight: 0.7)
    counts[pillar.branchElement] += 0.7;

    // Count hidden stems (weight: 0.3 each)
    const hiddenStems = HIDDEN_STEMS[pillar.branch];
    for (const hidden of hiddenStems) {
      counts[STEM_ELEMENTS[hidden]] += 0.3;
    }
  }

  // Calculate percentages
  const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
  const percentages: Record<Element, number> = {
    wood: Math.round((counts.wood / total) * 100),
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    metal: Math.round((counts.metal / total) * 100),
    water: Math.round((counts.water / total) * 100),
  };

  // Ensure percentages sum to 100
  const sum = Object.values(percentages).reduce((s, v) => s + v, 0);
  if (sum !== 100) {
    const diff = 100 - sum;
    const maxElement = (Object.entries(percentages) as [Element, number][])
      .sort(([, a], [, b]) => b - a)[0][0];
    percentages[maxElement] += diff;
  }

  // Find dominant and lacking
  const sorted = (Object.entries(percentages) as [Element, number][])
    .sort(([, a], [, b]) => b - a);

  const dominant = sorted[0][0];
  const lacking = sorted[sorted.length - 1][1] <= 10 ? sorted[sorted.length - 1][0] : null;

  return {
    ...percentages,
    dominant,
    lacking,
  };
}
