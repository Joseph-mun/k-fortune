import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock rate limiting to always allow
vi.mock("@/lib/rateLimit", () => ({
  checkRateLimit: () => ({
    allowed: true,
    remaining: 4,
    resetIn: 60000,
    limit: 5,
  }),
  getClientIdentifier: () => "test-user",
  RATE_LIMITS: {
    DETAILED_FORTUNE: { maxRequests: 5, windowMs: 60000 },
  },
}));

// Mock next-auth/jwt to return a valid token
vi.mock("next-auth/jwt", () => ({
  getToken: () => Promise.resolve({ sub: "test-user-id" }),
}));

// Mock supabase to simulate a completed purchase
vi.mock("@/lib/supabase", () => ({
  createServerClient: () => ({
    from: (table: string) => {
      if (table === "purchases") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                eq: () => ({
                  limit: () => ({
                    maybeSingle: () =>
                      Promise.resolve({ data: { id: "purchase-1" }, error: null }),
                  }),
                }),
              }),
            }),
          }),
        };
      }
      if (table === "subscriptions") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                limit: () => ({
                  maybeSingle: () =>
                    Promise.resolve({ data: null, error: null }),
                }),
              }),
            }),
          }),
        };
      }
      return {};
    },
  }),
}));

import { POST } from "../route";

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/fortune/detailed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/fortune/detailed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a detailed reading with all fields", async () => {
    const req = createRequest({
      birthDate: "1990-06-15",
      birthTime: "14:00",
      gender: "male",
      locale: "en",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("fourPillars");
    expect(data).toHaveProperty("elementAnalysis");
    expect(data).toHaveProperty("dayMaster");
    expect(data).toHaveProperty("luckyInfo");
    // Detailed-specific fields
    expect(data).toHaveProperty("career");
    expect(data).toHaveProperty("relationship");
    expect(data).toHaveProperty("health");
    expect(data).toHaveProperty("wealth");
    expect(data).toHaveProperty("yearlyFortune");
    expect(data).toHaveProperty("advice");
    expect(data).toHaveProperty("majorCycles");
  });

  it("returns major cycles as an array", async () => {
    const req = createRequest({
      birthDate: "1995-03-20",
      birthTime: "08:30",
      gender: "female",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(Array.isArray(data.majorCycles)).toBe(true);
    if (data.majorCycles.length > 0) {
      const cycle = data.majorCycles[0];
      expect(cycle).toHaveProperty("startAge");
      expect(cycle).toHaveProperty("endAge");
      expect(cycle).toHaveProperty("pillar");
      expect(cycle).toHaveProperty("description");
      expect(cycle).toHaveProperty("rating");
    }
  });

  it("career field references interpretation key", async () => {
    const req = createRequest({
      birthDate: "1990-06-15",
      birthTime: "14:00",
      gender: "male",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.career).toMatch(/^interpretation\.career\./);
    expect(data.relationship).toMatch(/^interpretation\.relationship\./);
    expect(data.health).toMatch(/^interpretation\.health\./);
    expect(data.wealth).toMatch(/^interpretation\.wealth\./);
    expect(data.advice).toMatch(/^interpretation\.advice\./);
  });

  it("returns INVALID_BIRTH_DATE for bad date format", async () => {
    const req = createRequest({
      birthDate: "bad-date",
      gender: "male",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("INVALID_BIRTH_DATE");
  });

  it("returns INVALID_INPUT for missing gender", async () => {
    const req = createRequest({
      birthDate: "1990-06-15",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("handles null birthTime gracefully", async () => {
    const req = createRequest({
      birthDate: "1990-06-15",
      birthTime: null,
      gender: "female",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("career");
  });

  it("accepts optional readingId field", async () => {
    const req = createRequest({
      birthDate: "1990-06-15",
      birthTime: "14:00",
      gender: "male",
      readingId: "read_abc123",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
