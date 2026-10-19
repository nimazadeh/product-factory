import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole("heading", { name: "داشبورد مالی" })).toBeVisible();
});

test("نمایش موجودی و سوییچ روز/هفته/ماه", async ({ page, isMobile }) => {
  await expect(page.getByText("موجودی کل")).toBeVisible();
  if (!isMobile) {
    await page.getByRole("button", { name: "هفته" }).click();
    await expect(page.getByText("۷ روز اخیر").first()).toBeVisible();
    await page.getByRole("button", { name: "روز" }).click();
    await page.getByRole("button", { name: "ماه" }).click();
  }
});

test("ثبت تراکنش، نمایش در لیست و اعتبارسنجی فرم", async ({ page, isMobile }) => {
  if (isMobile) await page.getByLabel("ثبت تراکنش جدید").click();
  else await page.locator(".side-add").click();
  await page.getByRole("button", { name: "ثبت تراکنش", exact: true }).last().click();
  await expect(page.getByText(/حداقل ۲ حرف/)).toBeVisible();
  await page.getByPlaceholder("مثلاً سوپرمارکت").fill("خرید تست ممیزی");
  await page.getByPlaceholder("250000").fill("123000");
  await page.getByRole("button", { name: "ثبت تراکنش", exact: true }).last().click();
  await expect(page.getByText("تراکنش ثبت شد")).toBeVisible();
  await expect(page.getByText("خرید تست ممیزی").first()).toBeVisible();
  // persistence
  await page.reload();
  await expect(page.getByText("خرید تست ممیزی").first()).toBeVisible();
});

test("جستجوی بدون نتیجه حالت خالی نشان می‌دهد", async ({ page, isMobile }) => {
  if (isMobile) await page.getByRole("button", { name: "تراکنش‌ها" }).click();
  else await page.getByRole("button", { name: "تراکنش‌ها" }).click();
  await page.getByPlaceholder("جستجو…").fill("عبارت ناموجود xyz");
  await expect(page.getByText("تراکنشی پیدا نشد")).toBeVisible();
});

test("قفل حریم خصوصی و باز کردن", async ({ page, isMobile }) => {
  if (isMobile) await page.getByLabel("قفل کردن").click();
  else await page.getByRole("button", { name: "قفل حریم خصوصی" }).click();
  await expect(page.getByText("جیبتو قفل است")).toBeVisible();
  await page.getByRole("button", { name: "باز کردن داشبورد" }).click();
  await expect(page.getByText("موجودی کل")).toBeVisible();
});

for (const w of [320, 390, 768, 1024, 1440]) {
  test(`ریسپانسیو ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto("/");
    await page.evaluate(() => localStorage.clear()); await page.reload();
    await expect(page.getByText("موجودی کل")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    const small = await page.evaluate(() => [...document.querySelectorAll("button")].filter((b) => (b as HTMLElement).offsetParent && ((b as HTMLElement).offsetHeight < 44 || (b as HTMLElement).offsetWidth < 44)).length);
    expect(small).toBe(0);
    await page.screenshot({ path: `e2e/screenshots/audit-${w}.png` });
  });
}

test("axe: بدون نقض critical/serious", async ({ page }) => {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  const bad = r.violations.filter((v) => ["critical", "serious"].includes(v.impact ?? ""));
  expect(bad, JSON.stringify(bad.map((v) => v.id))).toEqual([]);
});

test("بدون خطای کنسول", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/"); await page.waitForTimeout(1200);
  expect(errors).toEqual([]);
});

test("حذف فقط با تأیید در پاپ‌آپ انجام می‌شود و Toast بالا نمایش داده می‌شود", async ({ page }) => {
  const firstDelete = page.getByRole("button", { name: /حذف/ }).first();
  const title = await page.locator(".txlist li").first().locator("strong").innerText();
  await firstDelete.click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await expect(page.getByText("این تراکنش حذف شود؟")).toBeVisible();
  // انصراف نباید چیزی پاک کند
  await page.getByRole("button", { name: "انصراف" }).click();
  await expect(page.getByText(title).first()).toBeVisible();
  // حذف واقعی
  await firstDelete.click();
  await page.getByRole("button", { name: "بله، حذف شود" }).click();
  const toast = page.locator(".toast-item").first();
  await expect(toast).toBeVisible();
  const box = await toast.boundingBox();
  expect(box!.y).toBeLessThan(60); // بالای صفحه
  await expect(page.getByText(title)).toHaveCount(0);
});

test("صفحه‌بندی سازمانی تراکنش‌ها", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "تراکنش‌ها" }).first().click();
  const items = page.locator(".txlist li");
  await expect(page.locator(".pagination")).toBeVisible();
  await expect(items).toHaveCount(10);
  await expect(page.locator(".pg-num.active")).toHaveText("۱");
  await page.getByRole("button", { name: "صفحه بعد", exact: true }).click();
  await expect(page.locator(".pg-num.active")).toHaveText("۲");
  await expect(page.locator(".pg-info")).toContainText("۱۱");
});

test("ممیزی هندسی: وسط‌چینی و اندازه‌های صفحه‌بندی", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "تراکنش‌ها" }).first().click();
  // every page-number label must be centred inside its button (±2px)
  for (const btn of await page.locator(".pg-num").all()) {
    const box = await btn.boundingBox(); if (!box) continue;
    const centre = await btn.evaluate((el) => {
      const r = document.createRange(); r.selectNodeContents(el);
      const b = r.getBoundingClientRect(); const eb = el.getBoundingClientRect();
      return { dx: (b.left + b.width / 2) - (eb.left + eb.width / 2), dy: (b.top + b.height / 2) - (eb.top + eb.height / 2) };
    });
    expect(Math.abs(centre.dx)).toBeLessThanOrEqual(2);
    expect(Math.abs(centre.dy)).toBeLessThanOrEqual(2.5);
  }
  const sizeH = await page.locator(".pg-size .select-btn").evaluate((el) => el.getBoundingClientRect().height);
  expect(sizeH).toBeLessThanOrEqual(40); // compact, not a full form field
  // no element may overflow the viewport horizontally
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("ویرایش تراکنش و تقویم شمسی", async ({ page }) => {
  await page.getByRole("button", { name: /ویرایش/ }).first().click();
  await expect(page.getByRole("heading", { name: "ویرایش تراکنش" })).toBeVisible();
  // تقویم شمسی: ماه فارسی نمایش داده می‌شود، نه میلادی
  await page.getByRole("button", { name: "تاریخ تراکنش" }).click();
  await expect(page.getByText(/فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند/).first()).toBeVisible();
  await page.keyboard.press("Escape");
  const title = page.getByPlaceholder("مثلاً سوپرمارکت");
  await title.fill("عنوان ویرایش‌شده ممیزی");
  await page.getByRole("button", { name: "ذخیره ویرایش" }).click();
  await expect(page.getByText("تراکنش ویرایش شد")).toBeVisible();
  await expect(page.getByText("عنوان ویرایش‌شده ممیزی").first()).toBeVisible();
});
