"use client";
import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { faNum, pad2, nextNowruz } from "@/lib/date";
import { track } from "@/lib/track";

interface Left { year: number; d: number; h: number; m: number; s: number; gText: string }

export default function NowruzTool() {
  const [left, setLeft] = useState<Left | null>(null);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const n = nextNowruz(now);
      const ms = Math.max(0, n.date.getTime() - now.getTime());
      setLeft({
        year: n.jalaliYear,
        d: Math.floor(ms / 86_400_000),
        h: Math.floor(ms / 3_600_000) % 24,
        m: Math.floor(ms / 60_000) % 60,
        s: Math.floor(ms / 1_000) % 60,
        gText: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(n.date),
      });
    };
    tick();
    const id = setInterval(tick, 1_000);
    track("nowruz-countdown", "view");
    return () => clearInterval(id);
  }, []);

  const share = async () => {
    track("nowruz-countdown", "share");
    if (!left) return;
    const text = `تا نوروز ${faNum(left.year)} فقط ${faNum(left.d)} روز مانده! — دست‌افزار`;
    try {
      if (navigator.share) await navigator.share({ title: "شمارش معکوس نوروز", text, url: location.href });
      else { await navigator.clipboard.writeText(text + " " + location.href); setShared(true); setTimeout(() => setShared(false), 2000); }
    } catch { /* user cancelled */ }
  };

  return (
    <div className="tool-box">
      {left ? (
        <>
          <div className="res-card" role="timer" aria-label={`روز مانده تا نوروز ${left.year}`}>
            <span className="res-label">روز مانده تا نوروز {faNum(left.year)}</span>
            <div className="stat-tiles stat-tiles-4">
              <span className="stat-tile"><b>{faNum(left.d)}</b><i>روز</i></span>
              <span className="stat-tile"><b>{faNum(pad2(left.h))}</b><i>ساعت</i></span>
              <span className="stat-tile"><b>{faNum(pad2(left.m))}</b><i>دقیقه</i></span>
              <span className="stat-tile"><b>{faNum(pad2(left.s))}</b><i>ثانیه</i></span>
            </div>
            <span className="res-sub">تحویل سال: {left.gText} میلادی</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <button type="button" className="copy-btn" onClick={share}>
              {shared ? <><Check size={16} aria-hidden /> کپی شد</> : <><Share2 size={16} aria-hidden /> اشتراک‌گذاری</>}
            </button>
          </div>
        </>
      ) : <div className="result-big">در حال محاسبه…</div>}
    </div>
  );
}
