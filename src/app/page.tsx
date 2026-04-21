'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateQuote } from '@/lib/pricing';
import { useDirection } from '@/hooks/useDirection';
import { useSelectionList } from '@/hooks/useSelectionList';
import QuoteFlow from '@/components/conversational/QuoteFlow';
import type { QuoteFlowState } from '@/components/conversational/recommendations';
import FormPanel from '@/components/FormPanel';
import Step6Content from '@/components/steps/Step6Content';
import QuoteSummary from '@/components/QuoteSummary';

const EMPTY_IDS: string[] = Object.freeze([]) as unknown as string[];
type CouponStatus = 'idle' | 'valid' | 'invalid' | 'error';

export default function Home() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<CouponStatus>('idle');
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFormPanel, setShowFormPanel] = useState(false);
  const [flowState, setFlowState] = useState<QuoteFlowState | null>(null);

  const { direction, goNext, goPrev } = useDirection();

  const quote = useMemo(() => {
    if (!flowState) return calculateQuote([], []);
    return calculateQuote(flowState.selectedPages, flowState.selectedFeatures, { isMigration: flowState.isMigration });
  }, [flowState]);

  const selectedPageItems = useSelectionList(flowState?.selectedPages ?? [], EMPTY_IDS);
  const selectedFeatureItems = useSelectionList(EMPTY_IDS, flowState?.selectedFeatures ?? []);

  const handleCouponBlur = async () => {
    if (!couponCode.trim() || !clientEmail.trim()) { setCouponStatus('idle'); setCouponDiscount(null); return; }
    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, email: clientEmail }),
      });
      const data = await res.json();
      if (data.valid) { setCouponStatus('valid'); setCouponDiscount(data.discountPercent); }
      else { setCouponStatus('invalid'); setCouponDiscount(null); }
    } catch { setCouponStatus('error'); setCouponDiscount(null); }
  };

  const handleSubmit = async () => {
    if (!flowState) return;
    setIsSubmitting(true); setError(null);
    try {
      if (couponStatus === 'valid' && couponCode && clientEmail) {
        await fetch('/api/apply-coupon', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: couponCode, email: clientEmail }) });
      }
      const res = await fetch('/api/inquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          selectedPageIds: flowState.selectedPages,
          selectedFeatureIds: flowState.selectedFeatures,
          siteType: 'multi-page' as const,
          isMigration: flowState.isMigration,
          couponCode: couponStatus === 'valid' ? couponCode : undefined,
          couponDiscount: couponStatus === 'valid' ? couponDiscount : undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to send inquiry');
      setIsSuccess(true);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const handleProceedToForm = (state: QuoteFlowState) => {
    setFlowState(state);
    setShowFormPanel(true);
  };

  const handleCloseFormPanel = () => {
    setShowFormPanel(false);
    goPrev();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="pt-10 pb-6 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent-muted)] bg-[var(--accent-subtle)] text-xs font-medium text-[var(--accent)] mb-6 animate-fade-in">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant estimate · No commitment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2 animate-fade-in-up font-display">
            Website Quote Calculator
          </h1>
          <p className="text-[var(--text-secondary)] text-base max-w-md mx-auto animate-fade-in-up">
            Build your perfect website quote in minutes — transparent pricing, no surprises.
          </p>
        </header>

        <main className="flex-1 pb-32">
          <QuoteFlow onProceedToForm={handleProceedToForm} />
        </main>

        <footer className="px-4 pb-8 text-center">
          <p className="text-xs text-[var(--text-muted)]">All quotes are estimates. Final pricing may vary based on project specifics.</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Need to bill a client?{' '}
            <Link href="/invoice" className="text-[var(--accent)] hover:underline">
              Open Invoice Generator →
            </Link>
          </p>
        </footer>
      </div>

      <FormPanel
        open={showFormPanel}
        onClose={handleCloseFormPanel}
        name={clientName}
        email={clientEmail}
        couponCode={couponCode}
        couponStatus={couponStatus}
        couponDiscount={couponDiscount}
        isMigration={flowState?.isMigration ?? false}
        onNameChange={setClientName}
        onEmailChange={setClientEmail}
        onCouponChange={setCouponCode}
        onCouponValidate={handleCouponBlur}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        error={error}
      />
    </div>
  );
}
