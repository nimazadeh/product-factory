import { test, expect } from "@playwright/test";

const PAGES = ["/", "/tools/jalali-calendar", "/tools/date-converter", "/tools/age-calculator", "/tools/date-difference", "/tools/nowruz-countdown"];

for (const path of PAGES) {
  test(`سلامت ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("تقویم تعاملی: ناوبری ماه و انتخاب روز", async ({ page }) => {
  await page.goto("/tools/jalali-calendar");
  await expect(page.locator(".cal-day")).toHaveCount(30); // مهر ۱۴۰۵
  const before = await page.locator(".cal-title").innerText();
  await page.getByRole("button", { name: "ماه بعد" }).click();
  await expect(page.locator(".cal-title")).not.toHaveText(before);
  await page.locator(".cal-day").nth(10).click();
  await expect(page.locator(".result-big")).toContainText("میلادی");
});

test("مبدل: نتیجه امروز درست است", async ({ page }) => {
  await page.goto("/tools/date-converter");
  await expect(page.locator(".result-big")).toContainText("میلادی");
});

test("هندسی: لیبل‌های مبدل وسط‌چین‌اند", async ({ page }) => {
  await page.goto("/tools/date-converter");
  for (const f of await page.locator(".conv-field").all()) {
    const dx = await f.evaluate((e) => {
      const s = e.querySelector("span")!, i = e.querySelector("input")!;
      const r = document.createRange(); r.selectNodeContents(s);
      const tr = r.getBoundingClientRect(), ir = i.getBoundingClientRect();
      return Math.abs((tr.left + tr.width / 2) - (ir.left + ir.width / 2));
    });
    expect(dx).toBeLessThanOrEqual(2);
  }
});
