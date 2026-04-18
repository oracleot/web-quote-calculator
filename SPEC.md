# SPEC-v2: Invoice Generator Fixes (SUL-85 Round 2)

## Changes Required

### 1. Quote-to-Invoice Integration (NEW FEATURE)

**Option A: "Generate Invoice" button on quote review step**
- In `QuoteReviewPanel.tsx` or `FinalConfirmation.tsx` (the last step of the calculator), add a "Generate Invoice" button
- Clicking it navigates to `/invoice` with query params encoding the selected pages, features, and prices
- The `/invoice` page reads these params on mount and pre-fills line items from them

**Option B: Item picker dropdown on invoice form**
- In `InvoiceForm.tsx`, add a "Quick Add from Calculator" dropdown above the line items section
- The dropdown lists all items from `pricing.ts` (PAGES items at their prices, FEATURES with their prices, base price, migration fee, maintenance plans)
- Selecting an item adds it as a new line item with description and price pre-filled

**Implement BOTH options.**

For Option A, encode data as URL search params:
- `/invoice?from=quote&pages=home,about,services&features=ai-chatbot,booking&migration=true&maintenance=basic`
- The invoice page parses these and creates line items using prices from `pricing.ts`

### 2. Copilot Review Fixes

Apply these fixes:

1. **`generateInvoiceNumber` NaN guard** — Add `Number.isFinite` check and try/catch
2. **Delete button a11y** — Add `focus:opacity-100` and `group-focus-within:opacity-100` to delete button in InvoiceList
3. **InvoiceList separation of concerns** — Remove direct `deleteInvoice()` call from InvoiceList. Let the page's `handleDelete` call `deleteInvoice()` from `@/lib/invoice` instead
4. **VAT toggle** — Replace the clickable div with a real `<input type="checkbox">`
5. **Use `next/link`** — Replace `<a href="/invoice">` in `page.tsx` (main) with `<Link>` from `next/link`
6. **`getInvoices` validation** — Add `Array.isArray(parsed)` check. Skip full field validation (YAGNI)
7. **UTC date fix** — Use local date helpers (`getFullYear/getMonth/getDate`) instead of `toISOString().split('T')[0]`
8. **InvoiceList keyboard a11y** — Add `role="button"`, `tabIndex={0}`, and `onKeyDown` for Enter/Space to invoice rows
9. **Remove unused `previewRef`** — Remove the `useRef` and `forwardRef` wrapper
10. **`saveInvoice`/`deleteInvoice` guards** — Add `typeof window === 'undefined'` early return and try/catch

### 3. Print Duplicate Page Fix

The current `@media print` CSS uses `visibility: hidden/visible` with `position: fixed; inset: 0; padding: 48px`. This can cause content to overflow to a second page with duplicated content.

Fix:
- Replace `visibility` approach with `display: none` on everything except `#invoice-preview`
- Remove `position: fixed` — let the preview flow naturally
- Set `#invoice-preview` to `width: 100%; max-width: 210mm; margin: 0 auto; padding: 15mm;`
- Add `@page { margin: 10mm; size: A4; }` for proper page sizing
- Ensure all print styles produce a single clean page

### 4. Mobile Responsiveness

Improve mobile UX:
- Header: stack buttons below title on small screens (flex-wrap)
- Form inputs: ensure full width on mobile, proper touch targets (min 44px height)
- Line items: on mobile, stack description/qty/price vertically instead of in a row
- Preview toggle tabs: make them sticky at top on mobile scroll
- Action buttons (Save, Download): make them full-width on mobile, sticky at bottom
- Saved invoices drawer: make cards stack vertically on mobile with larger touch targets

## Build Instructions

1. Read this SPEC.md
2. Implement all changes on the existing `feat/sul-85-invoice-generator` branch
3. Run `npm run build` — must pass with zero errors
4. Run `npx vitest run` — all tests must pass
5. Commit with message: `fix(SUL-85): address review feedback — quote integration, print fix, a11y, mobile`
6. Push to origin
7. Run: `openclaw system event --text 'SUL-85 review fixes pushed to PR #4'`
