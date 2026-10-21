"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2, Printer, Save, FilePlus2, Copy, Check, Upload, Banknote } from "lucide-react";
import { calcInvoice, fmtMoney, type InvoiceItem } from "@/lib/invoice";
import { numberToWordsFa } from "@/lib/numberToWords";
import { faDate, faNum, gregorianToJalali } from "@/lib/date";
import { track } from "@/lib/track";

interface Party { name: string; econ: string; national: string; phone: string; address: string }
interface Draft {
  seller: Party; buyer: Party; no: string; date: string; vatPct: number; currency: string;
  items: InvoiceItem[]; shipping: number; globalDiscount: number; notes: string; bank: string; accent: string; logo: string;
}
const emptyParty = (): Party => ({ name: "", econ: "", national: "", phone: "", address: "" });
let itemSeq = 0;
const newItem = (): InvoiceItem => ({ id: `it-${(itemSeq += 1)}`, title: "", qty: 1, unitPrice: 0, discountPct: 0 });
const KEY = "dastafzar-invoice-draft";
const ACCENTS: Record<string, string> = { green: "#0b7a4b", teal: "#0f766e", blue: "#1d4ed8", slate: "#334155" };

export default function InvoiceTool() {
  const [d, setD] = useState<Draft>(() => ({
    seller: emptyParty(), buyer: emptyParty(), no: "", date: "", vatPct: 10, currency: "تومان",
    items: [newItem()], shipping: 0, globalDiscount: 0, notes: "", bank: "", accent: "green", logo: "",
  }));
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    track("invoice-maker", "view");
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { setD({ ...JSON.parse(raw), date: JSON.parse(raw).date || "" }); hydrated.current = true; return; }
    } catch { /* fresh draft */ }
    const t = new Date();
    const j = gregorianToJalali({ gy: t.getFullYear(), gm: t.getMonth() + 1, gd: t.getDate() });
    setD((p) => ({ ...p, date: faDate(j), no: String(j.jy).slice(2) + String(j.jm).padStart(2, "0") + String(j.jd).padStart(2, "0") + "-۱".replace("۱", "1") }));
    hydrated.current = true;
  }, []);

  const totals = useMemo(() => {
    const base = calcInvoice(d.items, d.vatPct);
    const grand = Math.max(0, base.subtotal + base.vatAmount + (d.shipping || 0) - (d.globalDiscount || 0));
    return { ...base, grand };
  }, [d.items, d.vatPct, d.shipping, d.globalDiscount]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const setParty = (which: "seller" | "buyer", k: keyof Party, v: string) =>
    setD((p) => ({ ...p, [which]: { ...p[which], [k]: v } }));
  const setItem = (id: string, k: keyof InvoiceItem, v: string | number) =>
    setD((p) => ({ ...p, items: p.items.map((it) => (it.id === id ? { ...it, [k]: v } : it)) }));

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(d)); setSaved(true); setTimeout(() => setSaved(false), 2000); track("invoice-maker", "use"); } catch { /* storage full */ }
  };
  const fresh = () => {
    if (!confirm("فاکتور تازه شروع شود؟ پیش‌نویس ذخیره‌شده پاک می‌شود.")) return;
    localStorage.removeItem(KEY);
    const t = new Date();
    const j = gregorianToJalali({ gy: t.getFullYear(), gm: t.getMonth() + 1, gd: t.getDate() });
    setD({ seller: emptyParty(), buyer: emptyParty(), no: "", date: faDate(j), vatPct: 10, currency: "تومان", items: [newItem()], shipping: 0, globalDiscount: 0, notes: "", bank: "", accent: "green", logo: "" });
  };
  const copySummary = async () => {
    const txt = `فاکتور ${d.no} — ${d.seller.name || "فروشنده"}\nمبلغ نهایی: ${fmtMoney(totals.grand)} ${d.currency}\n(${numberToWordsFa(totals.grand)} ${d.currency})`;
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ }
  };
  const onLogo = (f: File | undefined) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => set("logo", String(r.result));
    r.readAsDataURL(f);
  };

  const fld = (label: string, v: string, on: (v: string) => void, ph = "", ltr = false) => (
    <label className="inv-fld"><span>{label}</span>
      <input value={v} placeholder={ph} dir={ltr ? "ltr" : undefined} onChange={(e) => on(e.target.value)} />
    </label>
  );
  const num = (label: string, v: number, on: (v: number) => void) => (
    <label className="inv-fld"><span>{label}</span>
      <input inputMode="numeric" dir="ltr" value={v === 0 ? "" : String(v)} placeholder="۰"
        onChange={(e) => on(parseInt(e.target.value.replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c))).replace(/[^\d]/g, "") || "0", 10))} />
    </label>
  );

  return (
    <div className="inv-wrap">
      <div className="inv-form tool-box">
        <h2 className="inv-h"><Banknote size={19} aria-hidden /> اطلاعات فاکتور</h2>
        <div className="inv-grid2">
          {fld("نام فروشنده / شرکت", d.seller.name, (v) => setParty("seller", "name", v), "مثلاً فروشگاه آوا")}
          {fld("تلفن فروشنده", d.seller.phone, (v) => setParty("seller", "phone", v), "", true)}
          {fld("کد اقتصادی", d.seller.econ, (v) => setParty("seller", "econ", v), "", true)}
          {fld("شناسه / کد ملی", d.seller.national, (v) => setParty("seller", "national", v), "", true)}
        </div>
        {fld("نشانی فروشنده", d.seller.address, (v) => setParty("seller", "address", v))}
        <div className="inv-grid2">
          {fld("نام خریدار", d.buyer.name, (v) => setParty("buyer", "name", v))}
          {fld("تلفن خریدار", d.buyer.phone, (v) => setParty("buyer", "phone", v), "", true)}
        </div>
        {fld("نشانی خریدار", d.buyer.address, (v) => setParty("buyer", "address", v))}
        <div className="inv-grid3">
          {fld("شماره فاکتور", d.no, (v) => set("no", v), "", true)}
          {fld("تاریخ (شمسی)", d.date, (v) => set("date", v), "۱۴۰۵/۰۷/۲۹")}
          {num("ارزش افزوده ٪", d.vatPct, (v) => set("vatPct", v))}
        </div>
        <div className="inv-grid3">
          <label className="inv-fld"><span>واحد پول</span>
            <select value={d.currency} onChange={(e) => set("currency", e.target.value)}>
              <option>تومان</option><option>ریال</option>
            </select>
          </label>
          <label className="inv-fld"><span>رنگ فاکتور</span>
            <select value={d.accent} onChange={(e) => set("accent", e.target.value)}>
              <option value="green">سبز</option><option value="teal">فیروزه‌ای</option><option value="blue">آبی</option><option value="slate">خاکستری</option>
            </select>
          </label>
          <label className="inv-fld"><span>لوگو</span>
            <button type="button" className="inv-upload" onClick={() => logoRef.current?.click()}><Upload size={15} aria-hidden /> {d.logo ? "تغییر لوگو" : "افزودن لوگو"}</button>
            <input ref={logoRef} type="file" accept="image/*" hidden onChange={(e) => onLogo(e.target.files?.[0])} />
          </label>
        </div>

        <h3 className="inv-h2">ردیف‌های فاکتور</h3>
        <div className="inv-items">
          {d.items.map((it, i) => {
            const net = totals.lines.find((l) => l.id === it.id)?.net ?? 0;
            return (
              <div key={it.id} className="inv-row">
                <span className="inv-rowno">{faNum(i + 1)}</span>
                <input className="inv-cell grow" aria-label="شرح کالا یا خدمت" placeholder="شرح کالا / خدمت" value={it.title} onChange={(e) => setItem(it.id, "title", e.target.value)} />
                <input className="inv-cell sm" aria-label="تعداد" inputMode="numeric" dir="ltr" placeholder="تعداد" value={it.qty || ""} onChange={(e) => setItem(it.id, "qty", parseInt(e.target.value.replace(/[^\d]/g, "") || "0", 10))} />
                <input className="inv-cell md" aria-label="قیمت واحد" inputMode="numeric" dir="ltr" placeholder="قیمت واحد" value={it.unitPrice || ""} onChange={(e) => setItem(it.id, "unitPrice", parseInt(e.target.value.replace(/[^\d]/g, "") || "0", 10))} />
                <input className="inv-cell sm" aria-label="تخفیف درصد" inputMode="numeric" dir="ltr" placeholder="٪ تخفیف" value={it.discountPct || ""} onChange={(e) => setItem(it.id, "discountPct", parseInt(e.target.value.replace(/[^\d]/g, "") || "0", 10))} />
                <span className="inv-net">{fmtMoney(net)}</span>
                <button type="button" className="inv-del" aria-label={`حذف ردیف ${i + 1}`} disabled={d.items.length === 1}
                  onClick={() => setD((p) => ({ ...p, items: p.items.filter((x) => x.id !== it.id) }))}><Trash2 size={16} /></button>
              </div>
            );
          })}
        </div>
        <button type="button" className="inv-add" onClick={() => setD((p) => ({ ...p, items: [...p.items, newItem()] }))}><Plus size={16} aria-hidden /> افزودن ردیف</button>

        <div className="inv-grid2">
          {num(`هزینه ارسال (${d.currency})`, d.shipping, (v) => set("shipping", v))}
          {num(`تخفیف کلی (${d.currency})`, d.globalDiscount, (v) => set("globalDiscount", v))}
        </div>
        {fld("اطلاعات پرداخت (شماره کارت / شبا)", d.bank, (v) => set("bank", v), "", true)}
        <label className="inv-fld"><span>توضیحات و شرایط</span>
          <textarea rows={2} value={d.notes} onChange={(e) => set("notes", e.target.value)} placeholder="مثلاً مهلت پرداخت، شرایط مرجوعی…" />
        </label>

        <div className="inv-actions">
          <button type="button" className="inv-btn primary" onClick={() => { track("invoice-maker", "use"); window.print(); }}><Printer size={16} aria-hidden /> چاپ / PDF</button>
          <button type="button" className="inv-btn" onClick={save}>{saved ? <><Check size={16} aria-hidden /> ذخیره شد</> : <><Save size={16} aria-hidden /> ذخیره پیش‌نویس</>}</button>
          <button type="button" className="inv-btn" onClick={copySummary}>{copied ? <><Check size={16} aria-hidden /> کپی شد</> : <><Copy size={16} aria-hidden /> کپی خلاصه</>}</button>
          <button type="button" className="inv-btn danger" onClick={fresh}><FilePlus2 size={16} aria-hidden /> فاکتور تازه</button>
        </div>
        <p className="inv-priv">پیش‌نویس فقط روی همین دستگاه ذخیره می‌شود (حافظه مرورگر) — هیچ داده‌ای به سرور نمی‌رود.</p>
      </div>

      {/* ------- A4 sheet (this is what prints) ------- */}
      <div className="inv-sheet" style={{ ["--inv-accent" as string]: ACCENTS[d.accent] }}>
        <header className="inv-s-head">
          {d.logo ? <img src={d.logo} alt="لوگوی فروشنده" className="inv-s-logo" /> : null}
          <div className="inv-s-seller">
            <strong>{d.seller.name || "نام فروشنده"}</strong>
            <span>{d.seller.address}</span>
            <span>{d.seller.phone}</span>
          </div>
          <div className="inv-s-meta">
            <h2>فاکتور فروش</h2>
            <span>شماره: {d.no || "—"}</span>
            <span>تاریخ: {d.date || "—"}</span>
          </div>
        </header>
        <div className="inv-s-parties">
          <p><b>فروشنده:</b> {d.seller.name} {d.seller.econ && <>· کد اقتصادی: {d.seller.econ}</>} {d.seller.national && <>· شناسه ملی: {d.seller.national}</>}</p>
          <p><b>خریدار:</b> {d.buyer.name || "—"} {d.buyer.phone && <>· {d.buyer.phone}</>} {d.buyer.address && <>· {d.buyer.address}</>}</p>
        </div>
        <table className="inv-s-table">
          <thead><tr><th>ردیف</th><th>شرح کالا / خدمت</th><th>تعداد</th><th>قیمت واحد</th><th>تخفیف</th><th>مبلغ ({d.currency})</th></tr></thead>
          <tbody>
            {d.items.map((it, i) => (
              <tr key={it.id}>
                <td>{faNum(i + 1)}</td><td className="r">{it.title || "—"}</td><td>{faNum(it.qty)}</td>
                <td>{fmtMoney(it.unitPrice)}</td><td>{it.discountPct ? faNum(it.discountPct) + "٪" : "—"}</td>
                <td>{fmtMoney(totals.lines.find((l) => l.id === it.id)?.net ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="inv-s-totals">
          <p><span>جمع جزء</span><b>{fmtMoney(totals.subtotal)}</b></p>
          {d.shipping > 0 && <p><span>هزینه ارسال</span><b>{fmtMoney(d.shipping)}</b></p>}
          {d.globalDiscount > 0 && <p><span>تخفیف کلی</span><b>{fmtMoney(d.globalDiscount)}−</b></p>}
          <p><span>ارزش افزوده ({faNum(d.vatPct)}٪)</span><b>{fmtMoney(totals.vatAmount)}</b></p>
          <p className="grand"><span>مبلغ قابل پرداخت ({d.currency})</span><b>{fmtMoney(totals.grand)}</b></p>
          <p className="words">{numberToWordsFa(totals.grand)} {d.currency}</p>
        </div>
        {d.bank && <p className="inv-s-bank">پرداخت: <span dir="ltr">{d.bank}</span></p>}
        {d.notes && <p className="inv-s-notes">{d.notes}</p>}
        <footer className="inv-s-sign"><span>مهر و امضای فروشنده</span><span>امضای خریدار</span></footer>
      </div>
    </div>
  );
}
