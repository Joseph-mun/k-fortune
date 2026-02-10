import { describe, it, expect } from "vitest";
import {
  calculateFourPillars,
  calculateYearPillar,
  calculateMonthPillar,
  calculateDayPillar,
  calculateHourPillar,
} from "../pillars";
import type { HeavenlyStem } from "../types";

describe("calculateFourPillars", () => {
  it("returns an object with year, month, day, hour pillars", () => {
    const result = calculateFourPillars(1990, 1, 15, 14);
    expect(result).toHaveProperty("year");
    expect(result).toHaveProperty("month");
    expect(result).toHaveProperty("day");
    expect(result).toHaveProperty("hour");
  });

  it("each pillar has the correct structure", () => {
    const result = calculateFourPillars(1995, 3, 15, 10);
    const pillarKeys = [
      "stem",
      "branch",
      "stemElement",
      "branchElement",
      "yinYang",
      "metaphor",
      "animal",
    ];

    for (const key of ["year", "month", "day", "hour"] as const) {
      for (const prop of pillarKeys) {
        expect(result[key]).toHaveProperty(prop);
      }
    }
  });

  it("handles null birth hour by defaulting to noon", () => {
    const result = calculateFourPillars(1990, 6, 20, null);
    expect(result.hour).toBeDefined();
    expect(result.hour.branch).toBe("\uC624"); // 오 (horse, noon)
  });

  it("handles midnight boundary (23:00) correctly", () => {
    const result = calculateFourPillars(2000, 1, 1, 23);
    // 23:00 maps to 자시 (rat, 23:00-01:00)
    expect(result.hour.branch).toBe("\uC790"); // 자
    expect(result.hour.animal).toBe("rat");
  });

  it("handles midnight boundary (0:00) correctly", () => {
    const result = calculateFourPillars(2000, 1, 1, 0);
    // 0:00 also maps to 자시 (rat, 23:00-01:00)
    expect(result.hour.branch).toBe("\uC790"); // 자
    expect(result.hour.animal).toBe("rat");
  });

  it("calculates consistently for the same input", () => {
    const result1 = calculateFourPillars(1988, 7, 20, 8);
    const result2 = calculateFourPillars(1988, 7, 20, 8);
    expect(result1).toEqual(result2);
  });
});

describe("calculateYearPillar", () => {
  it("calculates year pillar from lunar year", () => {
    // 1984 is a 갑자 year (index 0 in 60-cycle)
    const result = calculateYearPillar(1984);
    expect(result.stem).toBe("\uAC11"); // 갑
    expect(result.branch).toBe("\uC790"); // 자
    expect(result.metaphor).toBe("great-tree");
    expect(result.animal).toBe("rat");
  });

  it("1990 is a 경오 year (yang metal horse)", () => {
    const result = calculateYearPillar(1990);
    expect(result.stem).toBe("\uACBD"); // 경
    expect(result.branch).toBe("\uC624"); // 오
    expect(result.stemElement).toBe("metal");
    expect(result.yinYang).toBe("yang");
    expect(result.animal).toBe("horse");
  });

  it("2000 is a 경진 year (yang metal dragon)", () => {
    const result = calculateYearPillar(2000);
    expect(result.stem).toBe("\uACBD"); // 경
    expect(result.branch).toBe("\uC9C4"); // 진
    expect(result.animal).toBe("dragon");
  });

  it("wraps correctly in the 60-year cycle", () => {
    // 1984 and 2044 should produce the same pillar (60 years apart)
    const pillar1 = calculateYearPillar(1984);
    const pillar2 = calculateYearPillar(2044);
    expect(pillar1.stem).toBe(pillar2.stem);
    expect(pillar1.branch).toBe(pillar2.branch);
  });
});

describe("calculateMonthPillar", () => {
  it("returns valid pillar for month 1 with 갑 year stem", () => {
    const result = calculateMonthPillar("\uAC11" as HeavenlyStem, 1); // 갑
    expect(result.stem).toBeDefined();
    expect(result.branch).toBe("\uC778"); // 인 (Tiger) for month 1
  });

  it("different year stems produce different month stems for same month", () => {
    const gap = calculateMonthPillar("\uAC11" as HeavenlyStem, 3); // 갑
    const eul = calculateMonthPillar("\uC744" as HeavenlyStem, 3); // 을
    expect(gap.stem).not.toBe(eul.stem);
  });

  it("month branch cycles through 12 branches starting from 인", () => {
    const stem = "\uAC11" as HeavenlyStem; // 갑
    const month1 = calculateMonthPillar(stem, 1);
    const month2 = calculateMonthPillar(stem, 2);
    const month3 = calculateMonthPillar(stem, 3);
    expect(month1.branch).toBe("\uC778"); // 인
    expect(month2.branch).toBe("\uBB18"); // 묘
    expect(month3.branch).toBe("\uC9C4"); // 진
  });
});

describe("calculateDayPillar", () => {
  it("reference date 1900-01-01 should produce 갑자", () => {
    const result = calculateDayPillar(1900, 1, 1);
    expect(result.stem).toBe("\uAC11"); // 갑
    expect(result.branch).toBe("\uC790"); // 자
  });

  it("consecutive days produce consecutive stems and branches", () => {
    const day1 = calculateDayPillar(2000, 6, 1);
    const day2 = calculateDayPillar(2000, 6, 2);

    const stems: HeavenlyStem[] = [
      "\uAC11", "\uC744", "\uBCD1", "\uC815", "\uBB34",
      "\uAE30", "\uACBD", "\uC2E0", "\uC784", "\uACC4",
    ];
    const idx1 = stems.indexOf(day1.stem);
    const idx2 = stems.indexOf(day2.stem);
    expect((idx1 + 1) % 10).toBe(idx2);
  });

  it("returns deterministic results", () => {
    const r1 = calculateDayPillar(1995, 3, 15);
    const r2 = calculateDayPillar(1995, 3, 15);
    expect(r1.stem).toBe(r2.stem);
    expect(r1.branch).toBe(r2.branch);
  });
});

describe("calculateHourPillar", () => {
  it("noon hour maps to 오 (horse) branch", () => {
    const result = calculateHourPillar("\uBCD1" as HeavenlyStem, 12); // 병
    expect(result.branch).toBe("\uC624"); // 오
  });

  it("different day stems produce different hour stems for same hour", () => {
    const h1 = calculateHourPillar("\uAC11" as HeavenlyStem, 14); // 갑
    const h2 = calculateHourPillar("\uC744" as HeavenlyStem, 14); // 을
    expect(h1.stem).not.toBe(h2.stem);
  });

  it("early morning (3:00) maps to 인 (tiger)", () => {
    const result = calculateHourPillar("\uAC11" as HeavenlyStem, 3); // 갑
    expect(result.branch).toBe("\uC778"); // 인
    expect(result.animal).toBe("tiger");
  });

  it("evening (19:00) maps to 술 (dog)", () => {
    const result = calculateHourPillar("\uAC11" as HeavenlyStem, 19); // 갑
    expect(result.branch).toBe("\uC220"); // 술
    expect(result.animal).toBe("dog");
  });
});
