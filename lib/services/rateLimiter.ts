import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client only if credentials are available
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Create rate limiter: 3 requests per hour per IP
const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'ratelimit:contact',
    })
  : null;

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  // If rate limiting is not configured, allow all requests
  if (!ratelimit) {
    return {
      allowed: true,
      limit: 999,
      remaining: 999,
      reset: Date.now() + 3600000,
    };
  }
  
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
  
  return {
    allowed: success,
    limit,
    remaining,
    reset,
    retryAfter: success ? undefined : Math.ceil((reset - Date.now()) / 1000),
  };
}

// For testing/development: bypass rate limiting
export async function resetRateLimit(identifier: string): Promise<void> {
  if (process.env.NODE_ENV === 'development' && redis) {
    await redis.del(`ratelimit:contact:${identifier}`);
  }
}
