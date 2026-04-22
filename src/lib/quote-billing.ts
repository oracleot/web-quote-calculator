import type { QuoteFlowState } from '@/components/conversational/recommendations';
import { calculateQuote, PRICE_PER_EXTRA_PAGE } from '@/lib/pricing';

export interface QuotePricingBreakdown {
  basePrice: number;
  pagesCost: number;
  extraPages: number;
  featuresCost: number;
  migrationFee: number;
  revampFee: number;
  total: number;
  pageCount: number;
  isMigration: boolean;
}

export function buildQuotePricing(state: QuoteFlowState): QuotePricingBreakdown {
  const selectedPageIds = state.isMigration ? state.migrationPageIds : state.selectedPages;
  const quote = calculateQuote(selectedPageIds, state.selectedFeatures, { isMigration: state.isMigration });
  const revampFee = state.isMigration && state.isRevamp ? 100 : 0;

  return {
    ...quote,
    revampFee,
    total: quote.total + revampFee,
    pageCount: selectedPageIds.length,
    isMigration: state.isMigration,
  };
}

export function buildInvoiceQuery(state: QuoteFlowState): string {
  const params = new URLSearchParams();
  params.set('from', 'quote');
  params.set('migration', String(state.isMigration));

  if (state.isMigration) {
    if (state.migrationPageIds.length > 0) {
      params.set('migrationPages', state.migrationPageIds.join(','));
    }
    if (state.isRevamp) {
      params.set('revamp', 'true');
    }
  } else if (state.selectedPages.length > 0) {
    params.set('pages', state.selectedPages.join(','));
  }

  if (state.selectedFeatures.length > 0) {
    params.set('features', state.selectedFeatures.join(','));
  }

  if (state.maintenancePlan !== 'none') {
    params.set('maintenance', state.maintenancePlan);
  }

  return `/invoice?${params.toString()}`;
}

export function buildMigrationPagesLabel(pageCount: number): string {
  return `Migration Pages (${pageCount} × £${PRICE_PER_EXTRA_PAGE})`;
}
