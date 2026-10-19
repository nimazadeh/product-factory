---
name: browser-audit-e2e
description: >
  Full browser audit for any web app: Playwright E2E functional tests across Chromium/Firefox/WebKit,
  responsive verification at 320/390/768/1024/1440, axe-core WCAG accessibility audit, Lighthouse
  performance audit, console-error capture, and visual-regression screenshots with a written report.
  ALWAYS run before declaring a UI task "done" (see Master Verification Gate), before archiving a
  product, and after restoring an archived product. Triggers: "ممیزی", "تست مرورگری", "audit", "e2e".
---

# Browser Audit — ممیزی کامل مرورگری

> قانون: «تمام شد» بدون گزارش این ممیزی قبول نیست. تست‌ها داخل خود محصول می‌مانند (پوشه `e2e/`) تا قابل تکرار باشند — ممیزی یک‌بارمصرف نیست.

## ۷ لایه ممیزی (به ترتیب اجرا)

| # | لایه | ابزار | معیار پاس |
|---|---|---|---|
| 1 | E2E فانکشنال | Playwright | همه فلوهای اصلی کاربر (ثبت/حذف/جستجو/فرم/ناوبری) سبز |
| 2 | چندمرورگری | Chromium + Firefox + WebKit | همان E2E در هر ۳ موتور |
| 3 | ریسپانسیو | viewportهای 320/390/768/1024/1440 | بدون scroll افقی؛ تاچ ≥44px؛ بدون به‌هم‌ریختگی |
| 4 | Accessibility | @axe-core/playwright + Tab دستی | ۰ نقض critical/serious؛ فوکوس visible؛ کیبورد کامل |
| 5 | پرفورمنس | Lighthouse (mobile) | Perf ≥ 90، A11y ≥ 95، BP ≥ 90؛ LCP < 2.5s، CLS < 0.1 |
| 6 | رگرسیون بصری | screenshot baseline + diff | تغییر بصری تأییدنشده = fail |
| 7 | سلامت کنسول | console/pageerror listener | ۰ خطای کنسول و pageerror |

## نصب (یک‌بار برای هر محصول)
```bash
npm i -D @playwright/test @axe-core/playwright --legacy-peer-deps
npx playwright install chromium firefox webkit
# Lighthouse: npx lighthouse <url> --output=json --chrome-flags="--headless --no-sandbox"
```

## چطور تست بنویسیم
- از `templates/audit.spec.template.ts` شروع کن: برای هر فلو یک test با نام فارسی/انگلیسی خوانا.
- سلکتور فقط قابل‌دسترسی: `getByRole/getByLabel/getByText` — هرگز CSS class شکننده.
- هر تست مستقل؛ داده تست از seed خود محصول؛ localStorage بین تست‌ها پاک شود مگر تست persistence.
- اسکرین‌شات هر breakpoint در `e2e/screenshots/`؛ baselineها commit می‌شوند، خروجی runها نه.

## روند اجرا و گزارش
1. سرور dev را بالا بیاور (`npm run dev -- --host 0.0.0.0`) — در Arena: `allowedHosts` را فراموش نکن.
2. `npx playwright test` → بعد axe → بعد Lighthouse روی همان URL.
3. گزارش را با `templates/audit-report.template.md` در `<product>/AUDIT-REPORT.md` بنویس: جدول ۷ لایه (پاس/فیل + عدد)، اسکرین‌شات‌ها، لیست فیکس‌ها.
4. فیل = اول فیکس، بعد اجرای دوباره؛ گزارش نهایی فقط وقتی همه سبزند.

## CI (اجرای خودکار روی گیت‌هاب)
`templates/github-playwright-workflow.template.yml` را در محصول به `.github/workflows/audit.yml` کپی کن:
با هر push/PR همان ممیزی روی سرور گیت‌هاب اجرا می‌شود؛ قرمز = merge ممنوع. (توضیح ساده CI برای کاربر: ربات نگهبانی که با هر تغییر، کل تست‌ها را از نو می‌گیرد.)

## Anti-patterns
- ❌ فقط Chromium، ❌ فقط «صفحه لود شد»، ❌ اسکرین‌شات بدون assert، ❌ تست وابسته به ترتیب اجرا، ❌ نادیده گرفتن فیل با test.skip بدون دلیل مکتوب.

## نظم اسکرین‌شات‌ها (قانون ۲۰۲۶-۱۰-۱۹)
همه اسکرین‌شات‌های نمایشی در `<product>/screenshots/` با ساختار ثابت: `01-dashboard/ 02-features/ 03-breakpoints/ 04-brand/` + فایل `INDEX.md` که هر عکس را توضیح می‌دهد. اسم فایل: `<content>-<width>.png`. اسکرین‌شات تخت و بی‌دسته در ریشه محصول ممنوع. خروجی خودکار تست جدا در `e2e/screenshots/` می‌ماند.

## ممیزی هندسی (قانون ۲۰۲۶-۱۰-۱۹ — از بازخورد کاربر: «چرا من باید بگم؟»)
علت خطاهای ریز بصری که کاربر می‌گیرد: تست فانکشنال «کار می‌کند» را ثابت می‌کند، نه «درست نشسته» را؛ اسکرین‌شات کامل صفحه هم جزئیات چندپیکسلی را پنهان می‌کند. راه‌حل سیستمی، نه قول دقت بیشتر:
1. **تست هندسی با عدد** برای هر تغییر بصری: وسط‌چینی متن در باکس (اختلاف مرکز ≤۲px با Range.getBoundingClientRect)، نبود overflow افقی صفحه، هم‌ارتفاعی کنترل‌های هم‌ردیف، اندازه سقف کنترل‌های فشرده (مثلاً ≤۴۰px)، تک‌خط بودن برچسب‌های خلاصه.
2. **اسکرین‌شات کراپ‌شده از ناحیه تغییر** (نه فقط کل صفحه) و نگاه ذره‌بینی قبل از اعلام «درست شد».
3. ترتیب اعلام نتیجه: اول عدد تست هندسی، بعد عکس. «به نظرم درسته» گزارش محسوب نمی‌شود.
