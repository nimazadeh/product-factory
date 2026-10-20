"use client";
import { useEffect, useState } from "react";
import { ageFrom, diffDays, faNum, gregorianToJalali, jalaliToGregorian, nextNowruz, pad2 } from "@/lib/date";

/** Stripe lesson: show a live result, not a dead icon+text. Computed on the
    client after mount so the landing stays static (SSG). */
export default function CardSample({ slug }: { slug: string }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    const t = new Date();
    const todayJ = gregorianToJalali({ gy: t.getFullYear(), gm: t.getMonth() + 1, gd: t.getDate() });
    if (slug === "date-converter") {
      setText(`امروز: ${faNum(todayJ.jy)}/${faNum(pad2(todayJ.jm))}/${faNum(pad2(todayJ.jd))} = ${t.getFullYear()}/${pad2(t.getMonth() + 1)}/${pad2(t.getDate())} میلادی`);
    } else if (slug === "age-calculator") {
      const a = ageFrom({ jy: 1375, jm: 1, jd: 1 }, todayJ);
      if (a) setText(`مثلاً متولد ۱۳۷۵: الان ${faNum(a.years)} سال و ${faNum(a.months)} ماه`);
    } else if (slug === "date-difference") {
      const n = diffDays({ jy: todayJ.jy, jm: 1, jd: 1 }, todayJ);
      setText(`از نوروز تا امروز: ${faNum(n)} روز گذشته`);
    } else if (slug === "nowruz-countdown") {
      const n = nextNowruz(t);
      setText(`${faNum(n.daysLeft)} روز مانده تا نوروز ${faNum(n.jalaliYear)}`);
    } else if (slug === "jalali-calendar") {
      setText(`همین حالا: ${faNum(todayJ.jd)} ${["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"][todayJ.jm - 1]} ${faNum(todayJ.jy)}`);
    }
  }, [slug]);
  return <span className="tool-live" aria-label="نمونه زنده">{text ?? "…"}</span>;
}
