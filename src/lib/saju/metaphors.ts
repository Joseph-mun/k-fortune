import type { HeavenlyStem, EarthlyBranch, StemMetaphor, StemMetaphorInfo, BranchAnimal, BranchAnimalInfo } from './types';

/** Stem → Metaphor mapping */
export const STEM_METAPHORS: Record<HeavenlyStem, StemMetaphorInfo> = {
  '갑': {
    id: 'great-tree',
    stem: '갑',
    element: 'wood',
    yinYang: 'yang',
    displayName: 'The Great Tree',
    icon: '🌳',
    nature: 'metaphors.great-tree.nature',
    keywords: ['metaphors.great-tree.keywords.0', 'metaphors.great-tree.keywords.1', 'metaphors.great-tree.keywords.2', 'metaphors.great-tree.keywords.3'],
  },
  '을': {
    id: 'flower',
    stem: '을',
    element: 'wood',
    yinYang: 'yin',
    displayName: 'The Flower',
    icon: '🌸',
    nature: 'metaphors.flower.nature',
    keywords: ['metaphors.flower.keywords.0', 'metaphors.flower.keywords.1', 'metaphors.flower.keywords.2', 'metaphors.flower.keywords.3'],
  },
  '병': {
    id: 'sun',
    stem: '병',
    element: 'fire',
    yinYang: 'yang',
    displayName: 'The Sun',
    icon: '☀️',
    nature: 'metaphors.sun.nature',
    keywords: ['metaphors.sun.keywords.0', 'metaphors.sun.keywords.1', 'metaphors.sun.keywords.2', 'metaphors.sun.keywords.3'],
  },
  '정': {
    id: 'candle',
    stem: '정',
    element: 'fire',
    yinYang: 'yin',
    displayName: 'The Candle',
    icon: '🕯️',
    nature: 'metaphors.candle.nature',
    keywords: ['metaphors.candle.keywords.0', 'metaphors.candle.keywords.1', 'metaphors.candle.keywords.2', 'metaphors.candle.keywords.3'],
  },
  '무': {
    id: 'mountain',
    stem: '무',
    element: 'earth',
    yinYang: 'yang',
    displayName: 'The Mountain',
    icon: '⛰️',
    nature: 'metaphors.mountain.nature',
    keywords: ['metaphors.mountain.keywords.0', 'metaphors.mountain.keywords.1', 'metaphors.mountain.keywords.2', 'metaphors.mountain.keywords.3'],
  },
  '기': {
    id: 'garden',
    stem: '기',
    element: 'earth',
    yinYang: 'yin',
    displayName: 'The Garden',
    icon: '🌿',
    nature: 'metaphors.garden.nature',
    keywords: ['metaphors.garden.keywords.0', 'metaphors.garden.keywords.1', 'metaphors.garden.keywords.2', 'metaphors.garden.keywords.3'],
  },
  '경': {
    id: 'sword',
    stem: '경',
    element: 'metal',
    yinYang: 'yang',
    displayName: 'The Sword',
    icon: '⚔️',
    nature: 'metaphors.sword.nature',
    keywords: ['metaphors.sword.keywords.0', 'metaphors.sword.keywords.1', 'metaphors.sword.keywords.2', 'metaphors.sword.keywords.3'],
  },
  '신': {
    id: 'jewel',
    stem: '신',
    element: 'metal',
    yinYang: 'yin',
    displayName: 'The Jewel',
    icon: '💎',
    nature: 'metaphors.jewel.nature',
    keywords: ['metaphors.jewel.keywords.0', 'metaphors.jewel.keywords.1', 'metaphors.jewel.keywords.2', 'metaphors.jewel.keywords.3'],
  },
  '임': {
    id: 'ocean',
    stem: '임',
    element: 'water',
    yinYang: 'yang',
    displayName: 'The Ocean',
    icon: '🌊',
    nature: 'metaphors.ocean.nature',
    keywords: ['metaphors.ocean.keywords.0', 'metaphors.ocean.keywords.1', 'metaphors.ocean.keywords.2', 'metaphors.ocean.keywords.3'],
  },
  '계': {
    id: 'rain',
    stem: '계',
    element: 'water',
    yinYang: 'yin',
    displayName: 'The Rain',
    icon: '🌧️',
    nature: 'metaphors.rain.nature',
    keywords: ['metaphors.rain.keywords.0', 'metaphors.rain.keywords.1', 'metaphors.rain.keywords.2', 'metaphors.rain.keywords.3'],
  },
};

/** Branch → Animal mapping */
export const BRANCH_ANIMALS: Record<EarthlyBranch, BranchAnimalInfo> = {
  '자': { id: 'rat', branch: '자', element: 'water', displayName: 'Rat', icon: '🐀' },
  '축': { id: 'ox', branch: '축', element: 'earth', displayName: 'Ox', icon: '🐂' },
  '인': { id: 'tiger', branch: '인', element: 'wood', displayName: 'Tiger', icon: '🐅' },
  '묘': { id: 'rabbit', branch: '묘', element: 'wood', displayName: 'Rabbit', icon: '🐇' },
  '진': { id: 'dragon', branch: '진', element: 'earth', displayName: 'Dragon', icon: '🐉' },
  '사': { id: 'snake', branch: '사', element: 'fire', displayName: 'Snake', icon: '🐍' },
  '오': { id: 'horse', branch: '오', element: 'fire', displayName: 'Horse', icon: '🐎' },
  '미': { id: 'goat', branch: '미', element: 'earth', displayName: 'Goat', icon: '🐐' },
  '신': { id: 'monkey', branch: '신', element: 'metal', displayName: 'Monkey', icon: '🐒' },
  '유': { id: 'rooster', branch: '유', element: 'metal', displayName: 'Rooster', icon: '🐓' },
  '술': { id: 'dog', branch: '술', element: 'earth', displayName: 'Dog', icon: '🐕' },
  '해': { id: 'pig', branch: '해', element: 'water', displayName: 'Pig', icon: '🐖' },
};

/** Get metaphor by stem */
export function getStemMetaphor(stem: HeavenlyStem): StemMetaphorInfo {
  return STEM_METAPHORS[stem];
}

/** Get animal by branch */
export function getBranchAnimal(branch: EarthlyBranch): BranchAnimalInfo {
  return BRANCH_ANIMALS[branch];
}

/** Get metaphor by ID */
export function getMetaphorById(id: StemMetaphor): StemMetaphorInfo | undefined {
  return Object.values(STEM_METAPHORS).find(m => m.id === id);
}

/** Get animal by ID */
export function getAnimalById(id: BranchAnimal): BranchAnimalInfo | undefined {
  return Object.values(BRANCH_ANIMALS).find(a => a.id === id);
}
