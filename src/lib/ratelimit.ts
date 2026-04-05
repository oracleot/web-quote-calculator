import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Upstash Redis client — singleton reused across all rate limiters
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Slider for apply-coupon: 20 requests per minute per IP
const applyCouponLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
  analytics: false,
});

// Slider for inquiry: 10 requests per minute per IP
const inquiryLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: false,
});

/**
 * Extract client IP from Next.js request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() ?? realIp ?? 'unknown';
}

/**
 * Rate-limit an apply-coupon request. Returns true if allowed, false if limited.
 */
export async function rateLimitApplyCoupon(
  request: Request
): Promise<{ allowed: boolean; remaining?: number; reset?: number }> {
  const ip = getClientIp(request);
  const { success, remaining, reset } = await applyCouponLimiter.limit(ip);
  return { allowed: success, remaining, reset };
}

/**
 * Rate-limit an inquiry request. Returns true if allowed, false if limited.
 */
export async function rateLimitInquiry(
  request: Request
): Promise<{ allowed: boolean; remaining?: number; reset?: number }> {
  const ip = getClientIp(request);
  const { success, remaining, reset } = await inquiryLimiter.limit(ip);
  return { allowed: success, remaining, reset };
}
