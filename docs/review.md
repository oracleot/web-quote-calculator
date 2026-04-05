# Web Quote Calculator — Design Review
**Reviewer:** OpenCode (Claude Sonnet 4.6) + Sule  
**Date:** 2026-04-04  
**Live URL:** http://localhost:3456  

---

## Overall Assessment

**Rating: 8.5/10**  
Strong foundation — dark mode palette is cohesive, step flow is logical, card-based UI is intuitive. The app doesn't look "dated" — it's on par with modern SaaS products. The main opportunities are in polish, price elevation, and mobile optimisation.

---

## Screenshots Captured
- `/tmp/step1_desktop.png` — Step 1 page selection (desktop)
- `/tmp/step1_mobile.png` — Step 1 page selection (mobile)
- `/tmp/step1_selections.png` — Step 1 with multiple pages selected
- `/tmp/step2_features.png` — Step 2 feature add-ons
- `/tmp/step2_feature_selected.png` — Feature selected state
- `/tmp/step3_review.png` — Step 3 quote review
- `/tmp/step4_form.png` — Step 4 inquiry form (desktop)
- `/tmp/step4_mobile.png` — Step 4 inquiry form (mobile)

---

## Tier 1 — High-Impact, Low-Effort

### 1. Elevate the Price Display (biggest win)
The price is currently small, low-contrast, and buried. On the review step it gets slightly larger, but the total price should be the **hero of step 3 and 4**.

**Change:**
- Make the GBP total large (4xl+), bold, white on dark
- Add a subtle glow/shadow effect
- Consider gradient text (white → muted) for the currency symbol
- On step 3/4, make the price sticky or persistently visible

### 2. Left-Border Accent on Selected Cards
Storefront UI's signature pattern — a 3px left border in brand colour on selected cards. Instantly makes selection state feel premium and unambiguous.

**Change:** Add `border-l-4 border-accent` to selected state, remove the full border.

### 3. Step Direction Animations
Forward navigation should slide in from right. Backward should slide from left. Currently identical.

**Change:** Track `direction` state (1 or -1). Pass it to the motion.div variants.

### 4. Live Running Price on Step 1
As users select pages, the price updates in real-time. This is powerful UX — they see the cost impact immediately rather than waiting until step 3.

**Change:** Show a sticky price counter top-right of the card grid on step 1.

---

## Tier 2 — Medium Effort

### 5. Two-Font System
Currently Inter throughout. A serif display font for the main headline and price would immediately elevate the luxury feel.  
**Fonts to consider:** DM Serif Display, Instrument Serif, Playfair Display.

**Change:** Load a display font. Use it for the H1 and the total price. Keep Inter for body/UI.

### 6. Floating Form Labels
Static labels above fields feel corporate. Floating labels (placeholder animates up on focus/fill) feel premium.

**Change:** Implement floating label pattern on all form fields. Already exist in Aceternity UI.

### 7. Light Theme Polish
The light theme (warm cream + terracotta) is genuinely distinctive and underused. Currently:
- Cards need stronger shadows to lift off the cream background
- Ambient glow needs to be warmer and more visible
- Section backgrounds need more differentiation

**Change:** Increase card `shadow-lg`/`shadow-xl`. Strengthen warm radial gradient behind hero.

### 8. Mobile: Reduce Card List Length
On mobile, the page list is a "scrolling wall" — 10 items forces excessive scrolling.  
**Fix:** Group pages into collapsible categories (Core, Marketing, Utility) with sub-headings.

### 9. Contrast Fixes
- Footer legal text is nearly invisible (accessibility issue)
- Secondary descriptions under card titles are hard to read
- "Validate" button in coupon field has poor contrast

**Change:** Increase opacity on muted text. Make the Validate button text white or brand colour.

---

## Tier 3 — Investment

### 10. Magnetic Button Hover
Buttons that subtly follow the cursor feel expensive. Aceternity UI has this built in.  
**Change:** Wrap primary CTAs in a magnetic container (see `ui/magnetic.tsx`).

### 11. Grain Texture Overlay
Add a subtle noise/grain texture over the background — 2-3% opacity. This is a hallmark of premium dark UIs (Linear, Vercel).  
**Change:** Add `noise-overlay` div at 2-3% opacity over the background.

### 12. Confetti on Submission
After successful form submission, a confetti burst rewards the user.  
**Change:** Trigger confetti on `isSubmitSuccessful` in the form component.

### 13. Dismissible Quote Tags on Step 3
Currently users can't edit selections from the review step. Allow removing items by clicking an X on the tag.  
**Change:** Make `QuoteSummary` tags interactive (dismissible or linking back to the relevant step).

---

## Per-Page Notes

### Step 1 (Page Selection)
- ✅ Good: icon + title + description per card
- ⚠️ Improve: price per card (£250) is too small — make it more visible
- ⚠️ Improve: "First 4 pages included" badge is functional but plain — style it more like a pill/badge
- 🐛 Bug: stray "N" icon visible in mobile view — likely a navigation element with bad positioning

### Step 2 (Feature Add-ons)
- ✅ Good: card selection pattern is consistent with step 1
- ⚠️ Improve: AI Chatbot price (£100) should show inline on the selected tag in step 3

### Step 3 (Review)
- ✅ Good: breakdown box is well structured
- ⚠️ Improve: show "3/4 pages used" — transparency on included vs paid slots
- ⚠️ Improve: make total price much larger and more prominent
- ⚠️ Improve: trust icons (clock, paper, person) have inconsistent stroke weights

### Step 4 (Inquiry Form)
- ✅ Good: personal touch ("Dami will review") is a nice differentiator
- ⚠️ Improve: form field height is cramped — increase padding
- ⚠️ Improve: add section header "Contact Information" before the form fields
- ⚠️ Improve: consider left-aligning the Submit button with the fields, or making it full-width

---

## Technical Debt Notes
- Admin page uses arbitrary Tailwind values that bypass the CSS variable system — should use design tokens
- `globals.css` has hardcoded values that should map to CSS variables

---

## Priority Order
1. Price count-up animation (0→final over 800ms) — **single highest-impact fix**
2. Price hero styling (gradient text + glow on step 3/4)
3. Left-border accent on selected cards
4. Step direction differentiation (forward/backward animations)
5. Mobile: sticky price summary
6. Floating form labels
7. Font upgrade (display serif for headline + price)
8. Light theme polish
9. Mobile card grouping
10. Contrast/accessibility fixes
