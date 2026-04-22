'use client';

import { FEATURES, BASE_PRICE, PAGES_INCLUDED, PRICE_PER_EXTRA_PAGE } from '@/lib/pricing';
import { buildQuotePricing } from '@/lib/quote-billing';
import type { QuoteFlowState } from './recommendations';

interface PriceRationaleProps {
  state: QuoteFlowState;
}

export default function PriceRationale({ state }: PriceRationaleProps) {
  const { selectedFeatures, isMigration } = state;
  const pricing = buildQuotePricing(state);
  const pageCount = pricing.pageCount;
  const extraPages = pricing.extraPages;
  const featuresCost = pricing.featuresCost;
  const migrationFee = pricing.migrationFee;

  return (
    <div className="space-y-2 text-sm">
      {/* Base price */}
      {!isMigration && (
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <span className="text-[var(--text-secondary)]">Base website package: </span>
            <span className="font-mono font-medium text-[var(--text-primary)]">£{BASE_PRICE}</span>
            <span className="text-[var(--text-muted)]"> — includes up to {PAGES_INCLUDED} pages</span>
          </div>
        </div>
      )}

      {/* Pages explanation */}
      {pageCount > 0 && (
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <div>
            {isMigration ? (
              <>
                <span className="text-[var(--text-secondary)]">Migration pages ({pageCount} × £{PRICE_PER_EXTRA_PAGE}): </span>
                <span className="font-mono font-medium text-[var(--accent)]">+£{pricing.pagesCost}</span>
              </>
            ) : pageCount <= PAGES_INCLUDED ? (
              <>
                <span className="text-[var(--text-secondary)]">{pageCount} page{pageCount !== 1 ? 's' : ''} selected: </span>
                <span className="text-[var(--text-muted)]">all included in base price</span>
              </>
            ) : (
              <>
                <span className="text-[var(--text-secondary)]">{pageCount} pages selected ({extraPages} extra): </span>
                <span className="font-mono font-medium text-[var(--accent)]">+£{pricing.pagesCost}</span>
                <span className="text-[var(--text-muted)]"> ({extraPages} × £{PRICE_PER_EXTRA_PAGE})</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Features explanation */}
      {selectedFeatures.length > 0 && (
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="text-[var(--text-secondary)]">{selectedFeatures.length} add-on{selectedFeatures.length !== 1 ? 's' : ''} selected: </span>
            <span className="font-mono font-medium text-[var(--accent)]">+£{featuresCost}</span>
            {selectedFeatures.length > 0 && (
              <div className="text-[var(--text-muted)] mt-1 space-y-0.5">
                {selectedFeatures.map((id) => {
                  const f = FEATURES.find((feat) => feat.id === id);
                  if (!f) return null;
                  return (
                    <div key={id} className="flex items-center gap-1.5 pl-2">
                      <span>·</span>
                      <span>{f.label}</span>
                      <span className="font-mono text-xs">+£{f.price}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Migration fee */}
      {isMigration && (
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <div>
            <span className="text-[var(--text-secondary)]">Existing site migration: </span>
            <span className="font-mono font-medium text-[var(--accent)]">+£{migrationFee}</span>
            <span className="text-[var(--text-muted)]"> — audit, transfer, redirects</span>
          </div>
        </div>
      )}

      {pageCount === 0 && selectedFeatures.length === 0 && !isMigration && (
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[var(--text-muted)]">Select pages and add-ons to see your price breakdown</span>
        </div>
      )}
    </div>
  );
}
