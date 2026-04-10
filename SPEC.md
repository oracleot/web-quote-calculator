# SPEC.md — Web Quote Calculator: Layout Fix + Flow Review

## What

Fix all layout/vertical spacing issues in the 6-step Web Quote Calculator (Next.js 15, TypeScript, Tailwind, Framer Motion).

## Key Issues

1. **page.tsx is 228 lines** — must be split below 200 lines
2. **Step 4 (SupportPlanStep) layout broken** — cards pushed to bottom with huge whitespace above
3. **Inconsistent vertical spacing** across steps — some stretched, some cramped
4. **Step indicator and header not properly separated** from content

## Root Cause Analysis

### Step 4 Layout Problem
`SupportPlanStep` renders a `<div className="max-w-2xl mx-auto w-full px-4 animate-scale-in">` that is placed **below** the step header (`<div className="mb-5 animate-fade-in-up text-center px-4">`) inside the same `<main>`. The outer `<main>` has `className="flex-1 px-4 pb-8"`. Combined with the `animate-scale-in` animation, the card appears to sit at the natural flow position but the `animate-scale-in` keyframe animation starting at `scale(0.95)` can make it look like it's positioned lower than expected. The real issue is likely that `main` uses `flex-1` which stretches it, and the card has no explicit vertical alignment.

### Step 3 Layout (Reference — GOOD)
Step 3 uses `className="max-w-2xl mx-auto"` on the wrapper div (inside `<main>`), and that wrapper contains a `<div className="card p-6 sm:p-8 animate-scale-in">`. This works because it's directly inside `<main className="flex-1 ...">` without extra nesting.

### Step 4 Layout (BAD)
`SupportPlanStep.tsx` wraps in its own `<div className="max-w-2xl mx-auto w-full px-4 animate-scale-in">` AND has an inner `MaintenancePlanSelector` with `className="max-w-2xl mx-auto"` again. Double-nesting centered divs + `animate-scale-in` animation can cause vertical centering or downward push.

## Files to Modify

### 1. `src/app/page.tsx` — SPLIT NEEDED
**Problem:** 228 lines (exceeds 200 limit)
**Solution:** Extract each step's content rendering into a separate component file. Keep `Home` as the orchestrator (~150 lines) and move step content into named step-content components.

Create:
- `src/components/steps/Step1Content.tsx` — MigrationToggle
- `src/components/steps/Step2Content.tsx` — BuilderPhase wrapper
- `src/components/steps/Step3Content.tsx` — QuoteReviewPanel
- `src/components/steps/Step4Content.tsx` — SupportPlanStep
- `src/components/steps/Step5Content.tsx` — (FormPanel is controlled externally)
- `src/components/steps/Step6Content.tsx` — FinalConfirmation

### 2. `src/components/SupportPlanStep.tsx` — LAYOUT FIX
**Changes:**
- Remove `animate-scale-in` from the outer wrapper (it conflicts with AnimatePresence motion.div)
- Change outer wrapper from `max-w-2xl mx-auto w-full px-4 animate-scale-in` to `max-w-xl mx-auto`
- Remove duplicate `max-w-2xl mx-auto` from the inner `MaintenancePlanSelector` wrapper
- Move `animate-scale-in` only to the `.card` element inside MaintenancePlanSelector

### 3. `src/components/MaintenancePlanSelector.tsx` — LAYOUT FIX
**Changes:**
- Outer wrapper: change from `max-w-2xl mx-auto` to nothing (handled by parent SupportPlanStep)
- Card div: keep `card p-6 sm:p-8 animate-scale-in`
- Ensure no `max-w-*` on wrapper divs that would create double-nesting

### 4. `src/components/BuilderPhase.tsx` — LAYOUT FIX
**Changes:**
- Outer wrapper: `max-w-5xl mx-auto` (already has it via `builder-layout-wrapper`)
- `.card` wrapper: already has `card p-6 sm:p-8 animate-scale-in` — good

### 5. `src/app/globals.css` — MINOR ADJUSTMENTS
**Changes:**
- Ensure `.animate-scale-in` starts at `opacity: 0, scale: 0.96` (slightly less aggressive than 0.95)

## Layout Consistency Rules

All steps should follow this pattern:
```
<main flex-1>
  <step-content-wrapper max-w-[sm|xl|2xl] mx-auto>
    <div className="card p-6 sm:p-8 animate-scale-in">
      CONTENT
    </div>
  </step-content-wrapper>
</main>
```

No step content wrapper should have:
- `animate-scale-in` AND `max-w-* mx-auto` simultaneously (causes double-animation)
- Vertical alignment that stretches content to fill viewport

## Acceptance Criteria

1. `page.tsx` < 200 lines after refactor
2. All 6 steps render with comfortable, consistent vertical spacing
3. Step 4 cards sit naturally below the header (no excessive top whitespace)
4. `pnpm lint` → 0 errors
5. `pnpm typecheck` → 0 errors
6. `pnpm build` → succeeds
7. `pnpm test` → all pass
8. No file > 200 lines
