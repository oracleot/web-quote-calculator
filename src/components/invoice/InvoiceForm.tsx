'use client';

import { Invoice, InvoiceLineItem, generateId } from '@/lib/invoice';
import {
  BASE_PRICE,
  PAGES,
  PRICE_PER_EXTRA_PAGE,
  FEATURES,
  MIGRATION_FEE,
} from '@/lib/pricing';

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
  onSave: () => void;
  onDownload: () => void;
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  const baseClass =
    'w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_2px_var(--accent-muted)] transition-all';
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      {textarea ? (
        <textarea
          className={`${baseClass} resize-none`}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={baseClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// All calculator items available for quick-add
const QUICK_ADD_ITEMS: { label: string; description: string; price: number }[] = [
  { label: 'Base Website Price', description: 'Base website build price', price: BASE_PRICE },
  ...PAGES.map((p) => ({
    label: `Page: ${p.label}`,
    description: `${p.label} page`,
    price: PRICE_PER_EXTRA_PAGE,
  })),
  ...FEATURES.map((f) => ({
    label: `Feature: ${f.label}`,
    description: f.label,
    price: f.price,
  })),
  { label: 'Migration Fee', description: 'Site migration from existing platform', price: MIGRATION_FEE },
  { label: 'Maintenance: Basic (£25/mo)', description: 'Basic maintenance plan — £25/mo', price: 25 },
  { label: 'Maintenance: Standard (£40/mo)', description: 'Standard maintenance plan — £40/mo', price: 40 },
];

export default function InvoiceForm({ invoice, onChange, onSave, onDownload }: InvoiceFormProps) {
  const update = (partial: Partial<Invoice>) => onChange({ ...invoice, ...partial });

  const updateLineItem = (id: string, partial: Partial<InvoiceLineItem>) => {
    update({
      lineItems: invoice.lineItems.map((item) =>
        item.id === id ? { ...item, ...partial } : item
      ),
    });
  };

  const addLineItem = () => {
    update({
      lineItems: [
        ...invoice.lineItems,
        { id: generateId(), description: '', quantity: 1, unitPrice: 0 },
      ],
    });
  };

  const removeLineItem = (id: string) => {
    if (invoice.lineItems.length === 1) return;
    update({ lineItems: invoice.lineItems.filter((i) => i.id !== id) });
  };

  const handleQuickAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    const item = QUICK_ADD_ITEMS.find((i) => i.label === value);
    if (!item) return;
    update({
      lineItems: [
        ...invoice.lineItems,
        { id: generateId(), description: item.description, quantity: 1, unitPrice: item.price },
      ],
    });
    // Reset select
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Business Info */}
      <section className="card p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
          Your Business
        </h3>
        <Field
          label="Business Name"
          value={invoice.businessName}
          onChange={(v) => update({ businessName: v })}
          placeholder="Acme Web Studio"
        />
        <Field
          label="Business Address"
          value={invoice.businessAddress}
          onChange={(v) => update({ businessAddress: v })}
          placeholder="123 High Street, London, EC1A 1BB"
          textarea
        />
        <Field
          label="Email / Phone"
          value={invoice.businessContact}
          onChange={(v) => update({ businessContact: v })}
          placeholder="hello@acme.co · 07700 900000"
        />
      </section>

      {/* Invoice Details */}
      <section className="card p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
          Invoice Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Invoice #"
            value={invoice.invoiceNumber}
            onChange={(v) => update({ invoiceNumber: v })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Date</label>
            <input
              type="date"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all min-h-[44px]"
              value={invoice.date}
              onChange={(e) => update({ date: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Due Date</label>
            <input
              type="date"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all min-h-[44px]"
              value={invoice.dueDate}
              onChange={(e) => update({ dueDate: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Client Info */}
      <section className="card p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
          Bill To
        </h3>
        <Field
          label="Client Name"
          value={invoice.clientName}
          onChange={(v) => update({ clientName: v })}
          placeholder="Jane Smith"
        />
        <Field
          label="Client Email"
          value={invoice.clientEmail}
          onChange={(v) => update({ clientEmail: v })}
          type="email"
          placeholder="jane@example.com"
        />
        <Field
          label="Client Address"
          value={invoice.clientAddress}
          onChange={(v) => update({ clientAddress: v })}
          placeholder="456 Park Lane, London, W1K 1QA"
          textarea
        />
      </section>

      {/* Line Items */}
      <section className="card p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
          Line Items
        </h3>

        {/* Quick Add from Calculator — Option B */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Quick Add from Calculator</label>
          <select
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all min-h-[44px]"
            defaultValue=""
            onChange={handleQuickAdd}
            aria-label="Quick add a calculator item as a line item"
          >
            <option value="" disabled>Select an item to add…</option>
            {QUICK_ADD_ITEMS.map((item) => (
              <option key={item.label} value={item.label}>
                {item.label} — £{item.price}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          {invoice.lineItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_60px_80px_28px] sm:grid-cols-[1fr_60px_80px_28px] gap-2 items-center max-sm:grid-cols-1 max-sm:gap-1.5 max-sm:bg-[var(--bg-elevated)] max-sm:p-2 max-sm:rounded-lg max-sm:border max-sm:border-[var(--border)]"
            >
              <input
                type="text"
                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all min-h-[44px] sm:min-h-0"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
              />
              <input
                type="number"
                min={1}
                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-2 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all text-center font-mono min-h-[44px] sm:min-h-0"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateLineItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })}
              />
              <input
                type="number"
                min={0}
                step={0.01}
                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-2 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all font-mono min-h-[44px] sm:min-h-0"
                placeholder="£0.00"
                value={item.unitPrice}
                onChange={(e) => updateLineItem(item.id, { unitPrice: Math.max(0, Number(e.target.value)) })}
              />
              <button
                type="button"
                onClick={() => removeLineItem(item.id)}
                disabled={invoice.lineItems.length === 1}
                className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-all disabled:opacity-30 disabled:cursor-not-allowed max-sm:w-full max-sm:h-9 max-sm:text-xs max-sm:rounded-lg"
                aria-label="Remove line item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLineItem}
          className="btn-secondary text-sm py-2"
        >
          + Add Line Item
        </button>
      </section>

      {/* Tax & Notes */}
      <section className="card p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
          Tax &amp; Notes
        </h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border border-[var(--border)] accent-[var(--accent)] cursor-pointer"
              checked={invoice.taxRate !== null}
              onChange={(e) => update({ taxRate: e.target.checked ? 20 : null })}
            />
            <span className="text-sm text-[var(--text-primary)]">Apply VAT</span>
          </label>
          {invoice.taxRate !== null && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                className="w-16 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all text-center font-mono"
                value={invoice.taxRate}
                onChange={(e) => update({ taxRate: Math.max(0, Math.min(100, Number(e.target.value))) })}
              />
              <span className="text-sm text-[var(--text-secondary)]">%</span>
            </div>
          )}
        </div>
        <Field
          label="Notes"
          value={invoice.notes}
          onChange={(v) => update({ notes: v })}
          placeholder="Payment due within 30 days. Bank transfer preferred."
          textarea
        />
      </section>

      {/* Actions */}
      <div className="flex gap-3 max-sm:flex-col sm:sticky sm:bottom-0">
        <button type="button" className="btn-primary flex-1 min-h-[44px]" onClick={onSave}>
          Save Invoice
        </button>
        <button type="button" className="btn-secondary flex-1 min-h-[44px]" onClick={onDownload}>
          Download PDF
        </button>
      </div>
    </div>
  );
}
