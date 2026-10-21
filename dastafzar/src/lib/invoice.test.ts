import { describe, expect, it } from "vitest";
import { calcInvoice } from "./invoice";

describe("calcInvoice", () => {
  it("qty x price, per-line discount, then VAT on net", () => {
    const t = calcInvoice([
      { id: "1", title: "الف", qty: 2, unitPrice: 100_000, discountPct: 10 }, // 180,000
      { id: "2", title: "ب", qty: 1, unitPrice: 50_000, discountPct: 0 },     // 50,000
    ], 10);
    expect(t.lines.map((l) => l.net)).toEqual([180_000, 50_000]);
    expect(t.subtotal).toBe(230_000);
    expect(t.vatAmount).toBe(23_000);
    expect(t.grandTotal).toBe(253_000);
  });
  it("clamps discount and tolerates empties", () => {
    const t = calcInvoice([{ id: "1", title: "", qty: 0, unitPrice: 0, discountPct: 150 }], 0);
    expect(t.grandTotal).toBe(0);
  });
});
