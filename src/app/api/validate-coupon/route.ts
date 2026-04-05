import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter: 20 requests per minute per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
  analytics: false,
});

export async function POST(request: NextRequest) {
  // Rate limit: 20 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown';

  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { code, email } = body;

    // Always return generic response to prevent email enumeration
    if (!code || !email) {
      return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
    }

    // Validate email format before processing
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
    }

    const result = await validateCoupon(code, email);

    // Always return generic invalid message regardless of why it failed
    if (!result.valid) {
      return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Coupon validation error:', error);
    // Always return generic response - don't leak internal errors
    return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
  }
}
