export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;           // ISO date
  dueDate: string;        // ISO date
  businessName: string;
  businessAddress: string;
  businessContact: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  lineItems: InvoiceLineItem[];
  taxRate: number | null;  // e.g. 20 for 20%, null for no tax
  notes: string;
  createdAt: string;
}

const INVOICES_KEY = 'wqc-invoices';
const COUNTER_KEY = 'wqc-invoice-counter';

export function getInvoices(): Invoice[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getInvoices();
  const idx = invoices.findIndex((i) => i.id === invoice.id);
  if (idx >= 0) {
    invoices[idx] = invoice;
  } else {
    invoices.unshift(invoice);
  }
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices().filter((i) => i.id !== id);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function generateInvoiceNumber(): string {
  if (typeof window === 'undefined') return 'INV-001';
  const current = parseInt(localStorage.getItem(COUNTER_KEY) ?? '0', 10);
  const next = current + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return `INV-${String(next).padStart(3, '0')}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function calcSubtotal(lineItems: InvoiceLineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calcTax(subtotal: number, taxRate: number | null): number {
  if (!taxRate) return 0;
  return subtotal * (taxRate / 100);
}

export function calcTotal(subtotal: number, tax: number): number {
  return subtotal + tax;
}

export function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function createBlankInvoice(): Omit<Invoice, 'invoiceNumber'> {
  const today = todayISO();
  return {
    id: generateId(),
    date: today,
    dueDate: addDays(today, 30),
    businessName: '',
    businessAddress: '',
    businessContact: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    lineItems: [{ id: generateId(), description: '', quantity: 1, unitPrice: 0 }],
    taxRate: 20,
    notes: '',
    createdAt: new Date().toISOString(),
  };
}
