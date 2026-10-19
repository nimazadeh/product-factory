import { describe, it, expect } from "vitest";
import { ageFrom, diffDays, gregorianToJalali, isValidJalali, jalaliToGregorian, nextNowruz } from "./date";

describe("تبدیل تاریخ", () => {
  it("۲۷ مهر ۱۴۰۵ = ۱۹ اکتبر ۲۰۲۶", () => {
    expect(jalaliToGregorian({ jy: 1405, jm: 7, jd: 27 })).toEqual({ gy: 2026, gm: 10, gd: 19 });
    expect(gregorianToJalali({ gy: 2026, gm: 10, gd: 19 })).toEqual({ jy: 1405, jm: 7, jd: 27 });
  });
  it("نوروز ۱۴۰۵ = ۲۱ مارس ۲۰۲۶", () => {
    expect(jalaliToGregorian({ jy: 1405, jm: 1, jd: 1 })).toEqual({ gy: 2026, gm: 3, gd: 21 });
  });
  it("اعتبارسنجی: ۳۱ شهریور نامعتبر، ۲۹ اسفند کبیسه", () => {
    expect(isValidJalali({ jy: 1405, jm: 6, jd: 31 })).toBe(true);
    expect(isValidJalali({ jy: 1403, jm: 12, jd: 30 })).toBe(true); // ۱۴۰۳ کبیسه
    expect(isValidJalali({ jy: 1405, jm: 12, jd: 30 })).toBe(false);
  });
});

describe("محاسبه سن", () => {
  it("سن دقیق با قرض ماه", () => {
    expect(ageFrom({ jy: 1370, jm: 8, jd: 15 }, { jy: 1405, jm: 7, jd: 27 })).toEqual({ years: 34, months: 11, days: 12 });
  });
  it("روز تولد دقیق و تولد آینده", () => {
    expect(ageFrom({ jy: 1400, jm: 7, jd: 27 }, { jy: 1405, jm: 7, jd: 27 })).toEqual({ years: 5, months: 0, days: 0 });
    expect(ageFrom({ jy: 1410, jm: 1, jd: 1 }, { jy: 1405, jm: 7, jd: 27 })).toBeNull();
  });
});

describe("فاصله و نوروز", () => {
  it("فاصله رفت و برگشت یکی است و منفی نمی‌شود", () => {
    const a = { jy: 1405, jm: 1, jd: 1 }, b = { jy: 1405, jm: 7, jd: 27 };
    expect(diffDays(a, b)).toBe(212);
    expect(diffDays(b, a)).toBe(212);
  });
  it("نوروز بعدی از مهر ۱۴۰۵، نوروز ۱۴۰۶ است", () => {
    const n = nextNowruz(new Date(2026, 9, 19));
    expect(n.jalaliYear).toBe(1406);
    expect(n.daysLeft).toBeGreaterThan(100);
  });
});
