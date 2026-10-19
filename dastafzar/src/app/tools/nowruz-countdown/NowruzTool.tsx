"use client";
import { useEffect, useState } from "react";
import { faDate, faNum, gregorianToJalali, nextNowruz } from "@/lib/date";

export default function NowruzTool() {
  const [info, setInfo] = useState<{ year: number; days: number; gText: string } | null>(null);
  const [shared, setShared] = useState(false);
  useEffect(() => {
    const n = nextNowruz(new Date());
    setInfo({
      year: n.jalaliYear, days: n.daysLeft,
      gText: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(n.date),
    });
  }, []);

  const share = async () => {
    if (!info) return;
    const text = `تا نوروز ${faNum(info.year)} فقط ${faNum(info.days)} روز مانده! 🌱 — دست‌افزار`;
    try {
      if (navigator.share) await navigator.share({ title: "شمارش معکوس نوروز", text, url: location.href });
      else { await navigator.clipboard.writeText(text + " " + location.href); setShared(true); setTimeout(() => setShared(false), 2000); }
    } catch { /* user cancelled */ }
  };

  return (
    <div className="tool-box">
      {info ? (
        <>
          <div className="count-num" role="status">{faNum(info.days)}</div>
          <div className="result-big">روز مانده تا نوروز <strong>{faNum(info.year)}</strong><br />
            <small>تحویل سال: {info.gText} میلادی</small></div>
          <div style={{ textAlign: "center" }}>
            <button type="button" className="copy-btn" onClick={share}>{shared ? "کپی شد ✓" : "اشتراک‌گذاری 🌱"}</button>
          </div>
        </>
      ) : <div className="result-big">در حال محاسبه…</div>}
    </div>
  );
}
