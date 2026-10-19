import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BREAKPOINTS = [320, 390, 768, 1024, 1440];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("فلو اصلی کاربر کار می‌کند", async ({ page }) => {
  // TODO: فلوهای محصول را اینجا بنویس: getByRole/getByLabel — نه سلکتور CSS
  await expect(page.getByRole("main")).toBeVisible();
});

for (const w of BREAKPOINTS) {
  test(`ریسپانسیو در ${w}px: بدون اسکرول افقی و دکمه ریز`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll("button")].filter(
        (b) => (b as HTMLElement).offsetParent && (b.clientHeight < 44 || b.clientWidth < 44)).length);
    expect(small).toBe(0);
    await page.screenshot({ path: `e2e/screenshots/audit-${w}.png` });
  });
}

test("دسترسی‌پذیری: axe بدون نقض جدی", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  const serious = results.violations.filter((v) => ["critical", "serious"].includes(v.impact ?? ""));
  expect(serious).toEqual([]);
});

test("بدون خطای کنسول", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
});
