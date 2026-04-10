# SPEC.md — Fix Blank Plan Page (Step 4 Bug)

## Problem
`MaintenancePlanSelector` is rendered conditionally with `step === 5`, but step 4 is "Choose a Support Plan". This causes the plan cards to not render when the user reaches step 4.

## Root Cause
In `src/app/page.tsx`, the JSX block wrapping `MaintenancePlanSelector` uses:
```tsx
{step === 5 && (
```
But it should be:
```tsx
{step === 4 && (
```

## Step Flow (per task brief)
1. Step 1: Pages
2. Step 2: Features
3. Step 3: Review
4. Step 4: Plan ← fix targets here
5. Step 5: Submit (form)
6. Step 6: Confirmation

## File to Modify
- `src/app/page.tsx` — change line 202 from `step === 5` to `step === 4`

## Acceptance Criteria
1. Step 4 shows the three maintenance plan cards
2. Step numbering internally consistent (step 4=plan, step 5=form, step 6=confirmation)
3. `pnpm lint && pnpm typecheck && pnpm build` pass
4. `pnpm test` passes
5. No file > 200 lines
