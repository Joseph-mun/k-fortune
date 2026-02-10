/** Heavenly Stems (천간) - internal calculation keys */
export type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';

/** Five Elements (오행) */
export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

/** Yin-Yang (음양) */
export type YinYang = 'yin' | 'yang';

/** Stem Nature Metaphor - foreign user display */
export type StemMetaphor =
  | 'great-tree' | 'flower' | 'sun' | 'candle' | 'mountain'
  | 'garden' | 'sword' | 'jewel' | 'ocean' | 'rain';

/** Stem Metaphor detailed info */
export interface StemMetaphorInfo {
  id: StemMetaphor;
  stem: HeavenlyStem;
  element: Element;
  yinYang: YinYang;
  displayName: string;
  icon: string;
  nature: string;
  keywords: string[];
}

/** Earthly Branches (지지) */
export type EarthlyBranch = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';

/** Branch Animal */
export type BranchAnimal =
  | 'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake'
  | 'horse' | 'goat' | 'monkey' | 'rooster' | 'dog' | 'pig';

/** Branch Animal info */
export interface BranchAnimalInfo {
  id: BranchAnimal;
  branch: EarthlyBranch;
  element: Element;
  displayName: string;
  icon: string;
}

/** Single pillar (stem + branch pair) */
export interface Pillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemElement: Element;
  branchElement: Element;
  yinYang: YinYang;
  metaphor: StemMetaphor;
  animal: BranchAnimal;
}

/** Four Pillars */
export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

/** Element Analysis */
export interface ElementAnalysis {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  dominant: Element;
  lacking: Element | null;
}

/** Lucky Info */
export interface LuckyInfo {
  color: string;
  number: number;
  direction: string;
}

/** Basic Reading (free) */
export interface BasicReading {
  id: string;
  fourPillars: FourPillars;
  elementAnalysis: ElementAnalysis;
  dayMaster: {
    element: Element;
    yinYang: YinYang;
    metaphor: StemMetaphor;
    metaphorInfo: StemMetaphorInfo;
    personality: string;
    strengths: string[];
    weaknesses: string[];
  };
  luckyInfo: LuckyInfo;
}

/** Major Cycle (10-year period) */
export interface MajorCycle {
  startAge: number;
  endAge: number;
  pillar: Pillar;
  description: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

/** Detailed Reading (paid) */
export interface DetailedReading extends BasicReading {
  career: string;
  relationship: string;
  health: string;
  wealth: string;
  yearlyFortune: string;
  advice: string;
  majorCycles: MajorCycle[];
}

/** Compatibility Reading */
export interface CompatibilityReading {
  person1: BasicReading;
  person2: BasicReading;
  overallScore: number;
  categories: {
    romance: number;
    communication: number;
    values: number;
    lifestyle: number;
  };
  analysis: string;
  advice: string;
}

/** Birth input */
export interface BirthInput {
  birthDate: string;
  birthTime: string | null;
  timezone: string;
  gender: 'male' | 'female' | 'other';
  locale: 'en' | 'es';
}

/** Ten God Relations (십신) */
export type TenGodRelation =
  | 'bijeon'      // 비견 (比肩) - Parallel
  | 'geopjae'     // 겁재 (劫財) - Rob Wealth
  | 'siksin'      // 식신 (食神) - Eating God
  | 'sanggwan'    // 상관 (傷官) - Hurting Officer
  | 'pyeonjae'    // 편재 (偏財) - Indirect Wealth
  | 'jeongjae'    // 정재 (正財) - Direct Wealth
  | 'pyeongwan'   // 편관 (偏官) - Indirect Authority
  | 'jeonggwan'   // 정관 (正官) - Direct Authority
  | 'pyeonin'     // 편인 (偏印) - Indirect Seal
  | 'jeongin';    // 정인 (正印) - Direct Seal

/** Single ten god entry */
export interface TenGodEntry {
  stem: HeavenlyStem;
  relation: TenGodRelation;
  position: 'year' | 'month' | 'day' | 'hour' | 'hidden';
  element: Element;
  yinYang: YinYang;
}

/** Ten God analysis result */
export interface TenGodAnalysis {
  dayMaster: HeavenlyStem;
  entries: TenGodEntry[];
  dominant: TenGodRelation | null;
  summary: string;
}

/** API pillar display */
export interface PillarDisplay {
  metaphor: StemMetaphor;
  animal: BranchAnimal;
  element: Element;
  yinYang: YinYang;
  display: {
    stemName: string;
    stemIcon: string;
    animalName: string;
    animalIcon: string;
  };
}
