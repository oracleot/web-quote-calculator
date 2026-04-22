# Design Spec: Migration Pricing + Invoice Alignment

Date: 2026-04-22
Owner: @dami
Status: Drafted for review

## 1) Goal
Align conversational quote flow and invoice generation so migration pricing and summary actions behave consistently.

Requested outcomes:
1. Migration path must never include the £250 base fee.
2. Generating an invoice from Summary must carry selected items into the invoice page.
3. Remove Summary-level “Get a Quote” CTA and keep only the fixed footer CTA.
4. Migration pages should appear in invoice as one rolled-up line item (not per-page rows).

## 2) Scope
In scope:
- Quote pricing model updates (new vs migration paths)
- Shared quote->billing mapping utility for consistency
- Summary “Generate Invoice” wiring
- Invoice prefill parser compatibility
- Summary CTA cleanup
- Tests for pricing and invoice prefill

Out of scope:
- Redesigning invoice UI layout
- Changing feature price values
- Any new checkout/payment flow

## 3) Proposed Architecture (Approach 2)
Introduce a shared mapper module used by both the conversational summary and invoice route.

### New module
`src/lib/quote-billing.ts`

Responsibilities:
- Compute quote totals from `QuoteFlowState` with canonical rules.
- Produce normalized billing payload for invoice prefill.
- Build URL query params used by “Generate Invoice”.

Exports:
- `buildQuotePricing(state: QuoteFlowState)`
  - Rules:
    - New build: include base £250, plus extra pages, features.
    - Migration: base fee is always £0, plus migration pages (£50 each), migration fee (£100), optional revamp (£100), plus features.
- `buildInvoicePrefill(state: QuoteFlowState)`
  - Returns normalized items:
    - Base line (new builds only)
    - Page line:
      - New build: existing behavior (optional pages modeling retained)
      - Migration: one rolled-up line item `Migration Pages (N × £50)`
    - Feature lines
    - Migration fee line (if migration)
    - Revamp fee line (if selected)
- `buildInvoiceQuery(state: QuoteFlowState)`
  - Encodes prefill-safe query params for `/invoice?from=quote...`
  - Includes mode marker for migration rollup + revamp.

## 4) Component / File Changes

### A. `src/lib/pricing.ts`
- Update `calculateQuote()` so migration path never applies base £250.
- Preserve existing return shape where practical to reduce breakage.

### B. `src/components/conversational/QuoteStep.tsx`
- In `StepSummary`, switch pricing computation to shared `buildQuotePricing(state)`.
- Update “Generate Invoice” link to use `buildInvoiceQuery(state)`.
- Remove summary “Get a Quote” button.

### C. `src/app/invoice/page.tsx`
- Extend/adjust `buildInvoiceFromParams()` to parse new query format.
- For migration page selections, add exactly one rolled-up line item.
- Parse revamp flag and append line item when present.

### D. Optional consistency touchpoint
- If any other component computes totals directly, prefer shared mapper to avoid drift.

## 5) Data Flow
1. User completes conversational steps.
2. Summary computes totals using `buildQuotePricing(state)`.
3. Clicking “Generate Invoice” navigates to `/invoice` with query created by `buildInvoiceQuery(state)`.
4. Invoice page parses query and creates line items via prefill parser.
5. Invoice opens with all expected rows pre-populated.

## 6) Error Handling & Fallbacks
- Unknown page/feature IDs in query are ignored safely.
- Empty/invalid query falls back to blank invoice (current behavior).
- If migration mode is set with zero pages, migration page rolled-up row is omitted, but migration fee row remains.

## 7) Testing Plan

### Unit tests
- `pricing` or new mapper tests:
  - Migration path total excludes base fee.
  - Migration total formula: `migrationFee + pageCount*50 + features + revamp(optional)`.
  - New build path still includes base fee behavior.

### Invoice prefill tests
- Query from migration summary yields:
  - one rolled-up migration pages line
  - migration fee line
  - revamp line when selected
  - selected feature lines
- Query from new build summary yields expected base/page/feature lines.

### UI tests
- Summary no longer renders “Get a Quote” button.
- Summary still renders “Generate Invoice”.

## 8) Rollout / Risk
Risks:
- Price discrepancy if any old direct-calculation path remains.
Mitigation:
- Centralize total computation through shared mapper and update call sites.

## 9) Acceptance Criteria
- Migration flow quote never adds £250 base.
- Invoice opened from Summary includes all selected items correctly.
- Migration pages appear as one rolled-up invoice line item.
- Summary has no duplicate “Get a Quote” CTA.
- Tests pass (`lint`, relevant unit/component tests).

## 10) Implementation Notes
- Keep query payload compact but explicit (`migration=true`, `revamp=true|false`, `migrationPages=...`, etc.).
- Maintain backward compatibility in invoice parser where possible for existing links.
