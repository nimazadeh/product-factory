---
name: premium-asset-creation
description: Real visual asset creation with AI image generation (not placeholders) — product shots, hero imagery, illustrations, social photos — with art direction and file governance.
---
# Asset Creation (AI Visual Assets)
## Process
1. **Art Direction یک‌خطی** از هویت برند (01): نور، پالت، بافت، زاویه — در همه اسِت‌های یک پروژه ثابت.
2. ساخت با `generate_image`؛ برای انتخاب نهایی کاربر `offer_options=true`. پرامپت: سوژه+محیط+نور+پالت برند+«بدون متن/واترمارک/لوگو» مگر خلافش لازم باشد.
3. **پردازش**: کراپ به نسبت‌های استاندارد (04)، فشرده‌سازی WebP/AVIF، نسخه موبایل جدا، alt text واقعی برای هر اسِت وب.
4. **حاکمیت فایل**: نام `assets/<type>/<subject>-<size>.<ext>`، ثبت منبع (AI/manual/stock) و لایسنس در `assets/ASSETS.md`؛ اسِت بدون ثبت استفاده نمی‌شود.
## Rules
- چهره/برند رقیب/لوگوی دیگران در خروجی AI ممنوع؛ متن داخل تصویر ساخته‌شده با AI اعتماد نمی‌شود (روی آن تایپ واقعی بگذار)
- تصویر هیرو باید در موبایل هم سوژه اصلی را در کراپ مرکزی نگه دارد؛ برای هر تصویر کلیدی نسخه 16:9 و 4:5.
## QA
- [ ] پالت با برند می‌خواند  - [ ] کراپ موبایل سالم  - [ ] alt + ثبت در ASSETS.md  - [ ] وزن بهینه وب
