---
name: ui-ux-pro-max-premium
description: >
  Premium extension (built in-house, original content — NOT the paid proprietary product):
  brand identity, logo design, corporate identity programs (CIP), banners, presentation
  slides, custom iconography, AI asset creation, and enterprise design-token architecture.
  Use together with ../00-MASTER-production-frontend/SKILL.md for any branding, logo, CIP,
  banner, slide, icon-set, or multi-team token task.
version: 1.0.0
---

# UI UX Pro Max — Premium Extension (نسخه اختصاصی ما)

> این اسکیل جایگزین اوریجینال ماست برای قابلیت‌هایی که نسخه پولی UI UX Pro Max تبلیغ می‌کند.
> محتوای اختصاصی/copyright‌شده آن‌ها کپی نشده؛ ورک‌فلوها از اصول عمومی برندینگ + اسکیل‌های آزاد
> داخل همین Workspace (`../skills/11`, `../upstream/.../skills/{brand,design,banner-design,slides}`) ساخته شده‌اند.

## Routing — کی کدام زیراسکیل؟

| تسک | زیراسکیل |
|---|---|
| هویت برند، صدا، پیام، Brand Guidelines | `01-brand-identity/SKILL.md` |
| لوگو (بریف → کانسپت → ساخت با generate_image/SVG → نسخه‌های نهایی) | `02-logo-design/SKILL.md` |
| CIP کامل سازمانی (۵۰ خروجی: کارت ویزیت تا بیلبورد) | `03-corporate-identity-cip/SKILL.md` |
| بنر سوشال/تبلیغات/وب/چاپ (سایزهای استاندارد هر پلتفرم) | `04-banner-design/SKILL.md` |
| اسلاید و Pitch Deck برندشده | `05-presentation-slides/SKILL.md` |
| آیکون اختصاصی و Icon Set (SVG، یک خانواده) | `06-iconography/SKILL.md` |
| ساخت اسِت واقعی با AI (نه placeholder) + مدیریت فایل | `07-asset-creation/SKILL.md` |
| توکن سازمانی چندتیمی (Primitive→Semantic→Component، چند برند/تم) | `08-enterprise-token-architecture/SKILL.md` |

## قانون طلایی اتصال به محصول
هیچ اسِت برندی جدا از Design System ساخته نمی‌شود: خروجی هر زیراسکیل باید به `DESIGN.md` و توکن‌های پروژه وصل شود (رنگ/فونت از همان منبع حقیقت). اسِت بدون ثبت در Brand Guidelines تحویل داده نمی‌شود.

## خروجی استاندارد هر تسک Premium
1. **Brief یک‌صفحه‌ای** (هدف، مخاطب، محدودیت) — در فایل پروژه ذخیره شود
2. **حداقل ۲–۳ جهت/کانسپت** برای انتخاب (در تسک‌های تصویری با `offer_options`)
3. **فایل نهایی production** (SVG/PNG/PPTX/CSS/JSON — نه اسکرین‌شاتِ صرف)
4. **ثبت در Guidelines**: رنگ‌ها، clear-space، حداقل سایز، کاربرد درست/غلط
5. **چک‌لیست QA** انتهای همان زیراسکیل

## چیزهایی که این نسخه ندارد (صداقت)
- «Priority Support» انسانی ارائه نمی‌کند؛ به‌جای آن هر زیراسکیل چک‌لیست QA و escalation path (کی نظر انسان لازم است: تأیید نهایی لوگو، مسائل حقوقی trademark) دارد.
- قبل از استفاده تجاری نهایی لوگو: جستجوی trademark و بازبینی وکیل/طراح انسانی الزامی است — AI خروجی را نهایی حقوقی نمی‌کند.
