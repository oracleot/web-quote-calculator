'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import InvoicePreview from '@/components/invoice/InvoicePreview';
import InvoiceList from '@/components/invoice/InvoiceList';
import {
  Invoice,
  createBlankInvoice,
  generateInvoiceNumber,
  getInvoices,
  saveInvoice,
} from '@/lib/invoice';

export default function InvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(() => {
    const blank = createBlankInvoice();
    return { ...blank, invoiceNumber: generateInvoiceNumber() };
  });
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>(() => getInvoices());
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [showList, setShowList] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (!invoice) return;
    saveInvoice(invoice);
    setSavedInvoices(getInvoices());
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const handleDownload = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  const handleSelect = (inv: Invoice) => {
    setInvoice(inv);
    setShowList(false);
    setShowPreviewMobile(false);
  };

  const handleDelete = (id: string) => {
    setSavedInvoices((prev) => prev.filter((i) => i.id !== id));
    if (invoice?.id === id) {
      const blank = createBlankInvoice();
      setInvoice({ ...blank, invoiceNumber: generateInvoiceNumber() });
    }
  };

  const handleNew = () => {
    const blank = createBlankInvoice();
    setInvoice({ ...blank, invoiceNumber: generateInvoiceNumber() });
    setShowList(false);
  };

  if (!invoice) return null;

  return (
    <>
      {/* Print styles — only the preview is printed */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #invoice-preview, #invoice-preview * { visibility: visible !important; }
          #invoice-preview {
            position: fixed !important;
            inset: 0 !important;
            margin: 0 !important;
            padding: 48px !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
            color: #09090b !important;
            z-index: 9999 !important;
          }
        }
      `}</style>

      <div className="relative min-h-screen">
        {/* Header */}
        <header className="border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Calculator
            </Link>
            <span className="text-[var(--border)]">|</span>
            <h1 className="text-base font-bold text-[var(--text-primary)] font-display">
              Invoice Generator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {saveMsg && (
              <span className="text-xs text-[var(--success)] animate-fade-in">{saveMsg}</span>
            )}
            <button
              type="button"
              className="btn-secondary text-sm py-1.5 px-3"
              onClick={() => setShowList((v) => !v)}
            >
              {showList ? 'Close' : `Saved (${savedInvoices.length})`}
            </button>
            <button
              type="button"
              className="btn-secondary text-sm py-1.5 px-3"
              onClick={handleNew}
            >
              + New
            </button>
          </div>
        </header>

        {/* Saved Invoices Drawer */}
        {showList && (
          <div className="border-b border-[var(--border)] bg-[var(--bg-card)] px-4 py-4 animate-fade-in-up">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
                Saved Invoices
              </h2>
              <InvoiceList
                invoices={savedInvoices}
                activeId={invoice.id}
                onSelect={handleSelect}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}

        {/* Mobile preview toggle */}
        <div className="sm:hidden flex border-b border-[var(--border)] bg-[var(--bg-elevated)]">
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${!showPreviewMobile ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            onClick={() => setShowPreviewMobile(false)}
          >
            Form
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${showPreviewMobile ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            onClick={() => setShowPreviewMobile(true)}
          >
            Preview
          </button>
        </div>

        {/* Two-column layout */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex gap-6 items-start">
            {/* Form column */}
            <div className={`w-full sm:w-[45%] flex-shrink-0 ${showPreviewMobile ? 'hidden sm:block' : 'block'}`}>
              <InvoiceForm
                invoice={invoice}
                onChange={setInvoice}
                onSave={handleSave}
                onDownload={handleDownload}
              />
            </div>

            {/* Preview column */}
            <div className={`flex-1 min-w-0 ${!showPreviewMobile ? 'hidden sm:block' : 'block'}`}>
              <div className="sticky top-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                    Preview
                  </span>
                  <button
                    type="button"
                    className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5"
                    onClick={handleDownload}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </button>
                </div>
                <div className="shadow-xl rounded-lg overflow-hidden border border-[var(--border)]">
                  <InvoicePreview ref={previewRef} invoice={invoice} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
