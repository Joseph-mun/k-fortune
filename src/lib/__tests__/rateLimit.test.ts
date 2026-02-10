import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from "../rateLimit";

describe("checkRateLimit", () => {
  const testConfig = { maxRequests: 3, windowMs: 1000 };

  it("allows first request", () => {
    const result = checkRateLimit("test-first-" + Date.now(), testConfig);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(result.limit).toBe(3);
  });

  it("tracks remaining correctly", () => {
    const id = "test-track-" + Date.now();
    const r1 = checkRateLimit(id, testConfig);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(id, testConfig);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(id, testConfig);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks after limit is reached", () => {
    const id = "test-block-" + Date.now();

    // Use up all requests
    for (let i = 0; i < 3; i++) {
      checkRateLimit(id, testConfig);
    }

    // Next request should be blocked
    const result = checkRateLimit(id, testConfig);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("different identifiers have independent limits", () => {
    const id1 = "test-indep-a-" + Date.now();
    const id2 = "test-indep-b-" + Date.now();

    // Use up id1's limit
    for (let i = 0; i < 3; i++) {
      checkRateLimit(id1, testConfig);
    }
    const blocked = checkRateLimit(id1, testConfig);
    expect(blocked.allowed).toBe(false);

    // id2 should still be allowed
    const allowed = checkRateLimit(id2, testConfig);
    expect(allowed.allowed).toBe(true);
  });

  it("resets after window expires", async () => {
    const shortConfig = { maxRequests: 1, windowMs: 50 };
    const id = "test-reset-" + Date.now();

    const r1 = checkRateLimit(id, shortConfig);
    expect(r1.allowed).toBe(true);

    const r2 = checkRateLimit(id, shortConfig);
    expect(r2.allowed).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 60));

    const r3 = checkRateLimit(id, shortConfig);
    expect(r3.allowed).toBe(true);
  });

  it("returns resetIn > 0 when within window", () => {
    const id = "test-resetin-" + Date.now();
    const result = checkRateLimit(id, testConfig);
    expect(result.resetIn).toBeGreaterThan(0);
    expect(result.resetIn).toBeLessThanOrEqual(testConfig.windowMs);
  });
});

describe("getClientIdentifier", () => {
  it("returns x-forwarded-for first IP when present", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIdentifier(request)).toBe("1.2.3.4");
  });

  it("returns x-real-ip when x-forwarded-for is absent", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "9.8.7.6" },
    });
    expect(getClientIdentifier(request)).toBe("9.8.7.6");
  });

  it("returns 'unknown' when no IP headers", () => {
    const request = new Request("http://localhost");
    expect(getClientIdentifier(request)).toBe("unknown");
  });
});

describe("RATE_LIMITS presets", () => {
  it("BASIC_FORTUNE allows 10 per minute", () => {
    expect(RATE_LIMITS.BASIC_FORTUNE.maxRequests).toBe(10);
    expect(RATE_LIMITS.BASIC_FORTUNE.windowMs).toBe(60000);
  });

  it("DETAILED_FORTUNE allows 5 per minute", () => {
    expect(RATE_LIMITS.DETAILED_FORTUNE.maxRequests).toBe(5);
    expect(RATE_LIMITS.DETAILED_FORTUNE.windowMs).toBe(60000);
  });

  it("COMPATIBILITY allows 5 per minute", () => {
    expect(RATE_LIMITS.COMPATIBILITY.maxRequests).toBe(5);
  });

  it("USER_API allows 30 per minute", () => {
    expect(RATE_LIMITS.USER_API.maxRequests).toBe(30);
  });
});
