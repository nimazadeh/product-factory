import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmt } from "../lib/money";
import Select from "./Select";

export const PAGE_SIZES = [5, 10, 20] as const;

function pageRange(page: number, pages: number): (number | "…")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const keep = [...new Set([1, pages, page - 1, page, page + 1].filter(p => p >= 1 && p <= pages))].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  keep.forEach((p, i) => { if (i && p - keep[i - 1] > 1) out.push("…"); out.push(p); });
  return out;
}

/** Enterprise pagination: range summary, numbered pages with ellipsis,
    previous/next (RTL-aware chevrons), and a page-size selector.
    44px targets, aria-current, keyboard-safe buttons. */
export default function Pagination({ page, pages, total, pageSize, onPage, onPageSize }: {
  page: number; pages: number; total: number; pageSize: number;
  onPage(p: number): void; onPageSize(n: number): void;
}) {
  if (pages <= 1) return null;
  const from = (page - 1) * pageSize + 1, to = Math.min(total, page * pageSize);
  return (
    <nav className="pagination" aria-label="صفحه‌بندی تراکنش‌ها">
      <span className="pg-info">نمایش <strong className="num">{fmt(from)} تا {fmt(to)}</strong> از <strong className="num">{fmt(total)}</strong> تراکنش</span>
      <div className="pg-controls">
        <button type="button" className="pg-btn" disabled={page === 1} onClick={() => onPage(page - 1)} aria-label="صفحه قبل">
          <ChevronRight size={18} /> <span className="pg-word">قبلی</span>
        </button>
        {pageRange(page, pages).map((p, i) => p === "…" ? (
          <span key={`e${i}`} className="pg-ellipsis" aria-hidden="true">…</span>
        ) : (
          <button type="button" key={p} className={`pg-btn pg-num ${p === page ? "active" : ""}`}
            aria-current={p === page ? "page" : undefined} aria-label={`صفحه ${fmt(p)}`}
            onClick={() => onPage(p)}>{fmt(p)}</button>
        ))}
        <button type="button" className="pg-btn" disabled={page === pages} onClick={() => onPage(page + 1)} aria-label="صفحه بعد">
          <span className="pg-word">بعدی</span> <ChevronLeft size={18} />
        </button>
      </div>
      <label className="pg-size">
        <span>در هر صفحه</span>
        <Select ariaLabel="تعداد در هر صفحه" value={String(pageSize)} onChange={(v) => onPageSize(Number(v))} options={PAGE_SIZES.map(String)} />
      </label>
    </nav>
  );
}
