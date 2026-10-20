"use client";
import { useMemo, useState } from "react";
import JalaliInputs from "@/components/JalaliInputs";
import { diffDays, faNum, isValidJalali, type JDate } from "@/lib/date";

const EMPTY: JDate = { jy: 0, jm: 0, jd: 0 };
export default function DiffTool() {
  const [a, setA] = useState<JDate>(EMPTY);
  const [b, setB] = useState<JDate>(EMPTY);
  const valid = isValidJalali(a) && isValidJalali(b) && a.jy > 0 && b.jy > 0;
  const days = useMemo(() => (valid ? diffDays(a, b) : null), [a, b, valid]);

  return (
    <div className="tool-box">
      <JalaliInputs legend="تاریخ اول" value={a} onChange={setA} />
      <JalaliInputs legend="تاریخ دوم" value={b} onChange={setB} />
      {days !== null && days > 0 ? (
        <div className="res-card" role="status">
          <span className="res-label">فاصله دو تاریخ</span>
          <span className="res-main fa-main">{faNum(days)} <small>روز</small></span>
          <span className="res-chips">
            <span className="res-chip">{faNum(Math.floor(days / 7))} هفته و {faNum(days % 7)} روز</span>
            <span className="res-chip">حدود {faNum(Math.max(1, Math.round(days / 30.44)))} ماه</span>
          </span>
        </div>
      ) : (
        <div className="result-big" role="status">{days === 0 ? "هر دو تاریخ یکی‌اند" : "هر دو تاریخ را وارد کنید"}</div>
      )}
    </div>
  );
}
