# Spec: SUL-88 — Conversational Quote Flow v2

**Date:** 2026-04-21
**Issue:** SUL-88 (revision)
**Status:** Draft

---

## Overview

This spec revises the first-pass conversational quote flow implementation (PR #8) to address 11 UX and functional issues identified during review. The flow is redesigned to be migration-aware, progressive in price reveal, persistent across refreshes, and clean in visual presentation.

---

## Flow Structure

The flow branches based on whether the user is doing a migration or not.

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 0: Business Type                                      │
│  "Service Business" | "Local Business"                      │
│  → Auto-advances after selection                            │
├─────────────────────────────────────────────────────────────┤
│  STEP 1: Migration?                                         │
│  "Are you migrating an existing site?" Yes / No            │
│  → No → Step 2A (Regular Pages)                            │
│  → Yes → Step 2B (Migration + Revamp)                      │
└─────────────────────────────────────────────────────────────┘

STEP 2A — Regular Pages (non-migration):
┌─────────────────────────────────────────────────────────────┐
│  Base price: £250 covers up to 4 pages                      │
│  Pre-selected: Home, About, Services, Contact               │
│  These 4 can be deselected (user loses the pages)           │
│  Optional extra pages beyond 4: +£50/page                   │
│  Show More reveals additional optional page groups          │
└─────────────────────────────────────────────────────────────┘

STEP 2B — Migration Flow (branch after Migration = Yes):
┌─────────────────────────────────────────────────────────────┐
│  STEP 2B-i: Revamp?                                          │
│  "Would you like us to revamp your existing website?"       │
│  Yes → +£100 (note: subject to reviewing complexity)        │
│  No  → £0, proceed to Migration Pages step                  │
│  → Always proceeds to Migration Pages step                  │
├─────────────────────────────────────────────────────────────┤
│  STEP 2B-ii: Migration Pages                                │
│  Pages from old site user wants to transfer/integrate      │
│  Each page: £50 (no base £250 since rebuilding)             │
│  No pre-selection. User selects all pages they want.        │
│  Show More reveals additional optional page groups           │
└─────────────────────────────────────────────────────────────┘

STEP 3 — Features (both paths):
┌─────────────────────────────────────────────────────────────┐
│  Recommended features shown as suggestions (NOT pre-checked)│
│  GA (Google Analytics) recommended but user manually opts  │
│  Optional add-ons: expand via "Show more options"           │
│  Whats Included? toggle per feature (existing UX preserved) │
│  Price only updates here — user sees price change happen     │
│  Progressive reveal: price at top only reflects features    │
│  selected so far, not future recommendations                │
└─────────────────────────────────────────────────────────────┘

STEP 4 — Summary:
┌─────────────────────────────────────────────────────────────┐
│  Live quote breakdown with line items                       │
│  Each section has an "Edit" link back to that step         │
│  "Generate Invoice" CTA → /invoice pre-filled              │
│  "Get a Quote" CTA → opens FormPanel/inquiry form         │
│  Footer note about invoice generator visible above footer    │
└─────────────────────────────────────────────────────────────┘

STEP 5 — Inquiry Form + Step 6 (All Done) unchanged from v1
```

---

## State Shape

```ts
type BusinessType = 'service' | 'local';

interface QuoteFlowState {
  currentStep: number;           // 0..4
  history: number[];             // visited steps for back-nav
  businessType: BusinessType | null;

  // Pages
  selectedPages: string[];       // always starts empty for regular flow

  // Migration path
  isMigration: boolean;
  isRevamp: boolean;             // revamp old site (£100)
  migrationPageIds: string[];    // selected migration pages (£50 each)

  // Features
  selectedFeatures: string[];    // starts empty — manually selected

  // Meta
  maintenancePlan: 'none' | 'basic' | 'standard';
}
```

**Key change:** `selectedPages` is now only used in the non-migration (regular) path. Migration uses `migrationPageIds` separately. No pre-selected features.

---

## Pricing Rules

| Scenario | Base | Pages | Features | Migration | Revamp |
|---|---|---|---|---|---|
| Regular (non-migration) | £250 | First 4 included, +£50/extra page | Per feature | — | — |
| Migration only | £0 | £50/selected page | Per feature | £100 | £0 |
| Migration + Revamp | £0 | £50/selected page | Per feature | £100 | £100 |

**Price reveal:** Live price counter at the top only accumulates cost for:
- Pages/features already selected in their respective steps
- Migration (£100) added when Migration = Yes
- Revamp (£100) added when Revamp = Yes
- Pre-selected (locked) pages in regular path do NOT add to the counter — they are reflected in the £250 base already shown

---

## Visual / UX Fixes

### 1. Step indicator border (item 1)
Remove the bold border under the steps indicator. Ensure text labels are horizontally centered under each dot. The indicator sits at the top of the flow area, not in a separate card with heavy borders.

### 2. No quote on landing (item 2)
On Step 0 (Business Type), the live price counter at the top shows "£—" or is hidden entirely until the user has selected a business type and at least seen the Pages step. No price should be visible on first load.

### 3. Show More in pages (item 4)
Fix the Show More toggle in both the regular pages step and migration pages step. The button should correctly count and reveal all hidden optional page groups. The Features step Show More already works — ensure pages follows the same pattern.

### 4. Fixed footer padding (item 9)
Ensure the invoice CTA footer text is visible above the fixed bottom nav bar. Add `pb-24` (or equivalent) padding to the bottom of the conversation area so content isn't hidden behind the nav bar.

---

## Persistence (localStorage — item 5)

**Saved on every state change** (debounced 300ms via `useEffect`):
- Key: `quote_flow_state` (versioned: `quote_flow_state_v1`)
- Saves the full `QuoteFlowState` as JSON
- On app load, check for saved state and restore if found
- **On successful inquiry submission**, clear saved state

**What gets saved:**
```ts
localStorage.setItem('quote_flow_state_v1', JSON.stringify(state));
```

**On restore:**
- User lands on the step they last visited
- All their selections are restored
- Navigation history is restored (back button works)

---

## Component Changes

### New/Modified Files

| File | Change |
|---|---|
| `src/components/conversational/recommendations.ts` | Add migration pages data, `isMigration` flag, remove pre-selected defaults from state initialisation |
| `src/components/conversational/QuoteFlow.tsx` | Add migration path state (`isRevamp`, `migrationPageIds`), restore from localStorage on mount, save to localStorage on every update, remove auto-price from pre-selected recommendations |
| `src/components/conversational/QuoteStep.tsx` | Implement Step 2B-i (Revamp) and Step 2B-ii (Migration Pages), fix Show More count logic in pages, remove pre-selection of features, fix summary step CTAs |
| `src/components/conversational/QuoteProgress.tsx` | Remove heavy border underneath indicator, improve label alignment |
| `src/app/page.tsx` | Add `pb-24` to conversation area |
| `src/app/globals.css` | Add/fix conversational bubble styles |
| `src/components/conversational/QuoteFlow.test.tsx` | Update tests for new flow, add migration path tests, add localStorage restore tests |

### Components Not Rendered in Conversational Mode
The following components are no longer used in the conversational flow (old step UI):
- `BuilderPhase`, `PageSelector`, `FeatureSelector`, `BuilderSidebar`, `StepIndicator`
- They remain in the codebase and can be reused for migration rollback if needed.

---

## Acceptance Criteria

- [ ] Landing page shows no price until Business Type is selected
- [ ] Migration path (Yes/No) correctly branches to revamp or regular pages
- [ ] Regular pages pre-selects exactly Home, About, Services, Contact
- [ ] Base price £250 is shown on regular pages step (not counting toward price counter for pre-selected pages)
- [ ] Extra pages beyond 4 cost +£50 each and update price counter
- [ ] Show More in pages reveals all hidden optional groups
- [ ] Show More in features works (already working, confirm)
- [ ] Features step shows GA as a suggestion but NOT pre-checked
- [ ] Price updates only when user manually selects a feature
- [ ] Pre-selected features (analytics) visible but unchecked in features step
- [ ] "What's Included" toggle works for applicable features
- [ ] Migration Yes → adds £100, shows Revamp step
- [ ] Revamp Yes → adds £100 to quote (note shown)
- [ ] Migration Pages step shows £50/page, no base price
- [ ] Summary step shows both "Generate Invoice" and "Get a Quote" CTAs
- [ ] Footer text visible above fixed bottom nav bar
- [ ] localStorage saves state after every interaction
- [ ] localStorage restores state on page refresh
- [ ] localStorage clears on successful submission
- [ ] All existing tests pass; new tests added for migration flow

---

## Rollback

Same as v1: revert commit `fcb6dd3` (or `4501b92` for full conversational removal). Pricing logic is untouched — rollback is UI-level only.

