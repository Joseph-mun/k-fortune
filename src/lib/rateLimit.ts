/**
 * In-memory rate limiter using Map
 *
 * Design spec: Section 4.1 - Rate limiting for API endpoints
 * - /api/fortune/basic: 10 requests per minute
 * - /api/fortune/detailed: 5 requests per minute
 *
 * Uses sliding window counter approach.
 * For production, consider Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
  // Allow the process to exit without waiting for the timer
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

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

/**
 * Check rate limit for a given identifier (e.g., IP address or user ID)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  startCleanup();

  const now = Date.now();
  const key = identifier;
  const entry = rateLimitMap.get(key);

  // If no entry or window expired, create a new one
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
      limit: config.maxRequests,
    };
  }

  // Within the window
  const remaining = Math.max(0, config.maxRequests - entry.count - 1);
  const resetIn = entry.resetTime - now;

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn,
      limit: config.maxRequests,
    };
  }

  // Increment counter
  entry.count += 1;
  rateLimitMap.set(key, entry);

  return {
    allowed: true,
    remaining,
    resetIn,
    limit: config.maxRequests,
  };
}

/**
 * Get the client identifier from a request (IP-based)
 */
export function getClientIdentifier(request: Request): string {
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
};
