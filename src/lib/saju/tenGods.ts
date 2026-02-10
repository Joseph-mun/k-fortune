import type {
  HeavenlyStem,
  Element,
  YinYang,
  FourPillars,
  TenGodRelation,
  TenGodEntry,
  TenGodAnalysis,
} from './types';
import { STEM_ELEMENTS, STEM_YINYANG, HIDDEN_STEMS } from './constants';

/**
 * Five Elements generating cycle (상생)
 * Wood→Fire→Earth→Metal→Water→Wood
 */
const GENERATING: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

/**
 * Five Elements controlling cycle (상극)
 * Wood→Earth→Water→Fire→Metal→Wood
 */
const CONTROLLING: Record<Element, Element> = {
  wood: 'earth',
  fire: 'metal',
  earth: 'water',
  metal: 'wood',
  water: 'fire',
};

type ElementRelation = 'same' | 'i-generate' | 'i-control' | 'controls-me' | 'generates-me';

/**
 * Determine the Five Elements relationship between day master and target
 */
function getElementRelation(dayElement: Element, targetElement: Element): ElementRelation {
  if (dayElement === targetElement) return 'same';
  if (GENERATING[dayElement] === targetElement) return 'i-generate';
  if (CONTROLLING[dayElement] === targetElement) return 'i-control';
  if (CONTROLLING[targetElement] === dayElement) return 'controls-me';
  if (GENERATING[targetElement] === dayElement) return 'generates-me';
  // Fallback (should not happen with 5 elements)
  return 'same';
}

/**
 * Map element relation + yin-yang match to Ten God relation
 *
 * | Element Relation | Same YinYang | Different YinYang |
 * |------------------|-------------|-------------------|
 * | Same (比)        | 비견        | 겁재              |
 * | I Generate (食傷) | 식신        | 상관              |
 * | I Control (財)    | 편재        | 정재              |
 * | Controls Me (官)  | 편관        | 정관              |
 * | Generates Me (印) | 편인        | 정인              |
 */
const TEN_GOD_MAP: Record<ElementRelation, [TenGodRelation, TenGodRelation]> = {
  'same':         ['bijeon', 'geopjae'],       // same yinyang → 비견, diff → 겁재
  'i-generate':   ['siksin', 'sanggwan'],       // same → 식신, diff → 상관
  'i-control':    ['pyeonjae', 'jeongjae'],     // same → 편재, diff → 정재
  'controls-me':  ['pyeongwan', 'jeonggwan'],   // same → 편관, diff → 정관
  'generates-me': ['pyeonin', 'jeongin'],       // same → 편인, diff → 정인
};

/**
 * Determine the Ten God relation between day master stem and a target stem
 */
export function determineTenGod(dayMaster: HeavenlyStem, target: HeavenlyStem): TenGodRelation {
  const dayElement = STEM_ELEMENTS[dayMaster];
  const targetElement = STEM_ELEMENTS[target];
  const dayYinYang = STEM_YINYANG[dayMaster];
  const targetYinYang = STEM_YINYANG[target];

  const relation = getElementRelation(dayElement, targetElement);
  const sameYinYang = dayYinYang === targetYinYang;

  const [sameResult, diffResult] = TEN_GOD_MAP[relation];
  return sameYinYang ? sameResult : diffResult;
}

/**
 * Create a TenGodEntry from a stem and position
 */
function makeEntry(
  dayMaster: HeavenlyStem,
  stem: HeavenlyStem,
  position: TenGodEntry['position']
): TenGodEntry {
  return {
    stem,
    relation: determineTenGod(dayMaster, stem),
    position,
    element: STEM_ELEMENTS[stem],
    yinYang: STEM_YINYANG[stem],
  };
}

/**
 * Calculate Ten Gods (십신) analysis from Four Pillars
 *
 * Analyzes:
 * - Year stem, Month stem, Hour stem (3 heavenly stems, excluding day master itself)
 * - Hidden stems (장간) from all 4 earthly branches
 *
 * @param fourPillars - The calculated four pillars
 * @returns TenGodAnalysis with all entries and dominant relation
 */
export function calculateTenGods(fourPillars: FourPillars): TenGodAnalysis {
  const dayMaster = fourPillars.day.stem;
  const entries: TenGodEntry[] = [];

  // 1. Heavenly stems (천간) - year, month, hour (skip day = self)
  const pillarPositions = [
    { key: 'year' as const, pillar: fourPillars.year },
    { key: 'month' as const, pillar: fourPillars.month },
    { key: 'hour' as const, pillar: fourPillars.hour },
  ];

  for (const { key, pillar } of pillarPositions) {
    entries.push(makeEntry(dayMaster, pillar.stem, key));
  }

  // 2. Hidden stems (장간) from all 4 branches
  const allBranches = [
    { key: 'year' as const, branch: fourPillars.year.branch },
    { key: 'month' as const, branch: fourPillars.month.branch },
    { key: 'day' as const, branch: fourPillars.day.branch },
    { key: 'hour' as const, branch: fourPillars.hour.branch },
  ];

  for (const { branch } of allBranches) {
    const hiddenStems = HIDDEN_STEMS[branch];
    for (const stem of hiddenStems) {
      entries.push(makeEntry(dayMaster, stem, 'hidden'));
    }
  }

  // 3. Find dominant relation (most frequent)
  const counts: Partial<Record<TenGodRelation, number>> = {};
  for (const entry of entries) {
    counts[entry.relation] = (counts[entry.relation] || 0) + 1;
  }

  let dominant: TenGodRelation | null = null;
  let maxCount = 0;
  for (const [relation, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = relation as TenGodRelation;
    }
  }

  return {
    dayMaster,
    entries,
    dominant,
    summary: dominant ? `interpretation.tenGods.summary.${dominant}` : '',
  };
}
