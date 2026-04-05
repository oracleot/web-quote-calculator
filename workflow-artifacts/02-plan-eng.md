# Plan-ENG — Web Quote Calculator Design Review Implementation
# Project: web-quote-calculator
# Created: 2026-04-05
# Previous: docs/review.md (design review by Sule + OpenCode, 2026-04-04)
# Status: IN_PROGRESS

## Reference
Full design review: `docs/review.md` — 8.5/10, Tier 1/2/3 priorities

## Scope (Selective Hold — Tier 1 + Tier 2 high-impact)

### Tier 1 — High-Impact, Low-Effort (ALL)
1. **Price display elevation** — make GBP total the hero (4xl+, bold, glow, gradient text)
2. **Left-border accent on selected cards** — Storefront UI signature pattern (3px brand border)
3. **Step direction animations** — forward slides from right, backward slides from left
4. **Live running price on Step 1** — sticky price counter as pages are selected

### Tier 2 — Medium Effort (Top 3)
5. **Two-font system** — serif display font for H1 + price (Instrument Serif or DM Serif)
6. **Floating form labels** — premium label animation on focus/fill
7. **Mobile card grouping** — collapse pages into Core/Marketing/Utility categories

## Files to Modify
- `src/app/globals.css` — add price glow, gradient text, noise overlay
- `src/components/PageSelector.tsx` — live price counter, left-border accent, mobile grouping
- `src/components/FeatureSelector.tsx` — left-border accent on selected cards
- `src/components/QuoteSummary.tsx` — hero price display (4xl+, glow)
- `src/components/InquiryForm.tsx` — floating labels, form polish
- `src/app/page.tsx` — direction-aware step transitions
- `src/app/layout.tsx` — load display font (Instrument Serif or DM Serif)

## New Files
- `src/components/ui/PriceTag.tsx` — reusable hero price component with glow + gradient
- `src/hooks/useDirection.ts` — tracks navigation direction (1 or -1) for animations

## Acceptance Criteria
- [ ] Price on Step 3/4 is 4xl+, bold, white with subtle amber glow
- [ ] Selected cards have 3px left accent border (brand colour)
- [ ] Forward nav = slide from right; Backward = slide from left
- [ ] Live price updates on Step 1 as pages are selected
- [ ] Display font (Instrument Serif) loaded and applied to H1 + price
- [ ] Floating labels on all InquiryForm fields
- [ ] Mobile: pages grouped into collapsible categories
- [ ] Lint: 0 errors | TypeScript: 0 errors | Build: succeeds
- [ ] Dev server runs cleanly at localhost:3456

## Tech Notes
- Framework: Next.js (App Router)
- Animation: Framer Motion (already in use — verify)
- Fonts: Google Fonts (Instrument Serif + Inter)
- CSS: Tailwind + CSS variables (globals.css)
