# SUL-88 Quote Flow Polish — Design Spec

Date: 2026-04-21
Owner: SUL-88
Status: Approved for spec drafting (implementation not started)

## 1) Scope and Goals

This spec covers targeted UX and behavior fixes for the conversational quote flow:

1. Step indicator visual/layout fixes
2. Migration path copy and pricing behavior correction
3. Pages step “Show more” blank-state bug fix
4. Revamp step visibility in migration step indicator
5. Summary “Why this price?” migration relevance fix
6. Summary CTA cleanup (remove inline "Get a Quote")
7. Restore invoice generation handoff with selected items

Out of scope:
- Rewriting the whole wizard architecture
- Modifying `src/lib/pricing.ts`
- Changing inquiry submission flow and “All Done” behavior

---

## 2) Confirmed Product Decisions

### Flow order

**Non-migration path (5 visible steps):**
1. Business Type
2. Migration?
3. Pages
4. Features
5. Summary

**Migration path (6 visible steps):**
1. Business Type
2. Migration?
3. Migration Pages
4. Revamp
5. Features
6. Summary

### Pricing decisions

- Migration = yes adds **£100 migration baseline fee**
- Migration pages add **£50 per selected page**
- Revamp (if selected) adds **£100**
- Non-migration keeps existing base-package model (base + extras)
- Migration summary/rationale must not show non-migration base-package rationale

### Invoice handoff

- Use **storage-based handoff** (not URL params)
- Include all priced selections in payload:
  - base package (non-migration only)
  - page extras / migration pages
  - migration fee
  - revamp fee
  - selected features
  - maintenance plan

---

## 3) Approach Chosen

Use a **targeted flow cleanup** (not full rewrite):

- Keep existing components (`QuoteFlow`, `QuoteStep`, `QuoteProgress`, invoice page)
- Normalize step rendering/navigation with path-aware visible-step arrays
- Fix pages optional rendering/counting to ensure “Show more” reveals real content
- Add robust invoice payload contract via localStorage/sessionStorage key

Rationale:
- Lower risk than full wizard rewrite
- Solves all reported issues and removes current path/index mismatches
- Keeps codebase familiar for follow-up tickets

---

## 4) Component-Level Design

### 4.1 `QuoteFlow.tsx`

Introduce path-aware visible steps and mapping helpers:

- `getVisibleSteps(state)` returns one of:
  - `['businessType','migration','pages','features','summary']`
  - `['businessType','migration','migrationPages','revamp','features','summary']`
- Maintain current internal state object but route next/back using visible-step index rather than hard-coded numeric jumps.

Effects:
- Revamp appears in indicator only on migration path
- Non-migration step count remains 5 and does not show phantom/skipped labels
- Step text “Step X of Y” becomes accurate

### 4.2 `QuoteProgress.tsx`

Refactor rendering to tie each label directly to its dot column:

- Each step cell is a vertical stack: dot (and connector alignment context) + label
- Remove extra border under indicator group
- Keep connector line only between dots
- Use equal-width step cells where possible for desktop alignment
- Keep compact/scroll fallback on small screens

### 4.3 `QuoteStep.tsx` — Migration Pages + Show More

#### Migration pages copy
Update migration pages prompt to:

> “Do you want to add any other pages to your existing website pages?”

#### Migration pages pricing behavior
- Selecting migration pages updates `migrationPageIds`
- Price updates by `+£50` per selected migration page
- Baseline migration fee handled separately at `+£100` when migration path is active
- No implicit base £250 on migration path

#### Show more bug fix
Root issue: mixed grouped vs flattened counting/rendering produced blank expansion.

Fix strategy:
- Build a single normalized optional-page source for counting and expanded rendering
- Hidden-count derived from same normalized source used by renderer
- Expanded state must render actual entries from that same source

This guarantees “Show N more options” count and expanded content stay consistent.

### 4.4 Summary and Price Rationale

- Non-migration rationale includes base package line
- Migration rationale excludes base package line
- Migration rationale includes migration baseline fee + selected migration pages + revamp + features + maintenance

### 4.5 Summary CTA cleanup

- Remove inline “Get a Quote” from Summary card body
- Keep “Generate Invoice” action in summary section
- Keep fixed-footer primary progression action unchanged

### 4.6 Invoice handoff (`/invoice`)

Create quote-to-invoice storage contract:

- Key: `invoice_draft_from_quote_v1`
- Write on Generate Invoice click
- Navigate to `/invoice`
- Invoice page reads key once on mount, transforms payload into invoice line items, then clears key
- If payload malformed/missing: fail safely and continue with blank/default invoice

Payload fields:
- `isMigration: boolean`
- `selectedPages: string[]`
- `migrationPageIds: string[]`
- `selectedFeatures: string[]`
- `isRevamp: boolean`
- `maintenancePlan: 'none' | 'basic' | 'standard'`
- `timestamp` / `version` metadata

---

## 5) Data Flow

1. User advances through path-aware visible steps
2. `QuoteFlow` computes totals from existing pricing function + migration/revamp additions
3. Summary renders path-relevant rationale and actions
4. Generate Invoice serializes selected quote state to storage key
5. Invoice page consumes storage payload and pre-fills line items

---

## 6) Error Handling and Safety

- Guard storage parse failures with try/catch and fallback defaults
- Ignore unknown IDs in invoice payload (page/feature removed or stale)
- Ensure migration-only state does not leak into non-migration totals when user toggles back
- Do not mutate `src/lib/pricing.ts`

---

## 7) Test Plan

### Unit/integration tests

1. Indicator behavior
   - Non-migration: 5 visible steps; no revamp label
   - Migration: 6 visible steps; revamp label included
   - Dot/label alignment structure remains stable

2. Migration pricing
   - Migration yes adds +£100 baseline fee
   - Each migration page adds +£50
   - No £250 base on migration path

3. Show more optional pages
   - Hidden count correct
   - Expanded list non-empty and contains expected options

4. Summary rationale
   - Migration excludes base-package rationale
   - Non-migration includes base-package rationale

5. Summary actions
   - No inline “Get a Quote” in summary body
   - “Generate Invoice” still present

6. Invoice handoff
   - Generate Invoice writes storage payload
   - `/invoice` consumes payload correctly
   - payload cleared after consumption

### Regression checks

- Toggle migration yes/no after selections and verify totals/state consistency
- Revamp on/off updates total and summary immediately
- Existing quote localStorage restore remains functional

---

## 8) Implementation Notes / Constraints

- Keep mobile-first layout
- Keep Framer Motion usage style already in repo
- Keep inquiry form + “All Done” flow unchanged
- Avoid unrelated refactors

---

## 9) Spec Self-Review

- Placeholder scan: no TODO/TBD placeholders remain
- Internal consistency: step order, pricing, and indicator logic are aligned
- Scope check: constrained to one implementation pass, no multi-project decomposition needed
- Ambiguity check: migration baseline (£100) and migration pages (+£50 each) explicitly defined

