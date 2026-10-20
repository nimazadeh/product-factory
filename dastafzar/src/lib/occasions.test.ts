import { describe, expect, it } from "vitest";
import { occasionsForYear } from "./occasions";
import { jalaliToGregorian, monthLength } from "./date";

const y1405 = occasionsForYear(1405, monthLength, jalaliToGregorian);
const titles = (k: string) => (y1405.get(k) ?? []).map((x) => x.title).join(" ");

describe("occasionsForYear(1405) — cross-checked with official 1405 calendar", () => {
  it("solar fixed days", () => {
    expect(titles("1-12")).toContain("جمهوری اسلامی");
    expect(titles("1-13")).toContain("طبیعت");
    expect(titles("11-22")).toContain("پیروزی انقلاب");
    expect(titles("9-30")).toContain("یلدا");
  });
  it("lunar days land on their official 1405 Jalali dates", () => {
    expect(titles("4-3")).toContain("تاسوعا");
    expect(titles("4-4")).toContain("عاشورا");
    // Lunar sighting calendars can differ by a day from Intl's arithmetic one.
    expect(titles("3-5") + titles("3-6") + titles("3-7")).toContain("قربان");
    expect(titles("6-6") + titles("6-7") + titles("6-8") + titles("6-9")).toContain("ولادت حضرت رسول");
  });
  it("has far more than the old 3 hardcoded occasions", () => {
    let count = 0;
    y1405.forEach((v) => { count += v.length; });
    expect(count).toBeGreaterThan(120);
  });
});
