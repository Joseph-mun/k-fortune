import type { HeavenlyStem, EarthlyBranch, Element, YinYang } from './types';

/** Heavenly Stems in order */
export const HEAVENLY_STEMS: HeavenlyStem[] = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

/** Earthly Branches in order */
export const EARTHLY_BRANCHES: EarthlyBranch[] = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

/** Stem → Element mapping */
export const STEM_ELEMENTS: Record<HeavenlyStem, Element> = {
  '갑': 'wood', '을': 'wood',
  '병': 'fire', '정': 'fire',
  '무': 'earth', '기': 'earth',
  '경': 'metal', '신': 'metal',
  '임': 'water', '계': 'water',
};

/** Stem → YinYang mapping */
export const STEM_YINYANG: Record<HeavenlyStem, YinYang> = {
  '갑': 'yang', '을': 'yin',
  '병': 'yang', '정': 'yin',
  '무': 'yang', '기': 'yin',
  '경': 'yang', '신': 'yin',
  '임': 'yang', '계': 'yin',
};

/** Branch → Element mapping */
export const BRANCH_ELEMENTS: Record<EarthlyBranch, Element> = {
  '자': 'water', '축': 'earth',
  '인': 'wood', '묘': 'wood',
  '진': 'earth', '사': 'fire',
  '오': 'fire', '미': 'earth',
  '신': 'metal', '유': 'metal',
  '술': 'earth', '해': 'water',
};

/** 60 Sexagenary Cycle (60갑자) */
export const SEXAGENARY_CYCLE: Array<{ stem: HeavenlyStem; branch: EarthlyBranch }> = [];

// Generate 60 cycle
for (let i = 0; i < 60; i++) {
  SEXAGENARY_CYCLE.push({
    stem: HEAVENLY_STEMS[i % 10],
    branch: EARTHLY_BRANCHES[i % 12],
  });
}

/**
 * Month stem calculation table
 * Year stem → first month stem index
 * 갑/기 년 → 병인월(2) 시작, 을/경 년 → 무인월(4), 병/신 년 → 경인월(6),
 * 정/임 년 → 임인월(8), 무/계 년 → 갑인월(0)
 */
export const YEAR_STEM_TO_MONTH_STEM_START: Record<HeavenlyStem, number> = {
  '갑': 2, '기': 2,
  '을': 4, '경': 4,
  '병': 6, '신': 6,
  '정': 8, '임': 8,
  '무': 0, '계': 0,
};

/**
 * Hour stem calculation table
 * Day stem → first hour (子시) stem index
 * 갑/기 일 → 갑자(0), 을/경 일 → 병자(2), 병/신 일 → 무자(4),
 * 정/임 일 → 경자(6), 무/계 일 → 임자(8)
 */
export const DAY_STEM_TO_HOUR_STEM_START: Record<HeavenlyStem, number> = {
  '갑': 0, '기': 0,
  '을': 2, '경': 2,
  '병': 4, '신': 4,
  '정': 6, '임': 6,
  '무': 8, '계': 8,
};

/**
 * Time to Branch mapping
 * Hour range → Earthly Branch
 */
export const TIME_TO_BRANCH: Array<{ start: number; end: number; branch: EarthlyBranch }> = [
  { start: 23, end: 1, branch: '자' },
  { start: 1, end: 3, branch: '축' },
  { start: 3, end: 5, branch: '인' },
  { start: 5, end: 7, branch: '묘' },
  { start: 7, end: 9, branch: '진' },
  { start: 9, end: 11, branch: '사' },
  { start: 11, end: 13, branch: '오' },
  { start: 13, end: 15, branch: '미' },
  { start: 15, end: 17, branch: '신' },
  { start: 17, end: 19, branch: '유' },
  { start: 19, end: 21, branch: '술' },
  { start: 21, end: 23, branch: '해' },
];

/** Hidden Stems (장간) in each Branch */
export const HIDDEN_STEMS: Record<EarthlyBranch, HeavenlyStem[]> = {
  '자': ['계'],
  '축': ['기', '계', '신'],
  '인': ['갑', '병', '무'],
  '묘': ['을'],
  '진': ['무', '을', '계'],
  '사': ['병', '경', '무'],
  '오': ['정', '기'],
  '미': ['기', '정', '을'],
  '신': ['경', '임', '무'],
  '유': ['신'],
  '술': ['무', '신', '정'],
  '해': ['임', '갑'],
};

/** Element colors for UI */
export const ELEMENT_COLORS: Record<Element, string> = {
  wood: '#22C55E',
  fire: '#EF4444',
  earth: '#EAB308',
  metal: '#F8FAFC',
  water: '#3B82F6',
};

/** Element icons */
export const ELEMENT_ICONS: Record<Element, string> = {
  wood: '🌳',
  fire: '🔥',
  earth: '🌍',
  metal: '⚪',
  water: '💧',
};

/** Lucky directions by element */
export const ELEMENT_DIRECTIONS: Record<Element, string> = {
  wood: 'East',
  fire: 'South',
  earth: 'Center',
  metal: 'West',
  water: 'North',
};

/** Lucky colors by element */
export const ELEMENT_LUCKY_COLORS: Record<Element, string> = {
  wood: 'Green',
  fire: 'Red',
  earth: 'Yellow',
  metal: 'White',
  water: 'Blue',
};

/** Lucky numbers by element */
export const ELEMENT_LUCKY_NUMBERS: Record<Element, number> = {
  wood: 3,
  fire: 7,
  earth: 5,
  metal: 9,
  water: 1,
};

/** Reference date for day pillar calculation (1900-01-01 = 갑자일) */
export const REFERENCE_DATE = new Date(1900, 0, 1);
export const REFERENCE_DAY_STEM_INDEX = 0; // 갑
export const REFERENCE_DAY_BRANCH_INDEX = 0; // 자
