# 01-plan-ceo.md — Web Quote Calculator: Migration Track + Maintenance Tiers

## What We're Building

Two additions to the Web Quote Calculator:

1. **Migration Track** — A "New build" vs "Migrate existing website" toggle at Step 0 (before page selection). Migration adds a £100 flat fee on top of the standard page × price formula.

2. **Maintenance Tiers** — Displayed on the inquiry success confirmation screen. Three tiers:
   - Basic £25/mo: hosting, 2 bi-weekly health checks with reports, £10/hr for extra work
   - Standard £40/mo: hosting, AI assistant on WhatsApp, £7/hr for complex features
   - Free: 3 months free on new builds (new site builds only)

## Why These Changes

- Migration track captures a real use case (church community clients migrating from existing Nigerian devs)
- Maintenance tiers are a revenue upsell at the highest-intent moment — right after a client submits an inquiry
- £100 migration fee is honest — real work to audit, transfer, and set up redirects, but not the main revenue driver

## Success Metrics

- Clients use the toggle correctly (no confusion between new/migrate)
- Maintenance tiers are visible and clear on the success screen
- Existing new-build flow is unbroken — no regression

## What's Out of Scope

- No changes to the coupon, inquiry form, or email flow
- No Stripe/payment integration on the calculator itself
- Maintenance tier selection does not affect the quote — it's informational + call to action

## Page/Flow Impact

- **Step 0 (NEW):** Site type toggle — "New website" / "Migrate existing website"
  - Default: New website selected
  - Migration shows a note: "Includes full site audit, content transfer, and redirect setup (+£100)"
- **Step 1–4:** Unchanged (migration flag passed through)
- **Step 4 success:** New section — "Keep your site healthy" with maintenance tiers displayed
  - Tiers shown as cards with clear pricing and feature list
  - "3 months free" badge on new builds
  - **Explicitly labelled "Optional"** — no pressure, no obligation
  - "Not ready yet? No problem — you can reach out anytime" message below tiers

## Pricing (from conversation)

| Item | Price |
|------|-------|
| New build | Current formula (pages × £) |
| Migration | Current formula + £100 flat fee |
| Basic maintenance | £25/mo |
| Standard maintenance | £40/mo |
| New build incentive | 3 months free maintenance |
| Extra work (Basic) | £10/hr |
| Extra work (Standard) | £7/hr |

## Spec Files to Create/Update

- `src/app/page.tsx` — add Step 0 toggle, pass migration flag, show maintenance tiers on success
- `src/components/MigrationToggle.tsx` (NEW) — Step 0 toggle component
- `src/components/MaintenanceTiers.tsx` (NEW) — success screen tier cards
- `src/lib/pricing.ts` — add migration fee to calculateQuote()
- `src/data/pages.ts` / `src/data/features.ts` — unchanged
