"use client";
import { gregorianToJalali, jalaliToGregorian, type JDate } from "@/lib/date";

/** Airbnb lesson: offer ready-made dates ("flexible") instead of forcing typing. */
export default function DateChips({ onPick }: { onPick: (j: JDate) => void }) {
  const today = (): JDate => {
    const t = new Date();
    return gregorianToJalali({ gy: t.getFullYear(), gm: t.getMonth() + 1, gd: t.getDate() });
  };
  const chips: { label: string; pick: () => JDate }[] = [
    { label: "امروز", pick: today },
    { label: "اول این ماه", pick: () => { const t = today(); return { ...t, jd: 1 }; } },
    {
      label: "نوروز",
      pick: () => {
        const t = today();
        const thisYear = jalaliToGregorian({ jy: t.jy, jm: 1, jd: 1 });
        const now = new Date();
        const passed = new Date(thisYear.gy, thisYear.gm - 1, thisYear.gd) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return { jy: passed ? t.jy + 1 : t.jy, jm: 1, jd: 1 };
      },
    },
  ];
  return (
    <div className="date-chips" role="group" aria-label="تاریخ‌های آماده">
      {chips.map((c) => (
        <button key={c.label} type="button" className="date-chip" onClick={() => onPick(c.pick())}>{c.label}</button>
      ))}
    </div>
  );
}
