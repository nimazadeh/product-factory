import { toJalaali, toGregorian, jalaaliMonthLength } from "jalaali-js";

/** Storage stays ISO Gregorian (YYYY-MM-DD); users only see/pick Jalali.
    Display already uses Intl fa-IR (Persian calendar) — this module powers the picker. */
export const MONTHS_FA = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
export const WEEKDAYS_FA = ["ش","ی","د","س","چ","پ","ج"]; // Saturday-first

export interface Jalali { jy: number; jm: number; jd: number }

export function isoToJalali(iso: string): Jalali {
  const [gy, gm, gd] = iso.split("-").map(Number);
  return toJalaali(gy, gm, gd);
}
export function jalaliToIso(j: Jalali): string {
  const g = toGregorian(j.jy, j.jm, j.jd);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${g.gy}-${pad(g.gm)}-${pad(g.gd)}`;
}
export const monthLength = (jy: number, jm: number) => jalaaliMonthLength(jy, jm);
/** Weekday column (0=Saturday) of the 1st of a Jalali month, via Gregorian weekday. */
export function firstWeekdayColumn(jy: number, jm: number): number {
  const iso = jalaliToIso({ jy, jm, jd: 1 });
  const dow = new Date(iso + "T12:00:00").getDay(); // 0=Sunday..6=Saturday
  return (dow + 1) % 7; // -> 0=Saturday..6=Friday
}
export function formatJalaliFa(iso: string): string {
  const j = isoToJalali(iso);
  return `${j.jd} ${MONTHS_FA[j.jm - 1]} ${j.jy}`;
}
export const todayIso = () => new Date().toISOString().slice(0, 10);
