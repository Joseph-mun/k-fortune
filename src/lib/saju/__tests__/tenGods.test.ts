import { describe, it, expect } from 'vitest';
import { determineTenGod, calculateTenGods } from '../tenGods';
import type { FourPillars, Pillar } from '../types';

// Helper to create a minimal pillar for testing
function makePillar(stem: string, branch: string): Pillar {
  return {
    stem: stem as Pillar['stem'],
    branch: branch as Pillar['branch'],
    stemElement: 'wood', // not used in tenGods calculation directly
    branchElement: 'wood',
    yinYang: 'yang',
    metaphor: 'great-tree',
    animal: 'rat',
  };
}

describe('determineTenGod', () => {
  // Day Master: 갑 (Yang Wood)

  it('same element, same yinyang → 비견 (bijeon)', () => {
    expect(determineTenGod('갑', '갑')).toBe('bijeon');
  });

  it('same element, different yinyang → 겁재 (geopjae)', () => {
    expect(determineTenGod('갑', '을')).toBe('geopjae');
  });

  it('I generate, same yinyang → 식신 (siksin)', () => {
    // 갑(Yang Wood) generates Fire; 병(Yang Fire) = same yinyang
    expect(determineTenGod('갑', '병')).toBe('siksin');
  });

  it('I generate, different yinyang → 상관 (sanggwan)', () => {
    // 갑(Yang Wood) generates Fire; 정(Yin Fire) = different yinyang
    expect(determineTenGod('갑', '정')).toBe('sanggwan');
  });

  it('I control, same yinyang → 편재 (pyeonjae)', () => {
    // 갑(Yang Wood) controls Earth; 무(Yang Earth) = same yinyang
    expect(determineTenGod('갑', '무')).toBe('pyeonjae');
  });

  it('I control, different yinyang → 정재 (jeongjae)', () => {
    // 갑(Yang Wood) controls Earth; 기(Yin Earth) = different yinyang
    expect(determineTenGod('갑', '기')).toBe('jeongjae');
  });

  it('controls me, same yinyang → 편관 (pyeongwan)', () => {
    // Metal controls Wood; 경(Yang Metal) = same yinyang as 갑(Yang)
    expect(determineTenGod('갑', '경')).toBe('pyeongwan');
  });

  it('controls me, different yinyang → 정관 (jeonggwan)', () => {
    // Metal controls Wood; 신(Yin Metal) = different yinyang
    expect(determineTenGod('갑', '신')).toBe('jeonggwan');
  });

  it('generates me, same yinyang → 편인 (pyeonin)', () => {
    // Water generates Wood; 임(Yang Water) = same yinyang as 갑(Yang)
    expect(determineTenGod('갑', '임')).toBe('pyeonin');
  });

  it('generates me, different yinyang → 정인 (jeongin)', () => {
    // Water generates Wood; 계(Yin Water) = different yinyang
    expect(determineTenGod('갑', '계')).toBe('jeongin');
  });

  // Additional tests with different day masters

  it('정(Yin Fire) as day master: 임(Yang Water) controls me, diff yinyang → 정관', () => {
    // Water controls Fire; 정=Yin, 임=Yang → different yinyang
    expect(determineTenGod('정', '임')).toBe('jeonggwan');
  });

  it('경(Yang Metal) as day master: 갑(Yang Wood) I control, same yinyang → 편재', () => {
    // Metal controls Wood; 경=Yang, 갑=Yang → same yinyang
    expect(determineTenGod('경', '갑')).toBe('pyeonjae');
  });

  it('계(Yin Water) as day master: 병(Yang Fire) I control, diff yinyang → 정재', () => {
    // Water controls Fire; 계=Yin, 병=Yang → different yinyang
    expect(determineTenGod('계', '병')).toBe('jeongjae');
  });
});

describe('calculateTenGods', () => {
  it('should return entries for 3 heavenly stems + hidden stems', () => {
    const fourPillars: FourPillars = {
      year: makePillar('경', '인'),    // 경(Yang Metal), 인(寅 → 갑,병,무)
      month: makePillar('기', '묘'),   // 기(Yin Earth), 묘(卯 → 을)
      day: makePillar('갑', '자'),     // 갑(Yang Wood) = day master, 자(子 → 계)
      hour: makePillar('병', '오'),    // 병(Yang Fire), 오(午 → 정,기)
    };

    const result = calculateTenGods(fourPillars);

    expect(result.dayMaster).toBe('갑');

    // 3 heavenly stems: 경(year), 기(month), 병(hour)
    const mainEntries = result.entries.filter(e => e.position !== 'hidden');
    expect(mainEntries).toHaveLength(3);

    // Check year stem: 경(Yang Metal) → 갑 기준 편관
    expect(mainEntries[0].relation).toBe('pyeongwan');
    // Check month stem: 기(Yin Earth) → 갑 기준 정재
    expect(mainEntries[1].relation).toBe('jeongjae');
    // Check hour stem: 병(Yang Fire) → 갑 기준 식신
    expect(mainEntries[2].relation).toBe('siksin');

    // Hidden stems from branches:
    // 인(寅): 갑,병,무 → 비견, 식신, 편재
    // 묘(卯): 을 → 겁재
    // 자(子): 계 → 정인
    // 오(午): 정,기 → 상관, 정재
    const hiddenEntries = result.entries.filter(e => e.position === 'hidden');
    expect(hiddenEntries.length).toBeGreaterThanOrEqual(7);
  });

  it('should determine dominant relation correctly', () => {
    const fourPillars: FourPillars = {
      year: makePillar('갑', '인'),    // 갑 → 비견, 인(갑,병,무) → 비견,식신,편재
      month: makePillar('갑', '묘'),   // 갑 → 비견, 묘(을) → 겁재
      day: makePillar('갑', '자'),     // day master, 자(계) → 정인
      hour: makePillar('을', '해'),    // 을 → 겁재, 해(임,갑) → 편인,비견
    };

    const result = calculateTenGods(fourPillars);

    // 비견 appears: year stem(갑), 인-hidden(갑), 해-hidden(갑) = 3 times at minimum
    expect(result.dominant).toBe('bijeon');
    expect(result.summary).toBe('interpretation.tenGods.summary.bijeon');
  });

  it('should include dayMaster in result', () => {
    const fourPillars: FourPillars = {
      year: makePillar('병', '오'),
      month: makePillar('정', '사'),
      day: makePillar('임', '신'),
      hour: makePillar('경', '술'),
    };

    const result = calculateTenGods(fourPillars);
    expect(result.dayMaster).toBe('임');
  });

  it('should have correct entry structure', () => {
    const fourPillars: FourPillars = {
      year: makePillar('을', '축'),
      month: makePillar('기', '미'),
      day: makePillar('병', '진'),
      hour: makePillar('신', '유'),
    };

    const result = calculateTenGods(fourPillars);

    for (const entry of result.entries) {
      expect(entry).toHaveProperty('stem');
      expect(entry).toHaveProperty('relation');
      expect(entry).toHaveProperty('position');
      expect(entry).toHaveProperty('element');
      expect(entry).toHaveProperty('yinYang');
    }
  });
});
