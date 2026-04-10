# Plan: 2-Layout UI Revamp — Web Quote Calculator

**Project:** web-quote-calculator
**Date:** 2026-04-05
**Status:** Draft — awaiting approval
**Approach:** Builder/Checkout split (Option B for Step 4 form)

---

## Overview

Current problem: Steps 3→4 forces a long vertical scroll to reach the form — kills the momentum of the Builder → Checkout flow.

Solution:
- Steps 1–2: two-column split (sidebar + grid) — reduces scroll
- Step 3: full-width quote review, no form yet
- Step 4: **slide-in form panel** from the right — form and quote visible simultaneously, no scroll needed

---

## Layout 1 — Steps 1–2 (Builder Phase)

### Two-column split

```
┌─────────────────────┬──────────────────────────────────┐
│  STICKY SIDEBAR     │  CARD GRID                       │
│  (35%)              │  (65%)                           │
│                     │                                  │
│  Your Selection     │  Core Pages                      │
│  ──────────────     │  [Home] [About] [Services]      │
│  ✓ Home             │  [Contact]                       │
│  ✓ Services         │                                  │
│                     │  Marketing Pages                 │
│  ──────────────     │  [Gallery] [Testimonials]        │
│  £320               │  [Team] [FAQ]                    │
│  GBP                │                                  │
│                     │  Utility Pages                   │
│  [Continue →]       │  [Pricing] [Blog]                │
│                     │                                  │
└─────────────────────┴──────────────────────────────────┘
```

### Sidebar (Steps 1–2)
- Always visible, sticky top, never scrolls
- Shows: page count, selected page names with checkmarks, running total in large GBP
- "Continue" CTA at bottom — always accessible without scrolling
- On mobile: collapses to sticky bottom bar: `£320 · 3 pages · [Continue →]`

### Card Grid (Steps 1–2)
- Sections (Core / Marketing / Utility) displayed as horizontal 2-column sub-grids
- Selected state: left-border accent + subtle pulse animation

### Micro-interactions
- Selected card → item slides into sidebar with animation
- Running total animates (count-up effect)
- Deselected → item slides out of sidebar

---

## Layout 2 — Steps 3–4 (Checkout Phase)

### Step 3 — Quote Review (full-width)
- Full-width centered quote review: selections list + large hero price
- "Edit" links return to Steps 1 or 2
- "Proceed to Submit" CTA → triggers Step 4

### Step 4 — Slide-in form panel (Option B)

When user clicks "Proceed to Submit":

```
Desktop:
┌──────────────────────────────┬──────────────────────────┐
│                              │                          │
│     £320                     │  Name                    │
│   your quote                 │  [____________________]  │
│                              │                          │
│   ✓ Home                     │  Email                   │
│   ✓ Services                 │  [____________________]  │
│   ✓ 2 features               │                          │
│                              │  Coupon (optional)       │
│   [← Edit quote]             │  [____________________]  │
│                              │                          │
│                              │  [   Send Inquiry   ]    │
│                              │                          │
└──────────────────────────────┴──────────────────────────┘
          quote review visible         form panel slides in
          behind (dimmed)              from right →

Mobile:
- Form is a full-screen slide-up sheet
- Backdrop dims quote behind
- Swipe down or tap backdrop to close
```

### Price hero (Step 3)
- Large centered GBP total — dominant, glowing
- "Edit" links back to specific steps

### Form panel
- Right-side panel (desktop, ~400px wide)
- Bottom sheet (mobile, full-width)
- Fields: Name, Email, Coupon (optional), Submit
- Backdrop dims the review behind

### Success state
- Panel shows confirmation
- Quote review visible behind
- Option to start a new quote

---

## Layout Transition (Step 2 → 3)

When Continue is clicked on Step 2:
1. Sidebar fades out + slides left
2. Card grid collapses to center
3. Quote review emerges as the dominant element
4. Duration: ~500ms

Transitioning to Step 4 (form panel):
1. Review dims (opacity reduces on background)
2. Form panel slides in from right (desktop) or bottom (mobile)
3. Duration: ~400ms

---

## Mobile Behavior

### Steps 1–2
- Sticky bottom bar: `£320 · 3 pages · [Continue]`
- Tap bar to expand selected items as overlay sheet
- Card grid full-width, scrollable

### Step 3
- Full-width quote review, scrollable if needed

### Step 4
- Form slides up as full-screen bottom sheet
- Quote visible behind (dimmed backdrop)
- Swipe down to close and return to review

---

## Scope

### Must ship (MVP)
1. Two-column layout for Steps 1–2 (sidebar + grid)
2. Sticky sidebar with live selection list + running total + Continue CTA
3. Slide-in form panel for Step 4 — quote review stays visible behind
4. Animated transitions between layouts
5. Mobile: sticky bottom bar (Steps 1–2) + bottom sheet (Step 4)
6. All existing functionality preserved (pricing, coupon, inquiry API)
7. Dark mode still works

### Stretch
- Pulse animation on card selection
- Count-up on sidebar total
- "Edit quote" → smooth scroll to step
- Success state redesign

---

## Files to Change

| File | Change |
|------|--------|
| `src/app/page.tsx` | Restructure layout — sidebar for Steps 1–2, quote review for Step 3, form panel for Step 4, transition animations |
| `src/components/PageSelector.tsx` | Adapt to grid inside sidebar layout |
| `src/components/FeatureSelector.tsx` | Adapt to grid layout |
| `src/components/QuoteSummary.tsx` | Compact review variant for Step 3 |
| `src/components/InquiryForm.tsx` | Reused in the slide-in panel |
| `src/hooks/useSelectionList.ts` | New hook — exposes selected items array for sidebar |
| `src/components/FormPanel.tsx` | New component — slide-in panel / bottom sheet |
| `src/app/globals.css` | Sidebar styles, bottom bar mobile, panel transitions |

---

## Validation

Before every commit:
```bash
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm test
```

---

## Out of Scope

- Pricing logic changes
- API route changes
- Admin pages
- Light theme improvements
- New features beyond layout

---

## Approval

Approved by: _________________ Date: ___________

Changes from v1: Step 4 form changed from single-column to slide-in right panel (Option B) per user feedback.
