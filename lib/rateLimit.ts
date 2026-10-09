/**
 * lib/rateLimit.ts
 *
 * Simple per-IP in-memory rate limiter for Node.js route handlers.
 * Uses a sliding window approach. Resets between server restarts (dev only).
 * For production, replace with Redis or Upstash.
 */

interface WindowEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, WindowEntry>();

/**
 * Checks and increments the rate limit for the given key (e.g. IP address).
 *
 * @param key      - Unique identifier (IP or composite)
 * @param limit    - Max requests allowed in the window
 * @param windowMs - Window duration in milliseconds
 * @returns { allowed: boolean; retryAfterMs: number }
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60_000
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Extracts the best-available IP from a Next.js Request object.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
