"use client";
import type { JDate } from "@/lib/date";

const toLatin = (s: string) => s.replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c))).replace(/[^\d]/g, "");

/** One numeric field. Defined at module level — NOT inside JalaliInputs —
    so React keeps the same component identity across renders and the
    input never remounts (remounting was dropping focus after every digit). */
function Field({ label, v, set, max, hint, maxVal }: {
  label: string; v: number | ""; set: (n: number) => void; max: number; hint: string; maxVal?: number;
}) {
  const invalid = typeof v === "number" && v > 0 && maxVal !== undefined && v > maxVal;
  return (
    <label className="conv-field"><span>{label}</span>
      <input inputMode="numeric" dir="ltr" maxLength={max} value={v === 0 ? "" : v} placeholder={hint}
        aria-invalid={invalid || undefined}
        onChange={(e) => set(+toLatin(e.target.value) || 0)} />
    </label>
  );
}

/** Three-field Jalali date input (year/month/day), Persian-digit friendly. */
export default function JalaliInputs({ value, onChange, legend }: {
  value: JDate; onChange(j: JDate): void; legend: string;
}) {
  return (
    <fieldset className="jinputs"><legend>{legend}</legend>
      <div className="conv-fields">
        <Field label="سال" v={value.jy || ""} max={4} hint="۱۴۰۵" set={(jy) => onChange({ ...value, jy })} />
        <Field label="ماه" v={value.jm || ""} max={2} hint="۷" maxVal={12} set={(jm) => onChange({ ...value, jm })} />
        <Field label="روز" v={value.jd || ""} max={2} hint="۲۸" maxVal={31} set={(jd) => onChange({ ...value, jd })} />
      </div>
    </fieldset>
  );
}
