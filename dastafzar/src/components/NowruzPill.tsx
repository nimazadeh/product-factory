"use client";
// Live Nowruz countdown for the landing hero — computed on the client so the
// static page never shows a stale build-time date.
import { useEffect, useState } from "react";
import { Hourglass } from "lucide-react";
import { nextNowruz, faNum, pad2 } from "@/lib/date";

export default function NowruzPill() {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; year: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const { date, jalaliYear } = nextNowruz(now);
      const ms = Math.max(0, date.getTime() - now.getTime());
      setLeft({
        d: Math.floor(ms / 86_400_000),
        h: Math.floor(ms / 3_600_000) % 24,
        m: Math.floor(ms / 60_000) % 60,
        year: jalaliYear,
      });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="Nowruz-pill" role="timer" aria-label="شمارش معکوس تا نوروز">
      <span className="Nowruz-label"><Hourglass size={16} aria-hidden /> تا نوروز {left ? faNum(left.year) : "…"}</span>
      <span className="Nowruz-nums" dir="ltr">
        <span className="Nowruz-n"><b>{left ? faNum(left.d) : "–"}</b><i>روز</i></span>
        <span className="Nowruz-n"><b>{left ? faNum(pad2(left.h)) : "–"}</b><i>ساعت</i></span>
        <span className="Nowruz-n"><b>{left ? faNum(pad2(left.m)) : "–"}</b><i>دقیقه</i></span>
      </span>
    </div>
  );
}
