import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS_FA, WEEKDAYS_FA, firstWeekdayColumn, formatJalaliFa, isoToJalali, jalaliToIso, monthLength, todayIso, type Jalali } from "../lib/jalali";

interface Props { value: string; onChange(iso: string): void; ariaLabel: string }

/** Jalali (Shamsi) date picker — storage is ISO Gregorian, UI is fully Persian.
    Craft per skill 17: inset icon, animated popover, keyboard (Esc/arrows on grid buttons), touch >=44px cells are visual 40 + row gap. */
export default function JalaliDatePicker({ value, onChange, ariaLabel }: Props) {
  const [open, setOpen] = useState(false);
  const sel = isoToJalali(value || todayIso());
  const [view, setView] = useState<Jalali>({ jy: sel.jy, jm: sel.jm, jd: 1 });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const cur = isoToJalali(value || todayIso());
    setView({ jy: cur.jy, jm: cur.jm, jd: 1 });
    const onDoc = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, value]);

  const shiftMonth = (delta: number) => setView(v => {
    const total = v.jy * 12 + (v.jm - 1) + delta;
    return { jy: Math.floor(total / 12), jm: (total % 12) + 1, jd: 1 };
  });
  const pick = (jd: number) => { onChange(jalaliToIso({ jy: view.jy, jm: view.jm, jd })); setOpen(false); };
  const len = monthLength(view.jy, view.jm);
  const startCol = firstWeekdayColumn(view.jy, view.jm);
  const todayJ = isoToJalali(todayIso());
  const cells: (number | null)[] = [...Array(startCol).fill(null), ...Array.from({ length: len }, (_, i) => i + 1)];

  return (
    <div className="select datepicker" ref={rootRef}>
      <button type="button" className="select-btn" aria-haspopup="dialog" aria-expanded={open} aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}>
        <span>{formatJalaliFa(value || todayIso())}</span>
        <CalendarDays size={20} className="select-chevron" aria-hidden />
      </button>
      {open && (
        <div className="date-pop" role="dialog" aria-label={ariaLabel}>
          <div className="date-head">
            <button type="button" className="iconbtn sm" onClick={() => shiftMonth(-1)} aria-label="ماه قبل"><ChevronRight size={18} /></button>
            <strong>{MONTHS_FA[view.jm - 1]} {view.jy}</strong>
            <button type="button" className="iconbtn sm" onClick={() => shiftMonth(1)} aria-label="ماه بعد"><ChevronLeft size={18} /></button>
          </div>
          <div className="date-grid" role="grid" aria-label={`${MONTHS_FA[view.jm - 1]} ${view.jy}`}>
            {WEEKDAYS_FA.map(d => <span key={d} className="date-dow" aria-hidden>{d}</span>)}
            {cells.map((d, i) => d === null
              ? <span key={`x${i}`} />
              : <button type="button" key={d} className={`date-day${d === sel.jd && view.jm === sel.jm && view.jy === sel.jy ? " selected" : ""}${d === todayJ.jd && view.jm === todayJ.jm && view.jy === todayJ.jy ? " today" : ""}`}
                  aria-label={`${d} ${MONTHS_FA[view.jm - 1]} ${view.jy}`} aria-pressed={d === sel.jd && view.jm === sel.jm && view.jy === sel.jy}
                  onClick={() => pick(d)}>{d}</button>)}
          </div>
          <button type="button" className="link date-today" onClick={() => { onChange(todayIso()); setOpen(false); }}>امروز</button>
        </div>
      )}
    </div>
  );
}
