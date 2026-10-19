import { fmtShort } from "../lib/money";
export { default as TrendChart } from "./TrendChart";
export type { Point } from "./TrendChart";
export function BudgetRing({ used, total, label }: { used: number; total: number; label: string }) {
  const pct = total ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const R = 52, C = 2 * Math.PI * R;
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 128 128" className="ring" role="img" aria-label={`${label}: ${pct} درصد استفاده شده`}>
        <circle cx="64" cy="64" r={R} fill="none" stroke="var(--line)" strokeWidth="11" />
        <circle cx="64" cy="64" r={R} fill="none" stroke={pct >= 100 ? "var(--danger)" : "var(--primary)"} strokeWidth="11"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100} transform="rotate(-90 64 64)" />
        <text x="64" y="60" textAnchor="middle" className="ring-pct">{pct}٪</text>
        <text x="64" y="80" textAnchor="middle" className="ring-label">{label}</text>
      </svg>
      <p className="ring-note num">{fmtShort(used)} از {fmtShort(total)}</p>
    </div>
  );
}
export function CategoryBars({ items }: { items: {category:string;total:number}[] }) {
  const max=Math.max(1,...items.map(i=>i.total));
  return <ul className="catbars">{items.map(i=><li key={i.category}>
    <span className="catbars-name">{i.category}</span>
    <span className="catbars-track"><span className="catbars-fill" style={{width:`${(i.total/max)*100}%`}}/></span>
    <span className="num">{fmtShort(i.total)}</span></li>)}</ul>;
}
