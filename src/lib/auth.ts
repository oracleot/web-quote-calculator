import crypto from 'crypto';

const MAX_MAP_SIZE = 1000;

// In-memory session token store (token -> password hash + expiry)
const sessions = new Map<string, { passwordHash: string; expiresAt: number }>();

// Rate limiting for auth attempts
const authRateLimits = new Map<string, { count: number; resetAt: number }>();

function evictOldest(map: Map<string, unknown>): void {
  if (map.size >= MAX_MAP_SIZE) {
    // Delete the oldest ~10% of entries to avoid clearing too often
    const toDelete = Math.ceil(MAX_MAP_SIZE * 0.1);
    const keys = map.keys();
    for (let i = 0; i < toDelete; i++) {
      const key = keys.next().value;
      if (key !== undefined) map.delete(key);
    }
  }
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = authRateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    evictOldest(authRateLimits);
    authRateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function createSession(adminPassword: string): string {
  evictOldest(sessions);
  const token = crypto.randomBytes(32).toString('hex');
  const passwordHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  sessions.set(token, { passwordHash, expiresAt });
  return token;
}

export function validateSession(token: string, adminPassword: string): boolean {
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }

  const passwordHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
  const expectedBuf = Buffer.from(session.passwordHash, 'hex');
  const actualBuf = Buffer.from(passwordHash, 'hex');

  // Constant-time comparison to prevent timing side-channels
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}
