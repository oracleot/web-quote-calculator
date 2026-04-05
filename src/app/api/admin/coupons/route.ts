import { NextRequest, NextResponse } from 'next/server';
import { getAllCoupons, createCoupon, deleteCoupon } from '@/lib/coupons';
import { validateSession } from '@/lib/auth';

function checkAdminAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  // Support session token (preferred)
  const token = request.headers.get('x-session-token');
  if (token) {
    return validateSession(token, adminPassword);
  }

  // Fallback to password (deprecated, but needed for backward compat during transition)
  const providedPassword = request.headers.get('x-admin-password');
  return providedPassword === adminPassword;
}

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const coupons = await getAllCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Admin get coupons error:', error);
    return NextResponse.json({ error: 'Failed to get coupons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { clientEmail, discountPercent } = body;

    if (!clientEmail || !discountPercent) {
      return NextResponse.json(
        { error: 'Missing required fields: clientEmail, discountPercent' },
        { status: 400 }
      );
    }

    if (discountPercent < 1 || discountPercent > 100) {
      return NextResponse.json(
        { error: 'discountPercent must be between 1 and 100' },
        { status: 400 }
      );
    }

    const coupon = await createCoupon(clientEmail, discountPercent);
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Admin create coupon error:', message);
    return NextResponse.json({ error: 'Failed to create coupon', details: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Missing required field: code' }, { status: 400 });
    }

    const deleted = await deleteCoupon(code);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete coupon error:', error);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
