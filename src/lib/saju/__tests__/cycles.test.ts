import { describe, it, expect } from "vitest";
import { calculateMajorCycles } from "../cycles";
import { calculateFourPillars } from "../pillars";

describe("calculateMajorCycles", () => {
  it("returns 8 major cycles", () => {
    const pillars = calculateFourPillars(1990, 5, 15, 10);
    const cycles = calculateMajorCycles(pillars, "male");
    expect(cycles).toHaveLength(8);
  });

  it("each cycle has correct structure", () => {
    const pillars = calculateFourPillars(1990, 5, 15, 10);
    const cycles = calculateMajorCycles(pillars, "female");

    for (const cycle of cycles) {
      expect(cycle).toHaveProperty("startAge");
      expect(cycle).toHaveProperty("endAge");
      expect(cycle).toHaveProperty("pillar");
      expect(cycle).toHaveProperty("description");
      expect(cycle).toHaveProperty("rating");

      expect(cycle.pillar).toHaveProperty("stem");
      expect(cycle.pillar).toHaveProperty("branch");
      expect(cycle.pillar).toHaveProperty("metaphor");
      expect(cycle.pillar).toHaveProperty("animal");
    }
  });

  it("each cycle spans 10 years", () => {
    const pillars = calculateFourPillars(1995, 3, 15, 8);
    const cycles = calculateMajorCycles(pillars, "male");

    for (const cycle of cycles) {
      expect(cycle.endAge - cycle.startAge).toBe(9);
    }
  });

  it("cycles are consecutive (no age gaps)", () => {
    const pillars = calculateFourPillars(1988, 7, 20, 14);
    const cycles = calculateMajorCycles(pillars, "female");

    for (let i = 1; i < cycles.length; i++) {
      expect(cycles[i].startAge).toBe(cycles[i - 1].endAge + 1);
    }
  });

  it("first cycle starts at age >= 1", () => {
    const pillars = calculateFourPillars(2000, 1, 1, 12);
    const cycles = calculateMajorCycles(pillars, "male");
    expect(cycles[0].startAge).toBeGreaterThanOrEqual(1);
  });

  it("rating is between 1 and 5", () => {
    const pillars = calculateFourPillars(1990, 5, 15, 10);
    const cycles = calculateMajorCycles(pillars, "male");

    for (const cycle of cycles) {
      expect(cycle.rating).toBeGreaterThanOrEqual(1);
      expect(cycle.rating).toBeLessThanOrEqual(5);
    }
  });

  it("description follows i18n key pattern", () => {
    const pillars = calculateFourPillars(1990, 5, 15, 10);
    const cycles = calculateMajorCycles(pillars, "male");

    for (const cycle of cycles) {
      expect(cycle.description).toMatch(/^interpretation\.cycles\./);
    }
  });

  it("different genders can produce different cycle directions", () => {
    const pillars = calculateFourPillars(1990, 5, 15, 10);
    const maleCycles = calculateMajorCycles(pillars, "male");
    const femaleCycles = calculateMajorCycles(pillars, "female");

    // 1990 year pillar has 경 (yang) stem
    // Male + Yang = forward, Female + Yang = backward
    // So their cycles should differ
    const malePillars = maleCycles.map((c) => c.pillar.stem);
    const femalePillars = femaleCycles.map((c) => c.pillar.stem);

    // They should produce different pillar sequences
    const allSame = malePillars.every((s, i) => s === femalePillars[i]);
    expect(allSame).toBe(false);
  });

  it("'other' gender defaults to forward progression", () => {
    const pillars = calculateFourPillars(1990, 5, 15, 10);
    const otherCycles = calculateMajorCycles(pillars, "other");
    const maleCycles = calculateMajorCycles(pillars, "male");

    // 1990 = yang year stem, male + yang = forward, other = forward
    // So they should produce the same sequence
    const otherStems = otherCycles.map((c) => c.pillar.stem);
    const maleStems = maleCycles.map((c) => c.pillar.stem);
    expect(otherStems).toEqual(maleStems);
  });
});
