# SPEC.md — Web Quote Calculator: Maintenance Step + Migration Fix

## What

Two targeted changes to the web quote calculator:

1. **Migration track default fix**: When `isMigration === true`, the `selectedPages` state starts as `[]` instead of `['home']`, so migration clients can optionally add pages to their quote.
2. **New Step 5 — Maintenance Plan Selection**: After a successful inquiry submission, the client is presented with a dedicated step to choose (or skip) a maintenance plan before seeing the final confirmation.

---

## Tech

- **Framework**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Component style**: Dark mode cards, consistent with Steps 3–4 animation/transition style
- **State**: `selectedMaintenancePlan` added to page.tsx: `'none' | 'basic' | 'standard'`
- **Flow**: Inquiry success → Step 5 maintenance selection → final confirmation (with plan shown)
- **No external dependencies** — reuse existing design tokens from globals.css

---

## Files Affected

### New Files
- `src/components/MaintenancePlanSelector.tsx` — Step 5 component (radio-card selection)

### Modified Files
- `src/app/page.tsx` — TOTAL_STEPS = 5, Step 5 flow, empty pages for migration, step indicator updates
- `src/components/StepIndicator.tsx` — STEP_LABELS needs to cover 5 steps (will need to be passed in or label changed)

---

## Issue 1 — Migration Empty Pages

### Change
In `src/app/page.tsx`, update the `selectedPages` initial state:

```ts
// Before
const [selectedPages, setSelectedPages] = useState<string[]>(['home']);

// After
const [selectedPages, setSelectedPages] = useState<string[]>(isMigration ? [] : ['home']);
```

**Note**: `isMigration` is `false` by default, so this is a conditional initialization — `useState` only uses the initial value on mount. This is intentional: the client can toggle migration off/on and pages state must be preserved.

### Also update `canProceed`
The `canProceed` guard already checks `step !== 1 || selectedPages.length > 0`. No change needed — it will now let migration clients proceed to step 2 even with 0 pages selected.

---

## Issue 2 — Step 5: Maintenance Plan Selection

### Flow

```
Step 4 (FormPanel) on submit → isSuccess = true
  → If isSuccess && step === 4: show Step 5 (MaintenancePlanSelector)
  → Client selects plan or clicks "Skip"
  → Continue → step = 5 (final confirmation shown)
```

### New State in page.tsx
```ts
const [selectedMaintenancePlan, setSelectedMaintenancePlan] = useState<'none' | 'basic' | 'standard'>('none');
```

### Step Indicator Updates
- `TOTAL_STEPS = 5` (was 4)
- STEP_TITLES gains a 5th entry: `{ title: 'Choose a Support Plan', sub: 'Optional ongoing maintenance for your new site' }`
- STEP_LABELS in StepIndicator needs to add `'Plan'` as the 5th label

### MaintenancePlanSelector Component

**Layout**: Full-width centered, matching Step 3/4 card style — `card p-6 sm:p-8 animate-scale-in` wrapper, `max-w-2xl mx-auto`.

**Three options** (radio-card style, single-select):

| Plan | Price | Features | Badge |
|------|-------|----------|-------|
| "No thanks, I'll handle updates myself" | Free | — | — |
| Basic | £25/mo | Hosting, 2 bi-weekly health checks, £10/hr extra work | — |
| Standard | £40/mo | Hosting, AI WhatsApp assistant, £7/hr complex features | "3 months free" (only when `isMigration === false`) |

**UI Details**:
- Single-select radio cards — clicking one deselects others
- Selected card: highlighted border (like `select-card.selected`) and background tint
- "Continue" button confirms selection and advances to step 5
- "Skip" text link below the cards → `setSelectedMaintenancePlan('none')` and advances

**Final Confirmation** (step === 5):
- Reuse existing success UI from InquiryForm but append the selected plan info below it
- Show: "No maintenance plan selected" OR "Basic (£25/mo)" OR "Standard (£40/mo) + 3 months free" (if applicable)

### Props for MaintenancePlanSelector

```ts
interface MaintenancePlanSelectorProps {
  selectedPlan: 'none' | 'basic' | 'standard';
  onSelectPlan: (plan: 'none' | 'basic' | 'standard') => void;
  isMigration: boolean;
  onContinue: () => void;
  onSkip: () => void;
}
```

---

## Acceptance Criteria

1. `isMigration === true` → `selectedPages` initializes as `[]` (client can proceed with 0 pages)
2. After inquiry submit → Step 5 appears with three plan cards
3. "3 months free" badge visible on Standard only when `isMigration === false`
4. Client can skip (go straight to confirmation) or select a plan
5. Selected plan (or "No plan") shown in final confirmation
6. Step indicator correctly shows 5 steps
7. `pnpm lint && pnpm typecheck && pnpm build` → 0 errors, build succeeds
8. No source file > 200 lines (split if needed)
