import type { Period, Transaction } from "./types";
const fa = new Intl.NumberFormat("fa-IR");
export const fmt = (n: number) => fa.format(Math.round(n));
export const fmtToman = (n: number) => `${fa.format(Math.round(n))} تومان`;
export const fmtShort = (n: number) => n >= 1_000_000 ? `${fa.format(+(n/1_000_000).toFixed(1))} م.ت` : n >= 1_000 ? `${fa.format(Math.round(n/1_000))} ه.ت` : fmt(n);
export const daysInPeriod = (p: Period) => p === "day" ? 1 : p === "week" ? 7 : 30;
export const PERIOD_LABEL: Record<Period,string> = { day: "امروز", week: "۷ روز اخیر", month: "۳۰ روز اخیر" };
function startOfDaysAgo(days: number) { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - (days - 1)); return d; }
export function inPeriod(tx: Transaction, p: Period, offset = 0) {
  const len = daysInPeriod(p); const end = startOfDaysAgo(offset * len); const start = startOfDaysAgo(offset * len + len);
  const t = new Date(tx.date + "T12:00:00"); return offset === 0 ? t >= start : (t >= start && t < end);
}
export const sum = (txs: Transaction[], type: "income"|"expense") => txs.filter(t=>t.type===type).reduce((a,t)=>a+t.amount,0);
export function dailySeries(txs: Transaction[], p: Period) {
  const len = p === "day" ? 24 : daysInPeriod(p); const out: {label:string; expense:number; income:number}[] = [];
  if (p === "day") { for (let h=0; h<24; h+=3) out.push({label:`${h}`, expense:0, income:0}); return out; }
  for (let i=len-1;i>=0;i--){ const d=startOfDaysAgo(i+1); const key=d.toISOString().slice(0,10);
    const day=txs.filter(t=>t.date===key);
    out.push({label:new Intl.DateTimeFormat("fa-IR",{day:"numeric",month:"short"}).format(d), expense:sum(day,"expense"), income:sum(day,"income")}); }
  return out;
}
export function byCategory(txs: Transaction[]) {
  const m = new Map<string, number>();
  txs.filter(t=>t.type==="expense").forEach(t=>m.set(t.category,(m.get(t.category)??0)+t.amount));
  return [...m.entries()].map(([category,total])=>({category,total})).sort((a,b)=>b.total-a.total);
}
export const dateFa = (iso: string) => new Intl.DateTimeFormat("fa-IR",{weekday:"short",day:"numeric",month:"short"}).format(new Date(iso+"T12:00:00"));
