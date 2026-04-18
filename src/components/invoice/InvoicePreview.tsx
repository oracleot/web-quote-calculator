'use client';

import {
  Invoice,
  calcSubtotal,
  calcTax,
  calcTotal,
  formatCurrency,
  formatDate,
} from '@/lib/invoice';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const subtotal = calcSubtotal(invoice.lineItems);
  const tax = calcTax(subtotal, invoice.taxRate);
  const total = calcTotal(subtotal, tax);

  return (
    <div
      id="invoice-preview"
      style={{
        background: 'white',
        color: '#09090b',
        fontFamily: 'Inter, -apple-system, sans-serif',
        padding: '48px',
        borderRadius: '8px',
        minHeight: '600px',
        fontSize: '14px',
        lineHeight: '1.6',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        {/* Business info */}
        <div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '800',
              fontFamily: 'Bricolage Grotesque, Inter, sans-serif',
              color: '#09090b',
              marginBottom: '6px',
            }}
          >
            {invoice.businessName || 'Your Business'}
          </div>
          {invoice.businessAddress && (
            <div style={{ color: '#52525b', fontSize: '13px', whiteSpace: 'pre-line' }}>
              {invoice.businessAddress}
            </div>
          )}
          {invoice.businessContact && (
            <div style={{ color: '#52525b', fontSize: '13px' }}>{invoice.businessContact}</div>
          )}
        </div>

        {/* Invoice meta */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '800',
              fontFamily: 'Bricolage Grotesque, Inter, sans-serif',
              color: '#0891b2',
              letterSpacing: '-0.02em',
            }}
          >
            INVOICE
          </div>
          <div style={{ marginTop: '8px', color: '#52525b', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#a1a1aa' }}>Invoice #: </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  fontWeight: '600',
                  color: '#09090b',
                }}
              >
                {invoice.invoiceNumber || '—'}
              </span>
            </div>
            <div>
              <span style={{ color: '#a1a1aa' }}>Date: </span>
              {formatDate(invoice.date) || '—'}
            </div>
            <div>
              <span style={{ color: '#a1a1aa' }}>Due: </span>
              {formatDate(invoice.dueDate) || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div
        style={{
          background: '#f4f4f5',
          borderRadius: '6px',
          padding: '16px 20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#a1a1aa',
            marginBottom: '8px',
          }}
        >
          Bill To
        </div>
        <div style={{ fontWeight: '600', color: '#09090b' }}>
          {invoice.clientName || '—'}
        </div>
        {invoice.clientEmail && (
          <div style={{ color: '#52525b', fontSize: '13px' }}>{invoice.clientEmail}</div>
        )}
        {invoice.clientAddress && (
          <div style={{ color: '#52525b', fontSize: '13px', whiteSpace: 'pre-line' }}>
            {invoice.clientAddress}
          </div>
        )}
      </div>

      {/* Line Items Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '24px',
          fontSize: '13px',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '2px solid #e4e4e7',
            }}
          >
            <th style={{ textAlign: 'left', padding: '8px 0', color: '#a1a1aa', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Description
            </th>
            <th style={{ textAlign: 'center', padding: '8px 8px', color: '#a1a1aa', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', width: '60px' }}>
              Qty
            </th>
            <th style={{ textAlign: 'right', padding: '8px 8px', color: '#a1a1aa', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', width: '100px' }}>
              Unit Price
            </th>
            <th style={{ textAlign: 'right', padding: '8px 0', color: '#a1a1aa', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', width: '100px' }}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
              <td style={{ padding: '10px 0', color: '#09090b' }}>
                {item.description || <span style={{ color: '#a1a1aa' }}>—</span>}
              </td>
              <td
                style={{
                  padding: '10px 8px',
                  textAlign: 'center',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#52525b',
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  padding: '10px 8px',
                  textAlign: 'right',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#52525b',
                }}
              >
                {formatCurrency(item.unitPrice)}
              </td>
              <td
                style={{
                  padding: '10px 0',
                  textAlign: 'right',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: '600',
                  color: '#09090b',
                }}
              >
                {formatCurrency(item.quantity * item.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
        <div style={{ minWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#52525b', fontSize: '13px' }}>
            <span>Subtotal</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatCurrency(subtotal)}</span>
          </div>
          {invoice.taxRate !== null && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#52525b', fontSize: '13px' }}>
              <span>VAT ({invoice.taxRate}%)</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatCurrency(tax)}</span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderTop: '2px solid #09090b',
              marginTop: '4px',
              fontWeight: '700',
              fontSize: '16px',
            }}
          >
            <span>Total</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0891b2' }}>
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div
          style={{
            borderTop: '1px solid #e4e4e7',
            paddingTop: '20px',
            color: '#52525b',
            fontSize: '13px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#a1a1aa',
              marginBottom: '6px',
            }}
          >
            Notes
          </div>
          <div style={{ whiteSpace: 'pre-line' }}>{invoice.notes}</div>
        </div>
      )}
    </div>
  );
}
