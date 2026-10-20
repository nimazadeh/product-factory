"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import JalaliInputs from "@/components/JalaliInputs";
import DateChips from "@/components/DateChips";
import { WEEKDAY_FA, faNum, gregorianToJalali, isValidJalali, jalaliToGregorian, pad2, type JDate } from "@/lib/date";
import { track } from "@/lib/track";
import { jalaliDateSchema } from "@/lib/schemas";

export default function ConverterTool() {
  const [j, setJ] = useState<JDate>({ jy: 0, jm: 0, jd: 0 });
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const t = new Date();
    setJ(gregorianToJalali({ gy: t.getFullYear(), gm: t.getMonth() + 1, gd: t.getDate() }));
    track("date-converter", "view");
  }, []);

  const out = useMemo(() => {
    if (!j.jy || !j.jm || !j.jd) return null;
    if (!jalaliDateSchema.safeParse(j).success || !isValidJalali(j)) return { ok: false, text: "این تاریخ شمسی معتبر نیست — روز و ماه را بررسی کنید." };
    const g = jalaliToGregorian(j);
    return { ok: true, text: `${WEEKDAY_FA(g)}، ${g.gy}/${pad2(g.gm)}/${pad2(g.gd)} میلادی`, raw: `${g.gy}/${pad2(g.gm)}/${pad2(g.gd)}` };
  }, [j]);

  return (
    <div className="tool-box">
      <JalaliInputs legend="تاریخ شمسی" value={j} onChange={setJ} />
      <DateChips onPick={setJ} />
      <div className={`result-big res-card ${out && !out.ok ? "err" : ""}`} role="status">
        {out?.ok ? (<>
          <span className="res-label">معادل میلادی</span>
          <span className="res-main" dir="ltr">{out.raw}</span>
          <span className="res-sub">{out.text.split("،")[0]}</span>
        </>) : (out ? out.text : "تاریخ را وارد کنید")}
      </div>
      {out?.ok && (
        <div style={{ textAlign: "center" }}>
          <button type="button" className="copy-btn" onClick={async () => {
            track("date-converter", "copy");
            try { await navigator.clipboard.writeText(out.raw ?? out.text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ }
          }}>{copied ? <><Check size={16} aria-hidden /> کپی شد</> : <><Copy size={16} aria-hidden /> کپی نتیجه</>}</button>
        </div>
      )}
      <p className="conv-today">امروز شمسی: {j.jy ? faNum(j.jy) + "/" + faNum(pad2(j.jm)) + "/" + faNum(pad2(j.jd)) : "…"}</p>
    </div>
  );
}
