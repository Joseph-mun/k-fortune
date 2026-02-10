import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock rate limiting to always allow
vi.mock("@/lib/rateLimit", () => ({
  checkRateLimit: () => ({
    allowed: true,
    remaining: 4,
    resetIn: 60000,
    limit: 5,
  }),
  getClientIdentifier: () => "test-ip",
  RATE_LIMITS: {
    COMPATIBILITY: { maxRequests: 5, windowMs: 60000 },
  },
}));

import { POST } from "../route";

function createRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/fortune/compatibility", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/fortune/compatibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns compatibility scores for valid input", async () => {
    const req = createRequest({
      person1: {
        birthDate: "1990-06-15",
        birthTime: "14:00",
        gender: "male",
      },
      person2: {
        birthDate: "1992-03-20",
        birthTime: "08:30",
        gender: "female",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("overallScore");
    expect(data).toHaveProperty("categories");
    expect(data.categories).toHaveProperty("romance");
    expect(data.categories).toHaveProperty("communication");
    expect(data.categories).toHaveProperty("values");
    expect(data.categories).toHaveProperty("lifestyle");
    expect(data).toHaveProperty("analysis");
    expect(data).toHaveProperty("advice");
    expect(data).toHaveProperty("person1");
    expect(data).toHaveProperty("person2");
  });

  it("scores are between 0 and 100", async () => {
    const req = createRequest({
      person1: {
        birthDate: "1988-12-25",
        birthTime: "06:00",
        gender: "male",
      },
      person2: {
        birthDate: "1990-07-04",
        birthTime: "22:00",
        gender: "female",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.overallScore).toBeGreaterThanOrEqual(0);
    expect(data.overallScore).toBeLessThanOrEqual(100);
    expect(data.categories.romance).toBeGreaterThanOrEqual(0);
    expect(data.categories.romance).toBeLessThanOrEqual(100);
    expect(data.categories.communication).toBeGreaterThanOrEqual(0);
    expect(data.categories.communication).toBeLessThanOrEqual(100);
  });

  it("person details include day master info", async () => {
    const req = createRequest({
      person1: {
        birthDate: "1990-06-15",
        birthTime: "14:00",
        gender: "male",
      },
      person2: {
        birthDate: "1992-03-20",
        birthTime: "08:30",
        gender: "female",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.person1.dayMaster).toHaveProperty("element");
    expect(data.person1.dayMaster).toHaveProperty("metaphor");
    expect(data.person1.dayMaster).toHaveProperty("displayName");
    expect(data.person1.dayMaster).toHaveProperty("icon");

    expect(data.person2.dayMaster).toHaveProperty("element");
    expect(data.person2.dayMaster).toHaveProperty("metaphor");
  });

  it("returns INVALID_INPUT for missing person2", async () => {
    const req = createRequest({
      person1: {
        birthDate: "1990-06-15",
        birthTime: "14:00",
        gender: "male",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("INVALID_INPUT");
  });

  it("returns INVALID_INPUT for bad date format", async () => {
    const req = createRequest({
      person1: {
        birthDate: "bad-date",
        gender: "male",
      },
      person2: {
        birthDate: "1992-03-20",
        gender: "female",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("handles null birthTime for both persons", async () => {
    const req = createRequest({
      person1: {
        birthDate: "1990-06-15",
        birthTime: null,
        gender: "male",
      },
      person2: {
        birthDate: "1992-03-20",
        birthTime: null,
        gender: "female",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns consistent results for same input", async () => {
    const body = {
      person1: {
        birthDate: "1990-06-15",
        birthTime: "14:00",
        gender: "male",
      },
      person2: {
        birthDate: "1992-03-20",
        birthTime: "08:30",
        gender: "female",
      },
    };

    const res1 = await POST(createRequest(body));
    const res2 = await POST(createRequest(body));

    const data1 = await res1.json();
    const data2 = await res2.json();

    expect(data1.overallScore).toBe(data2.overallScore);
    expect(data1.categories).toEqual(data2.categories);
  });

  it("accepts locale parameter", async () => {
    const req = createRequest({
      person1: {
        birthDate: "1990-06-15",
        birthTime: "14:00",
        gender: "male",
      },
      person2: {
        birthDate: "1992-03-20",
        birthTime: "08:30",
        gender: "female",
      },
      locale: "es",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
