'use client';

import QuoteSummary from '@/components/QuoteSummary';

interface QuoteReviewPanelProps {
  selectedPageIds: string[];
  selectedFeatureIds: string[];
  siteType: 'one-page' | 'multi-page';
  isMigration: boolean;
  couponDiscount: number | null;
  couponCode: string;
  originalTotal: number;
  onEditPages: () => void;
  onEditFeatures: () => void;
  onProceed: () => void;
}

export default function QuoteReviewPanel({
  selectedPageIds,
  selectedFeatureIds,
  siteType,
  isMigration,
  couponDiscount,
  couponCode,
  originalTotal,
  onEditPages,
  onEditFeatures,
  onProceed,
}: QuoteReviewPanelProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Edit links */}
      <div className="flex items-center gap-4 mb-5 justify-center text-xs">
        <button
          onClick={onEditPages}
          className="flex items-center gap-1.5 text-[var(--accent)] hover:underline transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit pages
        </button>
        <span className="text-[var(--text-muted)]">·</span>
        <button
          onClick={onEditFeatures}
          className="flex items-center gap-1.5 text-[var(--accent)] hover:underline transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit features
        </button>
      </div>

      {/* Quote summary */}
      <QuoteSummary
        selectedPageIds={selectedPageIds}
        selectedFeatureIds={selectedFeatureIds}
        siteType={siteType}
        isMigration={isMigration}
        couponDiscount={couponDiscount}
        couponCode={couponCode || null}
        originalTotal={originalTotal}
      />

      {/* Proceed CTA */}
      <div className="mt-6">
        <button
          onClick={onProceed}
          className="btn-primary w-full py-3.5"
        >
          <span className="flex items-center justify-center gap-2">
            Proceed to Submit
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
