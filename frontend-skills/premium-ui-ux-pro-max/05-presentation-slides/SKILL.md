---
name: premium-presentation-slides
description: Branded presentation and pitch-deck creation (python-pptx / HTML slides) driven by the project design tokens.
---
# Presentation Slides
## ساختار Pitch استاندارد
جلد → مسئله → راه‌حل → محصول (دمو) → بازار → مدل درآمد → تیم → درخواست/CTA — هر اسلاید یک پیام؛ تیتر = جمله نتیجه، نه عنوان خشک.
## Production
- ساخت با `python-pptx` (۱۶:۹، 13.33×7.5in) یا HTML slides؛ مستر: فونت/رنگ فقط از توکن برند، شماره اسلاید، فوتر محرمانگی در صورت نیاز
- نمودارها از داده واقعی پروژه (نه تصویر AI از نمودار)؛ حداکثر ۱ نمودار در هر اسلاید؛ متن بدنه ≥ ۱۸pt
- خروجی: `.pptx` قابل ویرایش + PDF؛ نسخه فارسی RTL و انگلیسی جدا (جهت اسلاید و اعداد)
## QA
- [ ] هر اسلاید در ۳ ثانیه پیامش را می‌رساند  - [ ] هیچ اسلایدی دیوار متن نیست  - [ ] در پروژکتور (کنتراست کم) خواناست
