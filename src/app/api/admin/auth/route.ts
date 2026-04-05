import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per minute per IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!rateLimit(`admin-auth:${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = request.headers.get('x-admin-password');

  if (!adminPassword) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  if (providedPassword !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Generate secure session token
  const token = createSession(adminPassword);

  return NextResponse.json({ ok: true, token });
}
