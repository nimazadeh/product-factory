/** Invoice math — pure functions, unit-tested. All amounts are integers
    in the chosen currency unit (Toman by default); inputs may float, the
    line totals are rounded to integers. */
export interface InvoiceItem {
  id: string;
  title: string;
  qty: number;
  unitPrice: number;
  discountPct: number; // per-line discount percent 0..100
}
export interface InvoiceTotals {
  lines: { id: string; net: number }[];
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
}
export function calcInvoice(items: InvoiceItem[], vatPct: number): InvoiceTotals {
  const lines = items.map((it) => {
    const gross = (it.qty || 0) * (it.unitPrice || 0);
    const net = Math.round(gross * (1 - Math.min(100, Math.max(0, it.discountPct || 0)) / 100));
    return { id: it.id, net };
  });
  const subtotal = lines.reduce((s, l) => s + l.net, 0);
  const vatAmount = Math.round(subtotal * (Math.max(0, vatPct || 0) / 100));
  return { lines, subtotal, vatAmount, grandTotal: subtotal + vatAmount };
}
export const fmtMoney = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "٬").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
