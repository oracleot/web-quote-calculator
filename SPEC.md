# SPEC: SUL-87 — Email Management Dashboard (£150)

## Goal
Add a new paid add-on to the quote calculator:
- **Name:** Email Management Dashboard
- **Price:** **£150**

This add-on should be selectable in the feature step, included in all pricing and summaries, and clearly explain what the client gets.

## Requirements

### 1) Add-on in feature selector
- Add `email-management-dashboard` to `FEATURES` in `src/lib/pricing.ts`
- Label: `Email Management Dashboard`
- Price: `150`
- Description should explain this includes:
  - centralized inbox/outbox
  - compose/send emails
  - search & filter tools

### 2) Explain details on the card
- In `FeatureSelector.tsx`, add an info mechanism for this card:
  - either info icon + expandable panel OR native `<details>` block
- Must be visible on desktop and mobile
- Should not break existing click-to-select behavior

### 3) Quote calculation + review
- Ensure selecting this add-on contributes £150 through existing pricing pipeline
- Ensure it appears in:
  - Quote breakdown
  - Selected add-ons chips
  - Sidebar/bottom-sheet selection lists

### 4) Tests
- Update/add tests in `FeatureSelector.test.tsx` and any impacted tests
- Confirm this feature renders and is priced correctly in UI where applicable

## Non-goals
- Building a real email dashboard product
- Backend email integration
- Any new API routes

## Validation
1. `npm run build`
2. `npx vitest run`

## Expected Outcome
Users can select **Email Management Dashboard** as an add-on, see exactly what it includes, and receive accurate quote totals including **+£150**.
