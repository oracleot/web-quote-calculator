# SPEC.md — Web Quote Calculator Design Polish

## Project: web-quote-calculator
## Created: 2026-04-05
## Based on: docs/review.md (Design Review, 8.5/10)

---

## Scope: Tier 1 (all 4) + Tier 2 top 3

### Tier 1 — ALL must ship

#### 1. Price Display Hero (Step 3/4)
- Quote total on Step 3/4: `text-5xl`+, `font-extrabold`, white
- Subtle amber glow via `text-shadow` / `box-shadow`
- Gradient text on the price number (white → muted)
- Currency "GBP" label smaller, muted
- Keep discounted green price distinct

#### 2. Left-Border Accent on Selected Cards
- `PageSelector` cards: when selected, replace full border with `border-l-4 border-[#818cf8]`
- `FeatureSelector` cards: same treatment
- Remove the `box-shadow` ring on selected cards, use left-border only

#### 3. Step Direction Animations (Framer Motion)
- Track `direction` state: `1` (forward) or `-1` (backward)
- `motion.div` variants: `x: direction * 40 → 0` for enter, `x: 0 → direction * -40` for exit
- Forward nav (Continue button): slide in from right
- Backward nav (Back button): slide in from left
- Need `framer-motion` installed — check package.json

#### 4. Live Running Price on Step 1
- Sticky price counter top-right of the PageSelector card grid
- Shows running total as pages are selected
- Format: `£{total}` with small "running total" label
- Updates reactively as selected pages change

### Tier 2 — Top 3

#### 5. Two-Font System — Instrument Serif
- Load `Instrument Serif` from Google Fonts in `layout.tsx`
- Apply to: `<h1>` in header, `<h2>` step title, total price in QuoteSummary
- Keep Inter for body/UI text
- Fallback: `Georgia, serif`

#### 6. Floating Form Labels — InquiryForm
- All form fields (Name, Email, Coupon) get floating label pattern
- Label sits over the input as placeholder
- On focus OR when field has value: label animates up to top-left
- CSS transition: `transform`, `font-size`, `color`
- Use `peer` / `peer-focus` pattern in Tailwind (or CSS)

#### 7. Mobile Card Grouping — PageSelector
- Group pages into 3 collapsible categories:
  - **Core:** Home, About, Services, Contact
  - **Marketing:** Gallery, Testimonials, Team, FAQ
  - **Utility:** Pricing, Blog
- Each category is a collapsible `<details>`/`<summary>` or custom accordion
- Show count badge per category
- Mobile-only collapse (hide on desktop via `hidden sm:block`)

---

## File Changes

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add Instrument Serif Google Font |
| `src/app/globals.css` | Add price-hero glow, gradient text, floating label styles |
| `src/app/page.tsx` | Direction state, direction-aware step transitions, live price on Step 1 |
| `src/components/PageSelector.tsx` | Left-border accent, mobile grouping, live price display |
| `src/components/FeatureSelector.tsx` | Left-border accent on selected |
| `src/components/QuoteSummary.tsx` | Hero price display (4xl+, glow, gradient) |
| `src/components/InquiryForm.tsx` | Floating labels on all fields |
| `src/hooks/useDirection.ts` | New hook: tracks nav direction (1 / -1) |

---

## Acceptance Criteria

- [ ] Price on Step 3/4: `text-5xl`, bold, white, amber glow, gradient number
- [ ] Selected cards: `border-l-4 border-[#818cf8]` (no full border ring)
- [ ] Forward nav: slide from right. Backward: slide from left
- [ ] Step 1 shows live running price top-right of grid
- [ ] Instrument Serif on H1 + price; Inter on body
- [ ] All InquiryForm fields have floating labels
- [ ] Mobile: pages grouped into 3 collapsible categories
- [ ] `pnpm run lint` → 0 errors
- [ ] `pnpm run typecheck` → 0 errors
- [ ] `pnpm run build` → succeeds

---

## Tech Notes
- Framer Motion: check if installed, install if not (`framer-motion` package)
- Tailwind CSS v4 (used with `@theme inline` — no `tailwind.config.js`)
- CSS variables already in `globals.css`
- Google Fonts: load in `<head>` of `layout.tsx`
