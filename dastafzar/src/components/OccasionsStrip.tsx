"use client";
// Upcoming occasions with live day counts — client-computed for the same
// reason as NowruzPill: a prerendered page must not freeze "today".
import { useEffect, useState } from "react";
import Link from "next/link";
import { gregorianToJalali, jalaliToUtcMs, faNum, faDate } from "@/lib/date";

const OCCASIONS = [
  { title: "نوروز", jm: 1, jd: 1 },
  { title: "مهرگان", jm: 7, jd: 16 },
  { title: "یلدا", jm: 9, jd: 30 },
];

interface Row { title: string; dateLabel: string; days: number }

export default function OccasionsStrip() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const now = new Date();
    const todayJ = gregorianToJalali({ gy: now.getFullYear(), gm: now.getMonth() + 1, gd: now.getDate() });
    const todayMs = jalaliToUtcMs(todayJ);
    const list = OCCASIONS.map((o) => {
      let jy = todayJ.jy;
      if (jalaliToUtcMs({ jy, jm: o.jm, jd: o.jd }) < todayMs) jy += 1;
      const days = Math.round((jalaliToUtcMs({ jy, jm: o.jm, jd: o.jd }) - todayMs) / 86_400_000);
      return { title: o.title, dateLabel: faDate({ jy, jm: o.jm, jd: o.jd }), days };
    }).sort((a, b) => a.days - b.days);
    setRows(list);
  }, []);

  return (
    <section className="occasions" aria-label="مناسبت‌های پیش رو">
      <div className="sec-head">
        <div>
          <h2>مناسبت‌های پیش رو</h2>
          <p className="sec-sub">هیچ مناسبتی را از دست نده</p>
        </div>
        <Link className="more-link" href="/tools/jalali-calendar">تقویم کامل</Link>
      </div>
      <div className="occ-rail">
        {rows.map((r) => (
          <div key={r.title} className="occ-card">
            <div><b>{r.title}</b><span>{r.dateLabel}</span></div>
            <span className="occ-days">{r.days === 0 ? "امروز!" : `${faNum(r.days)} روز مانده`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
