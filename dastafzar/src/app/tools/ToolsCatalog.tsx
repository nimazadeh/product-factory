"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpLeft, CalendarDays, Cake, CalendarRange, Sparkles, Shuffle } from "lucide-react";
import type { ToolEntry } from "@/lib/tools-data";
import { TOOL_CATEGORIES } from "@/lib/tools-data";

const ICONS: Record<string, typeof CalendarDays> = {
  "date-converter": Shuffle, "age-calculator": Cake, "date-difference": CalendarRange,
  "nowruz-countdown": Sparkles, "jalali-calendar": CalendarDays,
};

export default function ToolsCatalog({ tools }: { tools: ToolEntry[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("همه");
  const filtered = useMemo(() => tools.filter((t) =>
    (cat === "همه" || t.category === cat) &&
    (q.trim() === "" || `${t.title} ${t.short} ${t.category}`.includes(q.trim())),
  ), [tools, q, cat]);

  return (
    <div>
      <label className="tools-search">
        <Search size={18} aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو در ابزارها…" aria-label="جستجو در ابزارها" />
      </label>
      <div className="tools-cats" role="tablist" aria-label="دسته‌بندی ابزارها">
        {TOOL_CATEGORIES.map((c) => (
          <button key={c} type="button" role="tab" aria-selected={cat === c} className={`tools-chip${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {filtered.length ? (
        <div className="tools-grid-page">
          {filtered.map((t) => {
            const Icon = ICONS[t.slug] ?? CalendarDays;
            return (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="tool-card-page">
                <span className="tcp-icon"><Icon size={22} /></span>
                <span className="tcp-body"><strong>{t.title}</strong><small>{t.short}</small></span>
                {t.badge ? <span className="tcp-badge">{t.badge}</span> : null}
                <ArrowUpLeft size={17} className="tcp-arrow" aria-hidden />
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="tools-empty">ابزاری با این جستجو پیدا نشد. کلمه رو ساده‌تر کن یا دسته رو عوض کن.</p>
      )}
    </div>
  );
}
