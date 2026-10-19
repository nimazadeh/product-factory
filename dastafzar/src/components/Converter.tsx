"use client";
import { useEffect, useMemo, useState } from "react";
import { toGregorian, toJalaali } from "jalaali-js";
import { track } from "@/lib/track";

const faNum = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
const pad = (n: number) => String(n).padStart(2, "0");

/** Mini Jalali <-> Gregorian converter for the landing hero (full tool = ticket T2).
    Today is filled on the client via useEffect so the page stays static (SSG/SEO). */
export default function Converter() {
  const [todayJ, setTodayJ] = useState<{ jy: number; jm: number; jd: number } | null>(null);
  const [jy, setJy] = useState("");
  const [jm, setJm] = useState("");
  const [jd, setJd] = useState("");
  useEffect(() => {
    const t = new Date();
    const j = toJalaali(t.getFullYear(), t.getMonth() + 1, t.getDate());
    setTodayJ(j); setJy(String(j.jy)); setJm(String(j.jm)); setJd(String(j.jd));
  }, []);

  const result = useMemo(() => {
    const y = +jy, m = +jm, d = +jd;
    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return null;
    try {
      const g = toGregorian(y, m, d);
      const wd = new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(new Date(g.gy, g.gm - 1, g.gd));
      return { text: `${wd} — ${g.gy}/${pad(g.gm)}/${pad(g.gd)} میلادی`, ok: true };
    } catch { return { text: "این تاریخ معتبر نیست", ok: false }; }
  }, [jy, jm, jd]);

  const field = (label: string, v: string, set: (s: string) => void, max: number) => (
    <label className="conv-field"><span>{label}</span>
      <input inputMode="numeric" dir="ltr" value={v} maxLength={max}
        onChange={(e) => set(e.target.value.replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c))).replace(/[^\d]/g, ""))} />
    </label>
  );

  return (
    <div className="converter" aria-label="مبدل سریع تاریخ شمسی به میلادی">
      <div className="conv-fields">
        {field("سال شمسی", jy, setJy, 4)}
        {field("ماه", jm, setJm, 2)}
        {field("روز", jd, setJd, 2)}
      </div>
      <div className={`conv-result ${result?.ok ? "" : "err"}`} role="status">
        {result ? <>برابر است با <strong>{result.text}</strong></> : "تاریخ شمسی را وارد کنید"}
      </div>
      <p className="conv-today">{todayJ ? <>امروز: {faNum(todayJ.jy)}/{faNum(pad(todayJ.jm))}/{faNum(pad(todayJ.jd))} شمسی</> : "در حال بارگذاری تاریخ امروز…"}</p>
    </div>
  );
}
