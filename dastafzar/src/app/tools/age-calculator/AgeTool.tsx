"use client";
import { useEffect, useMemo, useState } from "react";
import JalaliInputs from "@/components/JalaliInputs";
import { ageFrom, diffDays, faNum, gregorianToJalali, isValidJalali, type JDate } from "@/lib/date";

export default function AgeTool() {
  const [birth, setBirth] = useState<JDate>({ jy: 0, jm: 0, jd: 0 });
  const [today, setToday] = useState<JDate>({ jy: 0, jm: 0, jd: 0 });
  useEffect(() => {
    const t = new Date();
    setToday(gregorianToJalali({ gy: t.getFullYear(), gm: t.getMonth() + 1, gd: t.getDate() }));
  }, []);

  const age = useMemo(() => {
    if (!birth.jy || !isValidJalali(birth) || !today.jy) return null;
    return ageFrom(birth, today);
  }, [birth, today]);

  return (
    <div className="tool-box">
      <JalaliInputs legend="تاریخ تولد (شمسی)" value={birth} onChange={setBirth} />
      {age ? (
        <div className="res-card" role="status">
          <span className="res-label">سن دقیق شما</span>
          <div className="stat-tiles">
            <span className="stat-tile"><b>{faNum(age.years)}</b><i>سال</i></span>
            <span className="stat-tile"><b>{faNum(age.months)}</b><i>ماه</i></span>
            <span className="stat-tile"><b>{faNum(age.days)}</b><i>روز</i></span>
          </div>
          <span className="res-sub">در مجموع {faNum(diffDays(birth, today))} روز از تولدتان گذشته است</span>
        </div>
      ) : (
        <div className={`result-big ${birth.jy ? "err" : ""}`} role="status">
          {birth.jy ? "تاریخ تولد معتبر نیست یا در آینده است" : "تاریخ تولد را وارد کنید"}
        </div>
      )}
    </div>
  );
}
