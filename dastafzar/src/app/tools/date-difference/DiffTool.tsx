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
      <div className="result-big" role="status">
        {days === null ? "هر دو تاریخ را وارد کنید" : days === 0 ? "هر دو تاریخ یکی‌اند"
          : <>فاصله: <strong>{faNum(days)} روز</strong> ({faNum(Math.floor(days / 7))} هفته و {faNum(days % 7)} روز)</>}
      </div>
    </div>
  );
}
