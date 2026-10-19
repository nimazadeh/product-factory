# 🏭 Product Factory — Monorepo

یک ریپو برای همه محصولات، اسکیل‌ها و قوانین کاری. **هر محصول = یک پوشه در ریشه.**
هر ایجنت/هم‌تیمی که وارد می‌شود اول [`AGENTS.md`](AGENTS.md) را می‌خواند — قانون اساسی اینجاست.

## ساختار

```
AGENTS.md            ← قانون اساسی (اول این را بخوان)
PRODUCTS.md          ← رجیستری محصولات و نسخه‌ها
README.md            ← همین فایل

frontend-skills/     ← اسکیل‌های فرانت‌اند (00 Master + 01–21)
backend-skills/      ← اسکیل‌های بک‌اند و امنیت (Master + 01–11)
docs/                ← تصمیم‌های معماری (ADRها) و راهنمای ریپو

finance-dashboard/   ← محصول ۱: «جیبتو» (داشبورد مالی فارسی)
<product-2>/         ← محصول بعدی همین‌جا ساخته می‌شود
<product-3>/

_system/             ← اسکریپت آرشیو/بازیابی محصول (ZIP واحد هر محصول)
```

## چرخه ساخت محصول جدید

1. پوشه تازه در ریشه بساز: `<product-name>/`
2. طبق `AGENTS.md`: گیت انتخاب جهت UI → توسعه با اسکیل‌ها → ممیزی skill 13 (شامل ممیزی هندسی)
3. در `PRODUCTS.md` ثبتش کن (نام، نسخه، وضعیت)
4. نسخه‌بندی: `_system/archive-product.sh <product-name> <version>` — زیپ نهایی برای دانلود/Release

## قراردادها (خلاصه — متن کامل در AGENTS.md)

- قانون ZIP واحد: از هر محصول فقط `_archive/<product>-latest.zip` می‌ماند (در گیت نیست؛ GitHub Release)
- محصولات فارسی: تقویم جلالی برای کاربر، ذخیره‌سازی ISO
- نمودار تعاملی = کتابخانه بالغ (Chart.js)، نه دست‌ساز
- حذف داده = Confirm Dialog + Toast؛ پاپ‌آورهای فرم از بالا باز می‌شوند
- هر «تمام شد» = گزارش ممیزی + تست هندسی سبز

## شروع سریع محصول فعلی (جیبتو)

```bash
cd finance-dashboard
npm install --legacy-peer-deps
npm run dev -- --host 0.0.0.0 --port 5173
npm run build
npx playwright test --project=chromium
```
