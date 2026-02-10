import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock rate limiting to always allow
vi.mock("@/lib/rateLimit", () => ({
  checkRateLimit: () => ({
    allowed: true,
    remaining: 9,
    resetIn: 60000,
    limit: 10,
  }),
  getClientIdentifier: () => "test-ip",
  RATE_LIMITS: {
    BASIC_FORTUNE: { maxRequests: 10, windowMs: 60000 },
  },
}));

import { POST } from "../route";

function createRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/fortune/basic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/fortune/basic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a valid reading for correct input", async () => {
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
    expect(data).toHaveProperty("shareUrl");
  });

  it("returns four pillars with correct structure", async () => {
    const req = createRequest({
      birthDate: "1995-03-20",
      birthTime: "08:30",
      gender: "female",
    });

    const res = await POST(req);
    const data = await res.json();

    for (const pillar of ["year", "month", "day", "hour"]) {
      expect(data.fourPillars[pillar]).toHaveProperty("metaphor");
      expect(data.fourPillars[pillar]).toHaveProperty("animal");
      expect(data.fourPillars[pillar]).toHaveProperty("element");
      expect(data.fourPillars[pillar]).toHaveProperty("yinYang");
      expect(data.fourPillars[pillar]).toHaveProperty("display");
    }
  });

  it("returns day master with metaphor info", async () => {
    const req = createRequest({
      birthDate: "2000-01-01",
      birthTime: null,
      gender: "other",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.dayMaster).toHaveProperty("element");
    expect(data.dayMaster).toHaveProperty("yinYang");
    expect(data.dayMaster).toHaveProperty("metaphor");
    expect(data.dayMaster).toHaveProperty("metaphorInfo");
    expect(data.dayMaster.metaphorInfo).toHaveProperty("displayName");
    expect(data.dayMaster.metaphorInfo).toHaveProperty("icon");
    expect(data.dayMaster.metaphorInfo).toHaveProperty("keywords");
  });

  it("returns INVALID_BIRTH_DATE for bad date format", async () => {
    const req = createRequest({
      birthDate: "not-a-date",
      gender: "male",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("INVALID_BIRTH_DATE");
  });

  it("returns INVALID_BIRTH_TIME for bad time format", async () => {
    const req = createRequest({
      birthDate: "1990-06-15",
      birthTime: "invalid",
      gender: "male",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("INVALID_BIRTH_TIME");
  });

  it("returns INVALID_INPUT for missing gender", async () => {
    const req = createRequest({
      birthDate: "1990-06-15",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error.code).toBe("INVALID_INPUT");
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
    expect(data).toHaveProperty("id");
  });

  it("defaults locale to en when not provided", async () => {
    const req = createRequest({
      birthDate: "1990-06-15",
      birthTime: "10:00",
      gender: "male",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("accepts es locale", async () => {
    const req = createRequest({
      birthDate: "1990-06-15",
      birthTime: "10:00",
      gender: "male",
      locale: "es",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns consistent results for same input", async () => {
    const body = {
      birthDate: "1988-12-25",
      birthTime: "06:00",
      gender: "male",
      locale: "en",
    };

    const res1 = await POST(createRequest(body));
    const res2 = await POST(createRequest(body));

    const data1 = await res1.json();
    const data2 = await res2.json();

    // IDs differ (timestamp-based) but four pillars should match
    expect(data1.fourPillars).toEqual(data2.fourPillars);
    expect(data1.dayMaster.metaphor).toBe(data2.dayMaster.metaphor);
  });
});
