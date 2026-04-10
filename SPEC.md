# SPEC.md — Web Quote Calculator: Migration Track + Maintenance Tiers

## What

Two features added to the Web Quote Calculator:

1. **Migration Track (Step 0)** — A "New website" vs "Migrate existing website" toggle above the StepIndicator on Step 1. Migration adds a flat £100 fee.
2. **Maintenance Tiers** — Three tier cards shown on the success screen after inquiry submission, clearly labelled "Optional".

## Tech

- **Framework:** Next.js 15 + TypeScript
- **Styling:** Tailwind CSS (dark mode, CSS variables)
- **Animation:** Framer Motion (existing patterns)
- **No new dependencies**

## Files Affected

### Modify
- `src/lib/pricing.ts` — `calculateQuote()` accepts optional `isMigration: boolean`; adds £100 flat fee when true
- `src/app/page.tsx` — add `isMigration: boolean` state; pass it to `calculateQuote()`; show `MigrationToggle` on Step 1; show `MaintenanceTiers` on success

### Create
- `src/components/MigrationToggle.tsx` — Step 0 toggle cards (New website / Migrate existing)
- `src/components/MaintenanceTiers.tsx` — Success screen tier cards (Basic £25/mo, Standard £40/mo)

## Pricing Logic

```typescript
// src/lib/pricing.ts
export function calculateQuote(
  selectedPageIds: string[],
  selectedFeatureIds: string[],
  options?: { isMigration?: boolean }
)
// Returns { ..., migrationFee: 100 } when isMigration === true
// Total = base + pages + features + (isMigration ? 100 : 0)
```

## MigrationToggle UI

- Two clickable cards side by side (desktop) / segmented control (mobile)
- Default: "New website" selected
- "Migrate existing website" card shows a note: "Includes full site audit, content transfer, and redirect setup (+£100)"
- Selected state: indigo background matching the one-page/multi-page toggle style
- Appears above `StepIndicator` on Step 1 only (steps 2–4 don't show it)

## MaintenanceTiers UI

- Shown in `InquiryForm` when `isSuccess === true`, BEFORE or alongside the success message
- **"Optional"** label prominently at top
- Section heading: "Keep your site healthy"
- Two tier cards (Basic / Standard):
  - Basic £25/mo: hosting, 2 bi-weekly health checks with reports, £10/hr extra work
  - Standard £40/mo: hosting, AI assistant on WhatsApp for anytime updates, £7/hr complex features
- "New website" builds (isMigration === false): "3 months free" badge on Standard tier only
- Below tiers: "Not ready yet? No problem — reach out anytime"
- No buttons needed — informational display only
- Cards match existing dark card design system (border, bg, hover)

## Acceptance Criteria

1. Step 0 toggle is visible above StepIndicator on step 1
2. Selecting "Migrate" adds £100 to the live total shown in sidebar and bottom bar
3. Migration flag persists through all steps and is passed to the inquiry API
4. Maintenance tiers section appears on the success screen, clearly marked "Optional"
5. "3 months free" badge only shows when `isMigration === false` (new build)
6. All existing steps 1–4 work exactly as before — no regression
7. `pnpm lint && pnpm typecheck && pnpm build` all pass
8. No file exceeds 200 lines

## File Size Budget

| File | Max Lines |
|------|-----------|
| src/components/MigrationToggle.tsx | 120 |
| src/components/MaintenanceTiers.tsx | 120 |
| src/lib/pricing.ts | 50 |
| src/app/page.tsx | 200 |
