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
  maintenancePlan: 'none' | 'basic' | 'standard';
  onEditPages: () => void;
  onEditFeatures: () => void;
  onEditPlan: () => void;
}

export default function QuoteReviewPanel({
  selectedPageIds,
  selectedFeatureIds,
  siteType,
  isMigration,
  couponDiscount,
  couponCode,
  originalTotal,
  maintenancePlan,
  onEditPages,
  onEditFeatures,
  onEditPlan,
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
        <span className="text-[var(--text-muted)]">·</span>
        <button
          onClick={onEditPlan}
          className="flex items-center gap-1.5 text-[var(--accent)] hover:underline transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit plan
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
        maintenancePlan={maintenancePlan}
      />
    </div>
  );
}
