---
name: premium-iconography
description: Custom icon design and icon-set systems — one coherent SVG family with grid, stroke, and naming rules.
---
# Iconography
## سیستم قبل از آیکون تکی
Grid ‏۲۴×۲۴، ناحیه امن ۲px، stroke یکدست (۲px، سر گرد/صاف ثابت)، radius گوشه ثابت، وزن بصری برابر. خانواده را کامل تعریف کن بعد آیکون بساز.
## Production
- پیش‌فرض: اول از Lucide استفاده کن (همان خانواده Master)؛ آیکون اختصاصی فقط وقتی مفهوم محصول در Lucide نیست — و دقیقاً با همان grid/stroke بساز تا مخلوط نشود.
- ساخت دستی SVG: مسیر ساده، `stroke="currentColor"`، بدون fill اضافی؛ نام‌گذاری `icon-<name>.svg` و ثبت در کاتالوگ آیکون پروژه.
- با AI تصویر آیکون نهایی نساز (لبه‌ها و یکدستی stroke خراب می‌شود) — AI فقط برای ایده/مودبرد.
## QA
- [ ] در ۱۶px و ۲۴px خوانا  - [ ] کنار آیکون‌های کناری هم‌وزن دیده می‌شود  - [ ] currentColor و dark-mode درست  - [ ] aria-hidden یا label درست در مصرف
