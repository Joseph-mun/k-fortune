/**
 * Rate limiter with Upstash Redis + in-memory fallback
 *
 * Design spec: Section 4.1 - Rate limiting for API endpoints
 * - /api/fortune/basic: 10 requests per minute
 * - /api/fortune/detailed: 5 requests per minute
 *
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL is configured.
 * Falls back to in-memory Map when Redis is not available.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Time in ms until the rate limit resets */
  resetIn: number;
  /** Maximum requests per window */
  limit: number;
}

// --- Upstash Redis (lazy init) ---

let redis: Redis | null = null;
const upstashLimiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

function getUpstashLimiter(config: RateLimitConfig): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;

  const key = `${config.maxRequests}:${config.windowMs}`;
  let limiter = upstashLimiters.get(key);
  if (!limiter) {
    const windowSec = Math.ceil(config.windowMs / 1000);
    limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(config.maxRequests, `${windowSec} s`),
    });
    upstashLimiters.set(key, limiter);
  }
  return limiter;
}

// --- In-memory fallback ---

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetTime) rateLimitMap.delete(key);
    }
  }, CLEANUP_INTERVAL);
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

function checkInMemory(identifier: string, config: RateLimitConfig): RateLimitResult {
  startCleanup();
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs, limit: config.maxRequests };
  }

  const remaining = Math.max(0, config.maxRequests - entry.count - 1);
  const resetIn = entry.resetTime - now;

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetIn, limit: config.maxRequests };
  }

  entry.count += 1;
  return { allowed: true, remaining, resetIn, limit: config.maxRequests };
}

/**
 * Check rate limit for a given identifier.
 * Uses Upstash Redis when available, falls back to in-memory.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  try {
    const limiter = getUpstashLimiter(config);

    if (limiter) {
      const result = await limiter.limit(identifier);
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetIn: Math.max(0, result.reset - Date.now()),
        limit: result.limit,
      };
    }
  } catch {
    // Redis error — fall back to in-memory
  }

  return checkInMemory(identifier, config);
}

/**
 * Get the client identifier from a request.
 * Uses user ID for authenticated requests, falls back to IP address.
 */
export function getClientIdentifier(request: Request, userId?: string | null): string {
  if (userId) {
    return `user:${userId}`;
  }
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

/** Predefined rate limit configs */
export const RATE_LIMITS = {
  /** Basic fortune: 10 requests per minute */
  BASIC_FORTUNE: { maxRequests: 10, windowMs: 60 * 1000 } as RateLimitConfig,
  /** Detailed fortune: 5 requests per minute */
  DETAILED_FORTUNE: { maxRequests: 5, windowMs: 60 * 1000 } as RateLimitConfig,
  /** Compatibility: 5 requests per minute */
  COMPATIBILITY: { maxRequests: 5, windowMs: 60 * 1000 } as RateLimitConfig,
  /** User API: 30 requests per minute */
  USER_API: { maxRequests: 30, windowMs: 60 * 1000 } as RateLimitConfig,
  /** AI Reading: 3 requests per minute */
  AI_READING: { maxRequests: 3, windowMs: 60 * 1000 } as RateLimitConfig,
};
