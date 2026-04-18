'use client';

import { Invoice, InvoiceLineItem, generateId } from '@/lib/invoice';

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
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all"
              value={invoice.date}
              onChange={(e) => update({ date: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Due Date</label>
            <input
              type="date"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all"
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
        <div className="flex flex-col gap-2">
          {invoice.lineItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_60px_80px_28px] gap-2 items-center"
            >
              <input
                type="text"
                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
              />
              <input
                type="number"
                min={1}
                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-2 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all text-center font-mono"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateLineItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })}
              />
              <input
                type="number"
                min={0}
                step={0.01}
                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-2 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all font-mono"
                placeholder="£0.00"
                value={item.unitPrice}
                onChange={(e) => updateLineItem(item.id, { unitPrice: Math.max(0, Number(e.target.value)) })}
              />
              <button
                type="button"
                onClick={() => removeLineItem(item.id)}
                disabled={invoice.lineItems.length === 1}
                className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
            <div
              className={`checkbox ${invoice.taxRate !== null ? 'checked' : ''}`}
              onClick={() => update({ taxRate: invoice.taxRate !== null ? null : 20 })}
            >
              {invoice.taxRate !== null && (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
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
      <div className="flex gap-3">
        <button type="button" className="btn-primary flex-1" onClick={onSave}>
          Save Invoice
        </button>
        <button type="button" className="btn-secondary flex-1" onClick={onDownload}>
          Download PDF
        </button>
      </div>
    </div>
  );
}
