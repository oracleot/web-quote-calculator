# SPEC: SUL-86 — Social Feed Integration (£80)

## Goal
Update the existing social add-on so it is sold as:
- **Name:** Social Feed Integration
- **Price:** **£80**

This should replace the current lower-priced social integration option everywhere the quote UI and pricing summaries show feature data.

## Requirements

### 1) Update pricing source of truth
- In `src/lib/pricing.ts`, update existing `social` feature entry:
  - Label: `Social Feed Integration`
  - Price: `80`
  - Description: clarify this is embedded social feeds/content updates on site

### 2) Propagate through UI automatically
- Ensure the updated social feature text and price appear in:
  - Feature selector cards
  - Quote summary breakdown
  - Sidebar / bottom-sheet selected items
  - Invoice-related feature pickers that consume `FEATURES`

### 3) Tests
- Update `FeatureSelector.test.tsx` assertions to reflect the new social feature label/price
- Add/adjust a quote-related test to verify social feature pricing contributes **£80**

## Non-goals
- Building real-time social API syncing
- New backend endpoints
- Changes to non-social add-on pricing

## Validation
1. `npx vitest run`
2. `npm run build`

## Expected Outcome
Users see **Social Feed Integration (+£80)** consistently throughout the product, and quote totals include the correct +£80 when selected.
