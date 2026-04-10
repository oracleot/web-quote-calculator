'use client';

interface FinalConfirmationProps {
  selectedMaintenancePlan: 'none' | 'basic' | 'standard';
}

export default function FinalConfirmation({ selectedMaintenancePlan }: FinalConfirmationProps) {
  const planLabel =
    selectedMaintenancePlan === 'none'
      ? null
      : selectedMaintenancePlan === 'basic'
        ? 'Basic (£25/mo)'
        : 'Standard (£40/mo)';

  return (
    <div className="text-center py-6 space-y-5">
      <div className="success-ring w-16 h-16 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1.5">You are all set!</h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
          Your quote request is in. Dami will review your requirements and reach out within 24 hours.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--success-bg)] border border-[rgba(52,211,153,0.2)] rounded-full px-4 py-2">
        <svg className="w-3.5 h-3.5 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Check your inbox for a confirmation email
      </div>

      {planLabel ? (
        <div className="inline-flex items-center gap-2 text-xs text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent-muted)] rounded-full px-4 py-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {planLabel}
        </div>
      ) : (
        <div className="text-xs text-[var(--text-muted)]">No maintenance plan selected — reach out anytime.</div>
      )}
    </div>
  );
}
