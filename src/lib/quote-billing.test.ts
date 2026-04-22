import { describe, it, expect } from 'vitest';
import type { QuoteFlowState } from '@/components/conversational/recommendations';
import { buildInvoiceQuery, buildQuotePricing } from '@/lib/quote-billing';

function makeState(partial: Partial<QuoteFlowState>): QuoteFlowState {
  return {
    currentStep: 5,
    history: [0, 1, 2, 3, 4],
    businessType: 'service',
    selectedPages: [],
    isMigration: false,
    isRevamp: false,
    migrationPageIds: [],
    selectedFeatures: [],
    maintenancePlan: 'none',
    ...partial,
  };
}

describe('quote-billing', () => {
  it('migration pricing excludes base fee and charges £50 per selected migration page', () => {
    const state = makeState({
      isMigration: true,
      migrationPageIds: ['home', 'about', 'contact'],
    });

    const pricing = buildQuotePricing(state);

    expect(pricing.basePrice).toBe(0);
    expect(pricing.pagesCost).toBe(150);
    expect(pricing.migrationFee).toBe(100);
    expect(pricing.total).toBe(250);
  });

  it('migration pricing includes revamp fee when selected', () => {
    const state = makeState({
      isMigration: true,
      isRevamp: true,
      migrationPageIds: ['home'],
      selectedFeatures: ['newsletter'],
    });

    const pricing = buildQuotePricing(state);

    // £50 page + £100 migration + £50 newsletter + £100 revamp
    expect(pricing.total).toBe(300);
    expect(pricing.revampFee).toBe(100);
  });

  it('invoice query includes migration params and selected items', () => {
    const state = makeState({
      isMigration: true,
      isRevamp: true,
      migrationPageIds: ['home', 'about'],
      selectedFeatures: ['newsletter'],
    });

    const query = buildInvoiceQuery(state);

    expect(query).toContain('/invoice?');
    expect(query).toContain('from=quote');
    expect(query).toContain('migration=true');
    expect(query).toContain('migrationPages=home%2Cabout');
    expect(query).toContain('features=newsletter');
    expect(query).toContain('revamp=true');
  });

  it('invoice query includes standard pages for non-migration flow', () => {
    const state = makeState({
      selectedPages: ['pricing', 'faq'],
      selectedFeatures: ['cms'],
    });

    const query = buildInvoiceQuery(state);

    expect(query).toContain('migration=false');
    expect(query).toContain('pages=pricing%2Cfaq');
    expect(query).toContain('features=cms');
  });
});
