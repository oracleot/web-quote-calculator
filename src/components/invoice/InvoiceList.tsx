'use client';

import { Invoice, formatCurrency, formatDate, calcSubtotal, calcTax, calcTotal, deleteInvoice } from '@/lib/invoice';

interface InvoiceListProps {
  invoices: Invoice[];
  activeId: string | null;
  onSelect: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

export default function InvoiceList({ invoices, activeId, onSelect, onDelete }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-muted)] text-sm">
        No saved invoices yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {invoices.map((inv) => {
        const subtotal = calcSubtotal(inv.lineItems);
        const tax = calcTax(subtotal, inv.taxRate);
        const total = calcTotal(subtotal, tax);
        const isActive = inv.id === activeId;

        return (
          <div
            key={inv.id}
            className={`select-card p-3 cursor-pointer group ${isActive ? 'selected' : ''}`}
            onClick={() => onSelect(inv)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-[var(--accent)]">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {formatDate(inv.date)}
                  </span>
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {inv.clientName || 'Unnamed Client'}
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {formatCurrency(total)}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteInvoice(inv.id);
                  onDelete(inv.id);
                }}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-all flex-shrink-0"
                aria-label="Delete invoice"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
