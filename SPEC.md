# SPEC.md — Migration Bug Fixes

## What

Two bugs in the web quote calculator:

1. **BuilderSidebar double-counts migration fee** — `livePrice` already includes the £100 migration fee, but BuilderSidebar adds `migrationFee` again, showing £200 instead of £100.
2. **Continue button disabled on migration step 1** — `canProceed()` requires `selectedPages.length > 0` even for migration, where 0 pages is valid.

## Tech

- Next.js 15, TypeScript, Tailwind, Framer Motion
- Pricing logic in `src/lib/pricing.ts`
- State in `src/app/page.tsx`
- Display in `src/components/BuilderSidebar.tsx` and `src/components/SelectionBottomBar.tsx`

## Files Affected

1. **`src/components/BuilderSidebar.tsx`** — Remove `+ migrationFee` from the `total` calculation (migration fee is already included in `livePrice` from page.tsx). Update comment to clarify.
2. **`src/app/page.tsx`** — Update `canProceed()` to allow 0 pages when `isMigration` is true.

## Acceptance Criteria

1. Migration with 0 pages selected → sidebar/bottom bar shows **£100** total (not £200)
2. Migration with 0 pages → **Continue button is enabled**
3. New build with 0 pages → Continue button remains disabled (step 1 requires pages)
4. Migration with pages → pricing is correct (base £250 + page costs + £100 migration)
5. `pnpm lint && pnpm typecheck && pnpm build` all pass
6. No file > 200 lines
