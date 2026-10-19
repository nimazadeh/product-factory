"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS_FA, WEEKDAYS_FA, WEEKDAY_FA, diffDays, faDate, faNum, firstColumnOfMonth, gregorianToJalali, isValidJalali, jalaliToGregorian, monthLength, pad2, type JDate } from "@/lib/date";
import { track } from "@/lib/track";

interface Occasion { id: string; title: string; month: number; day: number }
const FALLBACK: Occasion[] = [
  { id: "n", title: "نوروز", month: 1, day: 1 }, { id: "m", title: "مهرگان", month: 7, day: 16 }, { id: "y", title: "یلدا", month: 9, day: 30 },
];

export default function CalendarTool() {
  const [today, setToday] = useState<JDate | null>(null);
  const [cursor, setCursor] = useState({ jy: 1405, jm: 7 });
  const [selected, setSelected] = useState<JDate | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>(FALLBACK);

  useEffect(() => {
    const t = new Date();
    const j = gregorianToJalali({ gy: t.getFullYear(), gm: t.getMonth() + 1, gd: t.getDate() });
    setToday(j); setCursor({ jy: j.jy, jm: j.jm }); setSelected(j);
    track("jalali-calendar", "view");
    fetch("/api-backend/public/occasions").then((r) => (r.ok ? r.json() : [])).then((d) => { if (Array.isArray(d) && d.length) setOccasions(d); }).catch(() => { /* fallback occasions stay */ });
  }, []);

  const cells = useMemo(() => {
    const start = firstColumnOfMonth(cursor.jy, cursor.jm);
    const len = monthLength(cursor.jy, cursor.jm);
    return { start, days: Array.from({ length: len }, (_, i) => i + 1) };
  }, [cursor]);

  const move = (d: number) => setCursor((c) => {
    const m = c.jm + d;
    return m < 1 ? { jy: c.jy - 1, jm: 12 } : m > 12 ? { jy: c.jy + 1, jm: 1 } : { jy: c.jy, jm: m };
  });

  const occOf = (jd: number) => occasions.find((o) => o.month === cursor.jm && o.day === jd);
  const selInfo = useMemo(() => {
    if (!selected || !today || !isValidJalali(selected)) return null;
    const g = jalaliToGregorian(selected);
    const diff = diffDays(selected, today);
    return { gText: `${WEEKDAY_FA(g)} — ${g.gy}/${pad2(g.gm)}/${pad2(g.gd)} میلادی`, diff, occ: occasions.find((o) => o.month === selected.jm && o.day === selected.jd) };
  }, [selected, today, occasions]);

  return (
    <div className="tool-box cal">
      <div className="cal-head">
        <button type="button" className="pg-btn" onClick={() => move(-1)} aria-label="ماه قبل"><ChevronRight size={19} /></button>
        <strong className="cal-title">{MONTHS_FA[cursor.jm - 1]} {faNum(cursor.jy)}</strong>
        <button type="button" className="pg-btn" onClick={() => move(1)} aria-label="ماه بعد"><ChevronLeft size={19} /></button>
      </div>
      {today && <button type="button" className="copy-btn" onClick={() => { setCursor({ jy: today.jy, jm: today.jm }); setSelected(today); }}>امروز: {faDate(today)}</button>}
      <div className="cal-grid" role="grid" aria-label={`تقویم ${MONTHS_FA[cursor.jm - 1]} ${cursor.jy}`}>
        {WEEKDAYS_FA.map((d) => <span key={d} className="cal-wd">{d.slice(0, 2)}</span>)}
        {Array.from({ length: cells.start }).map((_, i) => <span key={`e${i}`} />)}
        {cells.days.map((d) => {
          const isToday = today?.jy === cursor.jy && today?.jm === cursor.jm && today?.jd === d;
          const isSel = selected?.jy === cursor.jy && selected?.jm === cursor.jm && selected?.jd === d;
          const occ = occOf(d);
          return (
            <button type="button" key={d} className={`cal-day ${isToday ? "today" : ""} ${isSel ? "sel" : ""}`}
              aria-pressed={isSel} aria-label={`${d} ${MONTHS_FA[cursor.jm - 1]}${occ ? " — " + occ.title : ""}${isToday ? " (امروز)" : ""}`}
              onClick={() => setSelected({ jy: cursor.jy, jm: cursor.jm, jd: d })}>
              {faNum(d)}{occ && <span className="cal-dot" aria-hidden="true" />}</button>
          );
        })}
      </div>
      {selInfo && selected && (
        <div className="result-big" role="status">
          <strong>{faDate(selected)}</strong> — {selInfo.gText}
          {selInfo.occ && <><br />🎉 مناسبت: {selInfo.occ.title}</>}
          <br />{selInfo.diff === 0 ? "همین امروز است" : `فاصله از امروز: ${faNum(selInfo.diff)} روز`}
        </div>
      )}
    </div>
  );
}
