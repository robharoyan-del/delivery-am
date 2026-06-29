/**
 * In-memory rate limiter.
 * For production, replace with Redis (Upstash) or Vercel KV.
 *
 * Future: import { Ratelimit } from '@upstash/ratelimit'
 *         import { Redis }      from '@upstash/redis'
 */

const WINDOW_MS  = 60_000  // 1 minute
const MAX_TOKENS = 20      // requests per window per IP

interface Bucket {
  count: number
  reset: number
}

// In-memory store — does NOT persist across serverless function invocations
const store = new Map<string, Bucket>()

export interface RateLimitResult {
  ok:        boolean
  remaining: number
  reset:     number     // unix ms
}

export function checkRateLimit(identifier: string, limit = MAX_TOKENS): RateLimitResult {
  const now   = Date.now()
  const entry = store.get(identifier)

  if (!entry || now > entry.reset) {
    store.set(identifier, { count: 1, reset: now + WINDOW_MS })
    return { ok: true, remaining: limit - 1, reset: now + WINDOW_MS }
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, reset: entry.reset }
  }

  entry.count++
  return { ok: true, remaining: limit - entry.count, reset: entry.reset }
}

/** Extract the real IP from Next.js request headers */
export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}
