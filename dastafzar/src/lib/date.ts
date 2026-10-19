import { toGregorian, toJalaali, isLeapJalaaliYear, jalaaliMonthLength } from "jalaali-js";

export interface JDate { jy: number; jm: number; jd: number }
export interface GDate { gy: number; gm: number; gd: number }

export const faNum = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
export const pad2 = (n: number) => String(n).padStart(2, "0");
export const faDate = (j: JDate) => `${faNum(j.jy)}/${faNum(pad2(j.jm))}/${faNum(pad2(j.jd))}`;

export function isValidJalali(j: JDate): boolean {
  if (!j || j.jy < 1 || j.jm < 1 || j.jm > 12 || j.jd < 1) return false;
  return j.jd <= jalaaliMonthLength(j.jy, j.jm);
}
export function jalaliToGregorian(j: JDate): GDate { return toGregorian(j.jy, j.jm, j.jd); }
export function gregorianToJalali(g: GDate): JDate { return toJalaali(g.gy, g.gm, g.gd); }
export const isLeapJalali = (jy: number) => isLeapJalaaliYear(jy);

/** Milliseconds for a Gregorian date at UTC midnight — diff-safe. */
function utcMs(g: GDate) { return Date.UTC(g.gy, g.gm - 1, g.gd); }
export function jalaliToUtcMs(j: JDate) { return utcMs(jalaliToGregorian(j)); }

export function diffDays(a: JDate, b: JDate) {
  return Math.round(Math.abs(jalaliToUtcMs(a) - jalaliToUtcMs(b)) / 86_400_000);
}

/** Exact age (years/months/days) from Jalali birth date to Jalali "today". */
export function ageFrom(birth: JDate, today: JDate): { years: number; months: number; days: number } | null {
  if (!isValidJalali(birth) || !isValidJalali(today)) return null;
  if (jalaliToUtcMs(birth) > jalaliToUtcMs(today)) return null;
  let years = today.jy - birth.jy, months = today.jm - birth.jm, days = today.jd - birth.jd;
  if (days < 0) {
    months -= 1;
    const prevMonth = today.jm === 1 ? 12 : today.jm - 1;
    const prevYear = today.jm === 1 ? today.jy - 1 : today.jy;
    days += jalaaliMonthLength(prevYear, prevMonth);
  }
  if (months < 0) { years -= 1; months += 12; }
  return { years, months, days };
}

/** Next Nowruz (1 فروردین) as Gregorian Date, today included if it IS Nowruz. */
export function nextNowruz(from = new Date()): { jalaliYear: number; date: Date; daysLeft: number } {
  const todayMs = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const jNow = gregorianToJalali({ gy: from.getFullYear(), gm: from.getMonth() + 1, gd: from.getDate() });
  let year = jNow.jy;
  let g = jalaliToGregorian({ jy: year, jm: 1, jd: 1 });
  if (utcMs(g) < todayMs) { year += 1; g = jalaliToGregorian({ jy: year, jm: 1, jd: 1 }); }
  return { jalaliYear: year, date: new Date(g.gy, g.gm - 1, g.gd), daysLeft: Math.round((utcMs(g) - todayMs) / 86_400_000) };
}

export const WEEKDAY_FA = (g: GDate) =>
  new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(new Date(g.gy, g.gm - 1, g.gd));

/** Column (0=شنبه … 6=جمعه) of the 1st day of a Jalali month — for calendar grids. */
export function firstColumnOfMonth(jy: number, jm: number): number {
  const g = jalaliToGregorian({ jy, jm, jd: 1 });
  const jsDay = new Date(g.gy, g.gm - 1, g.gd).getDay(); // 0=Sun … 6=Sat
  return (jsDay + 1) % 7;
}
export const monthLength = (jy: number, jm: number) => jalaaliMonthLength(jy, jm);
export const MONTHS_FA = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
export const WEEKDAYS_FA = ["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه"];
