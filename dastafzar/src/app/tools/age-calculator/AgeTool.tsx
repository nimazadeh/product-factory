"use client";
import { useEffect, useMemo, useState } from "react";
import JalaliInputs from "@/components/JalaliInputs";
import { ageFrom, faNum, gregorianToJalali, isValidJalali, type JDate } from "@/lib/date";

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
      <div className={`result-big ${birth.jy && !age ? "err" : ""}`} role="status">
        {!birth.jy ? "تاریخ تولد را وارد کنید"
          : !age ? "تاریخ تولد معتبر نیست یا در آینده است"
          : <>سن شما: <strong>{faNum(age.years)} سال و {faNum(age.months)} ماه و {faNum(age.days)} روز</strong></>}
      </div>
    </div>
  );
}
