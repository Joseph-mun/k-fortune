import { describe, it, expect } from "vitest";
import { calculateCompatibility } from "../compatibility";
import type { BirthInput } from "../types";

function makeBirthInput(
  birthDate: string,
  gender: "male" | "female" | "other" = "male",
  birthTime: string | null = "12:00"
): BirthInput {
  return {
    birthDate,
    birthTime,
    timezone: "UTC",
    gender,
    locale: "en",
  };
}

describe("calculateCompatibility", () => {
  it("returns compatibility reading with correct structure", () => {
    const person1 = makeBirthInput("1990-05-15", "male");
    const person2 = makeBirthInput("1992-08-20", "female");
    const result = calculateCompatibility(person1, person2);

    expect(result).toHaveProperty("person1");
    expect(result).toHaveProperty("person2");
    expect(result).toHaveProperty("overallScore");
    expect(result).toHaveProperty("categories");
    expect(result).toHaveProperty("analysis");
    expect(result).toHaveProperty("advice");
  });

  it("categories has all four scoring dimensions", () => {
    const person1 = makeBirthInput("1988-02-14", "male");
    const person2 = makeBirthInput("1990-09-30", "female");
    const result = calculateCompatibility(person1, person2);

    expect(result.categories).toHaveProperty("romance");
    expect(result.categories).toHaveProperty("communication");
    expect(result.categories).toHaveProperty("values");
    expect(result.categories).toHaveProperty("lifestyle");
  });

  it("overall score is between 0 and 100", () => {
    const person1 = makeBirthInput("1995-03-15", "female");
    const person2 = makeBirthInput("1993-11-22", "male");
    const result = calculateCompatibility(person1, person2);

    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("category scores are between 0 and 100", () => {
    const person1 = makeBirthInput("1990-05-15", "male");
    const person2 = makeBirthInput("1992-08-20", "female");
    const result = calculateCompatibility(person1, person2);

    for (const key of ["romance", "communication", "values", "lifestyle"] as const) {
      expect(result.categories[key]).toBeGreaterThanOrEqual(0);
      expect(result.categories[key]).toBeLessThanOrEqual(100);
    }
  });

  it("person1 and person2 are valid BasicReading objects", () => {
    const person1 = makeBirthInput("1990-05-15", "male");
    const person2 = makeBirthInput("1992-08-20", "female");
    const result = calculateCompatibility(person1, person2);

    // Check person1
    expect(result.person1).toHaveProperty("fourPillars");
    expect(result.person1).toHaveProperty("elementAnalysis");
    expect(result.person1).toHaveProperty("dayMaster");
    expect(result.person1).toHaveProperty("luckyInfo");

    // Check person2
    expect(result.person2).toHaveProperty("fourPillars");
    expect(result.person2).toHaveProperty("elementAnalysis");
    expect(result.person2).toHaveProperty("dayMaster");
    expect(result.person2).toHaveProperty("luckyInfo");
  });

  it("analysis follows i18n key pattern", () => {
    const person1 = makeBirthInput("1990-05-15", "male");
    const person2 = makeBirthInput("1992-08-20", "female");
    const result = calculateCompatibility(person1, person2);

    expect(result.analysis).toMatch(/^interpretation\.compatibility\.analysis\./);
    expect(result.advice).toMatch(/^interpretation\.compatibility\.advice\./);
  });

  it("same person compared to self has high compatibility", () => {
    const person = makeBirthInput("1990-05-15", "male");
    const result = calculateCompatibility(person, person);

    // Same person should have at least moderate overall compatibility
    // Same elements = 70 base harmony
    expect(result.overallScore).toBeGreaterThanOrEqual(50);
  });

  it("produces consistent results for same input", () => {
    const person1 = makeBirthInput("1990-05-15", "male");
    const person2 = makeBirthInput("1992-08-20", "female");
    const result1 = calculateCompatibility(person1, person2);
    const result2 = calculateCompatibility(person1, person2);

    expect(result1.overallScore).toBe(result2.overallScore);
    expect(result1.categories).toEqual(result2.categories);
  });

  it("handles null birth time", () => {
    const person1 = makeBirthInput("1990-05-15", "male", null);
    const person2 = makeBirthInput("1992-08-20", "female", null);
    const result = calculateCompatibility(person1, person2);

    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("harmony level classification works correctly", () => {
    const person1 = makeBirthInput("1990-05-15", "male");
    const person2 = makeBirthInput("1992-08-20", "female");
    const result = calculateCompatibility(person1, person2);

    const validLevels = ["excellent", "good", "moderate", "challenging", "difficult"];
    const level = result.analysis.split(".").pop();
    expect(validLevels).toContain(level);
  });
});
