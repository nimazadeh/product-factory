"use client";
import { useEffect, useMemo, useState } from "react";
import JalaliInputs from "@/components/JalaliInputs";
import { WEEKDAY_FA, faNum, gregorianToJalali, isValidJalali, jalaliToGregorian, pad2, type JDate } from "@/lib/date";

export default function ConverterTool() {
  const [j, setJ] = useState<JDate>({ jy: 0, jm: 0, jd: 0 });
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const t = new Date();
    setJ(gregorianToJalali({ gy: t.getFullYear(), gm: t.getMonth() + 1, gd: t.getDate() }));
  }, []);

  const out = useMemo(() => {
    if (!j.jy || !j.jm || !j.jd) return null;
    if (!isValidJalali(j)) return { ok: false, text: "این تاریخ شمسی معتبر نیست — روز و ماه را بررسی کنید." };
    const g = jalaliToGregorian(j);
    return { ok: true, text: `${WEEKDAY_FA(g)}، ${g.gy}/${pad2(g.gm)}/${pad2(g.gd)} میلادی`, raw: `${g.gy}/${pad2(g.gm)}/${pad2(g.gd)}` };
  }, [j]);

  return (
    <div className="tool-box">
      <JalaliInputs legend="تاریخ شمسی" value={j} onChange={setJ} />
      <div className={`result-big ${out && !out.ok ? "err" : ""}`} role="status">
        {out ? out.text : "تاریخ را وارد کنید"}
      </div>
      {out?.ok && (
        <div style={{ textAlign: "center" }}>
          <button type="button" className="copy-btn" onClick={async () => {
            try { await navigator.clipboard.writeText(out.raw ?? out.text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ }
          }}>{copied ? "کپی شد ✓" : "کپی نتیجه"}</button>
        </div>
      )}
      <p className="conv-today">امروز شمسی: {j.jy ? faNum(j.jy) + "/" + faNum(pad2(j.jm)) + "/" + faNum(pad2(j.jd)) : "…"}</p>
    </div>
  );
}
