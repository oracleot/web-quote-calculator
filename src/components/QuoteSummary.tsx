'use client';

import { PAGES, FEATURES, calculateQuote } from '@/lib/pricing';

interface QuoteSummaryProps {
  selectedPageIds: string[];
  selectedFeatureIds: string[];
  siteType: 'one-page' | 'multi-page';
  isMigration?: boolean;
  couponDiscount?: number | null;
  couponCode?: string | null;
  originalTotal?: number | null;
  maintenancePlan?: 'none' | 'basic' | 'standard';
}

export default function QuoteSummary({
  selectedPageIds,
  selectedFeatureIds,
  siteType,
  isMigration = false,
  couponDiscount,
  couponCode,
  originalTotal,
  maintenancePlan,
}: QuoteSummaryProps) {
  const quote = calculateQuote(selectedPageIds, selectedFeatureIds, { isMigration });
  const selectedPages = PAGES.filter((p) => selectedPageIds.includes(p.id));
  const selectedFeatures = FEATURES.filter((f) => selectedFeatureIds.includes(f.id));

  const hasExtraPages = quote.extraPages > 0;
  const hasCoupon = couponDiscount && couponDiscount > 0;
  const discountAmount = hasCoupon && originalTotal ? Math.round((originalTotal * couponDiscount) / 100) : 0;
  const finalTotal = hasCoupon && originalTotal ? originalTotal - discountAmount : quote.total;

  return (
    <div className="space-y-4">
      {/* Hero price display — big monospace number, no gradient/glow */}
      <div className="text-center py-4 px-2">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium mb-3">
          Your Estimate
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="price-hero-currency">£</span>
          {hasCoupon ? (
            <>
              <span className="price-hero line-through opacity-50 mr-1">
                {originalTotal}
              </span>
              <span className="price-hero price-hero-discounted">
                {finalTotal}
              </span>
            </>
          ) : (
            <span className="price-hero" key={quote.total}>
              {quote.total}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          {maintenancePlan && maintenancePlan !== 'none' ? 'One-time · GBP · estimates exclude VAT' : 'GBP · estimates exclude VAT'}
        </p>
        {maintenancePlan && maintenancePlan !== 'none' && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent-muted)] bg-[var(--accent-subtle)]">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-semibold text-[var(--accent)] capitalize">{maintenancePlan} Plan</span>
            <span className="text-sm font-mono font-bold text-[var(--accent)]">
              · £{maintenancePlan === 'basic' ? '25' : '40'}/mo
            </span>
          </div>
        )}
      </div>

      {/* Quote card */}
      <div className="quote-total p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] border border-[rgba(34,211,238,0.2)] flex items-center justify-center">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] text-sm">Quote Breakdown</h3>
        </div>

        <div className="space-y-2.5 text-sm">
          {/* Base */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Base package
            </div>
            <span className="font-medium text-[var(--text-primary)] font-mono">£{quote.basePrice}</span>
          </div>

          {/* Included pages */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Up to 4 pages included
            </div>
            <span className="text-[var(--text-muted)] text-xs">free</span>
          </div>

          {/* Extra pages */}
          {hasExtraPages && (
            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Extra pages ({quote.extraPages} × £50)
              </div>
              <span className="font-medium text-[var(--text-primary)] font-mono">£{quote.pagesCost}</span>
            </div>
          )}

          {/* Features */}
          {selectedFeatures.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
              {selectedFeatures.map((f) => (
                <div key={f.id} className="flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {f.label}
                  </div>
                  <span className="font-medium text-[var(--text-primary)] font-mono">£{f.price}</span>
                </div>
              ))}
            </div>
          )}

          {/* Migration fee */}
          {isMigration && (
            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Migration (audit, transfer, redirects)
              </div>
              <span className="font-medium text-[var(--text-primary)] font-mono">£{quote.migrationFee}</span>
            </div>
          )}

          {/* Coupon discount */}
          {hasCoupon && (
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[rgba(52,211,153,0.15)] animate-fade-in">
              <div className="flex items-center gap-2 text-[var(--success)]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Coupon ({couponCode}): -{couponDiscount}%
              </div>
              <span className="font-medium text-[var(--success)] font-mono">-£{discountAmount}</span>
            </div>
          )}

          {/* Total — secondary display below the hero */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--border)]">
            <span className="text-[var(--text-secondary)] font-medium">Total Estimate</span>
            <div className="flex items-center gap-2">
              {hasCoupon ? (
                <>
                  <span className="text-sm font-bold text-[var(--text-muted)] line-through font-mono count-up">
                    £{originalTotal}
                  </span>
                  <span className="text-lg font-bold text-[var(--success)] font-mono count-up">
                    £{finalTotal}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-[var(--text-primary)] font-mono count-up">£{quote.total}</span>
              )}
              <div className="text-xs text-[var(--text-muted)]">GBP</div>
            </div>
          </div>

          {/* Monthly fee */}
          {maintenancePlan && maintenancePlan !== 'none' && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-[var(--text-secondary)] font-medium">Monthly Fee</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[var(--accent)] font-mono count-up">
                  £{maintenancePlan === 'basic' ? '25' : '40'}
                </span>
                <div className="text-xs text-[var(--text-muted)]">/mo</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Website type */}
      <div className="animate-fade-in">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-1">
          Website Type
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="chip">
            <svg className="w-3 h-3 mr-1.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {siteType === 'one-page' ? 'One-Page Website' : 'Multi-Page Website'}
          </span>
        </div>
      </div>

      {/* Selected pages chips */}
      {selectedPages.length > 0 && (
        <div className="animate-fade-in">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-1">
            Selected Pages ({selectedPages.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedPages.map((p) => (
              <span key={p.id} className="chip">
                <svg className="w-3 h-3 mr-1.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Selected features chips */}
      {selectedFeatures.length > 0 && (
        <div className="animate-fade-in">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-1">
            Selected Add-ons ({selectedFeatures.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedFeatures.map((f) => (
              <span key={f.id} className="chip">
                <svg className="w-3 h-3 mr-1.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {f.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Trust signals */}
      <div className="flex items-center gap-4 pt-2 px-1">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          No commitment
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Estimate only
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Response within 24h
        </div>
      </div>
    </div>
  );
}
