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

test("فوکوس اینپوت حین تایپ نمی‌پرد (رگرسیون remount)", async ({ page }) => {
  // جلالی inputs are used by converter / age / date-difference
  for (const path of ["/tools/date-converter", "/tools/age-calculator", "/tools/date-difference"]) {
    await page.goto(path);
    const year = page.locator(".jinputs input").first();
    await year.click();
    await year.fill("");
    await page.keyboard.type("1405");
    await expect(year).toHaveValue("1405");
    await expect(year).toBeFocused();
    const month = page.locator(".jinputs input").nth(1);
    await month.click();
    await month.fill("");
    await page.keyboard.type("12");
    await expect(month).toHaveValue("12");
    await expect(month).toBeFocused();
  }
  // landing hero quick converter
  await page.goto("/");
  const heroYear = page.locator(".converter input").first();
  await heroYear.click();
  await heroYear.fill("");
  await page.keyboard.type("1404");
  await expect(heroYear).toHaveValue("1404");
  await expect(heroYear).toBeFocused();
});
