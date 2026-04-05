import { NextRequest, NextResponse } from 'next/server';
import { applyCoupon } from '@/lib/coupons';
import { rateLimitApplyCoupon } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  // Rate limit: 20 requests per minute per IP
  const { allowed } = await rateLimitApplyCoupon(request);
  if (!allowed) {
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

    const result = await applyCoupon(code, email);

    // Always return generic invalid message if not valid
    if (!result.valid) {
      return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Coupon apply error:', error);
    // Always return generic response - don't leak internal errors
    return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
  }
}
