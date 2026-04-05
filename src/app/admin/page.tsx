'use client';

import { useState, useEffect, useCallback } from 'react';

interface Coupon {
  code: string;
  clientEmail: string;
  discountPercent: number;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  usedAt: string | null;
}

function getCouponStatus(coupon: Coupon): 'active' | 'used' | 'expired' {
  if (coupon.used) return 'used';
  if (Date.now() > new Date(coupon.expiresAt).getTime()) return 'expired';
  return 'active';
}

function StatusBadge({ status }: { status: 'active' | 'used' | 'expired' }) {
  const styles = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    used: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    expired: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  const labels = { active: 'Active', used: 'Used', expired: 'Expired' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [discount, setDiscount] = useState('');
  const [formError, setFormError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    if (sessionStorage.getItem('admin_session_token')) {
      setAuthed(true);
    }
  }, []);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/coupons', {
        headers: { 'x-session-token': sessionStorage.getItem('admin_session_token') || '' },
      });
      if (!res.ok) throw new Error('Failed to load coupons');
      const data = await res.json();
      setCoupons(data.coupons);
    } catch {
      setError('Failed to load coupons. Is the admin password set?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchCoupons();
  }, [authed, fetchCoupons]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'x-admin-password': password },
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem('admin_session_token', data.token);
        setAuthed(true);
      } else {
        setAuthError('Incorrect password');
      }
    } catch {
      setAuthError('Connection error — is the server running?');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    const discountNum = Number(discount);
    if (!discount || isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
      setFormError('Discount must be a number between 1 and 100');
      return;
    }

    setCreateLoading(true);
    try {
      const sessionToken = sessionStorage.getItem('admin_session_token') || '';
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'x-session-token': sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientEmail: email, discountPercent: discountNum }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create coupon');
      }

      const data = await res.json();
      setGeneratedCode(data.coupon.code);
      setEmail('');
      setDiscount('');
      fetchCoupons();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create coupon');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const sessionToken = sessionStorage.getItem('admin_session_token') || '';
      const res = await fetch('/api/admin/coupons', {
        method: 'DELETE',
        headers: {
          'x-session-token': sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: deleteTarget.code }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setDeleteTarget(null);
      fetchCoupons();
    } catch {
      alert('Failed to delete coupon');
    } finally {
      setDeleteLoading(false);
    }
  }

  // Auth screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-grid flex items-center justify-center p-4">
        <div className="ambient-glow" />
        <div className="card p-8 w-full max-w-sm animate-scale-in" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Admin Access</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Enter password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              className="form-input"
              autoFocus
            />
            {authError && (
              <p className="text-sm text-[var(--error)] bg-[var(--error-bg)] px-4 py-2 rounded-lg border border-red-500/20">
                {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={authLoading || !password}
              className="btn-primary w-full justify-center"
            >
              {authLoading ? 'Verifying…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      <div className="ambient-glow" />
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Coupon Management</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Manage discount coupons for clients</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchCoupons}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => { sessionStorage.removeItem('admin_session_token'); setAuthed(false); }}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Create Coupon */}
        <div className="card p-6 animate-fade-in-up">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Create New Coupon</h2>

          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Client email address"
              className="form-input flex-1"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                placeholder="%"
                min={1}
                max={100}
                className="form-input w-24 text-center"
              />
              <span className="text-[var(--text-muted)] text-sm">% off</span>
            </div>
            <button
              type="submit"
              disabled={createLoading}
              className="btn-primary whitespace-nowrap"
            >
              {createLoading ? 'Creating…' : 'Generate Coupon'}
            </button>
          </form>

          {formError && (
            <p className="text-sm text-[var(--error)] bg-[var(--error-bg)] px-4 py-2 rounded-lg border border-red-500/20 mb-4">
              {formError}
            </p>
          )}

          {generatedCode && (
            <div className="animate-scale-in bg-[var(--success-bg)] border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1">Coupon Generated</p>
                <p className="text-2xl font-mono font-bold text-[var(--text-primary)] tracking-widest">{generatedCode}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="btn-secondary flex items-center gap-2 text-sm shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          )}
        </div>

        {/* Coupons List */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">All Coupons</h2>
            <span className="chip">{coupons.length} total</span>
          </div>

          {error && (
            <p className="text-sm text-[var(--error)] bg-[var(--error-bg)] px-4 py-2 rounded-lg border border-red-500/20 mb-4">
              {error}
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="w-6 h-6 text-[var(--accent)] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No coupons yet. Create one above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className="pb-3 font-medium text-[var(--text-muted)]">Code</th>
                    <th className="pb-3 font-medium text-[var(--text-muted)]">Client Email</th>
                    <th className="pb-3 font-medium text-[var(--text-muted)]">Discount</th>
                    <th className="pb-3 font-medium text-[var(--text-muted)]">Status</th>
                    <th className="pb-3 font-medium text-[var(--text-muted)]">Created</th>
                    <th className="pb-3 font-medium text-[var(--text-muted)]">Expires</th>
                    <th className="pb-3 font-medium text-[var(--text-muted)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon, i) => {
                    const status = getCouponStatus(coupon);
                    return (
                      <tr
                        key={coupon.code}
                        className={`border-b border-[var(--border)] last:border-0 ${i % 2 === 0 ? '' : 'bg-[var(--bg-elevated)]/40'}`}
                      >
                        <td className="py-3 font-mono font-semibold text-[var(--accent)]">{coupon.code}</td>
                        <td className="py-3 text-[var(--text-secondary)]">{coupon.clientEmail}</td>
                        <td className="py-3 text-[var(--text-secondary)]">{coupon.discountPercent}%</td>
                        <td className="py-3">
                          <StatusBadge status={status} />
                        </td>
                        <td className="py-3 text-[var(--text-muted)]">{coupon.createdAt}</td>
                        <td className="py-3 text-[var(--text-muted)]">
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => setDeleteTarget(coupon)}
                            className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="card p-6 w-full max-w-sm mx-4 animate-scale-in">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Delete Coupon?</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete <span className="font-mono font-semibold text-[var(--accent)]">{deleteTarget.code}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="btn-primary flex-1 !bg-red-600 hover:!bg-red-500"
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
