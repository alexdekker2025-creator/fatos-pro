/**
 * Rate Limiting Utility
 * 
 * Provides rate limiting functionality using LRU cache
 */

import { LRUCache } from 'lru-cache';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Create LRU cache for rate limiting
// Max 500 entries, TTL of 60 seconds
const rateLimitCache = new LRUCache<string, RateLimitEntry>({
  max: 500,
  ttl: 60000, // 1 minute
});

/**
 * Check if identifier has exceeded rate limit
 * 
 * @param identifier - Unique identifier (userId, IP address, etc.)
 * @param limit - Maximum number of requests allowed (default: 100)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns true if within limit, false if exceeded
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitCache.get(identifier);
  
  // No entry or entry expired
  if (!entry || now > entry.resetAt) {
    rateLimitCache.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    return false;
  }
  
  // Increment count
  entry.count++;
  rateLimitCache.set(identifier, entry);
  return true;
}

/**
 * Get remaining requests for identifier
 * 
 * @param identifier - Unique identifier
 * @param limit - Maximum number of requests allowed
 * @returns Number of remaining requests
 */
export function getRemainingRequests(
  identifier: string,
  limit: number = 100
): number {
  const entry = rateLimitCache.get(identifier);
  
  if (!entry) {
    return limit;
  }
  
  const now = Date.now();
  if (now > entry.resetAt) {
    return limit;
  }
  
  return Math.max(0, limit - entry.count);
}

/**
 * Get time until rate limit resets
 * 
 * @param identifier - Unique identifier
 * @returns Seconds until reset, or 0 if no limit active
 */
export function getResetTime(identifier: string): number {
  const entry = rateLimitCache.get(identifier);
  
  if (!entry) {
    return 0;
  }
  
  const now = Date.now();
  if (now > entry.resetAt) {
    return 0;
  }
  
  return Math.ceil((entry.resetAt - now) / 1000);
}

/**
 * Reset rate limit for identifier
 * 
 * @param identifier - Unique identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitCache.delete(identifier);
}
