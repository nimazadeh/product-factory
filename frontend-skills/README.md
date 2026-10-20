# 🎨 Frontend Skills — Production-Ready / Enterprise / Mobile-First

> **جواب کوتاه برای وقتی گیجی:** لازم نیست ۲۰ تا اسکیل حفظ کنی.
> فقط این جمله را به ایجنت بگو (یا کپی کن از `templates/PROMPT-fa.md`) و تمام:
>
> **«طبق `frontend-skills/00-MASTER-production-frontend/SKILL.md` بساز.»**
>
> آن Master Skill خودش می‌داند کی UI UX Pro Max را باز کند، کی Vercel، کی Taste و…

به‌روزرسانی: ۱۸ اکتبر ۲۰۲۶ — منابع از اینترنت بررسی و دانلود شده‌اند (لینک و اعتبار هرکدام در جدول پایین).

---

## 🏆 رتبه‌بندی نهایی

| 23 | Benchmark Trio (Airbnb/Linear/Stripe) | تحلیل زنده ۲۰۲۶-۱۰-۲۰ | تقویم و انتخاب تاریخ (Airbnb)، سرعت و میکرواینترکشن (Linear)، لندینگ و اعتماد عددی (Stripe) — الگو نه کپی | هر فیچر تقویم/لندینگ/حرکت | `skills/23-benchmark-trio-airbnb-linear-stripe.md` |
 — بهترین اسکیل‌های فرانت‌اند (تحقیق اکتبر ۲۰۲۶)

| # | Skill | سازنده | چرا بهترین است | کی استفاده می‌شود | پوشه محلی |
|---|---|---|---|---|---|
| 1 | **UI UX Pro Max** | nextlevelbuilder (~۱۳۴K★, MIT) | بزرگ‌ترین دیتابیس طراحی قابل جستجو: ۷۹ style، ‏۱۹۲ palette صنعتی، ۷۴ font pairing، ‏۱۱۹ قانون UX، ۲۵ chart، ۲۲ stack — به‌جای حدس مدل، Design System می‌سازد | **شروع هر پروژه**: انتخاب رنگ/فونت/استایل متناسب با صنعت محصول | `skills/01-ui-ux-pro-max/` |
| 2 | **frontend-design** | Anthropic (رسمی، ~۲۷۷K نصب) | ضد «AI slop»: قبل از کد، جهت هنری مشخص می‌خواهد؛ بنفش گرادیانی + Inter + کارت جنریک را ممنوع می‌کند | جهت هنری و هویت بصری هر صفحه جدید | `skills/02-anthropic-frontend-design/` |
| 3 | **Web Design Guidelines** | Vercel Labs | ۱۰۰+ قانون آدیت: accessibility, forms, UX correctness — مثل یک QA gate | بازبینی نهایی قبل از تحویل | `skills/03-vercel-web-design-guidelines/` |
| 4 | **React Best Practices** | Vercel Labs | ۵۷ قانون پرفورمنس React/Next.js در ۸ دسته (waterfall, bundle, re-render…) | بهینه‌سازی و code review ری‌اکت | `skills/04-vercel-react-best-practices/` |
| 5 | **Composition Patterns** | Vercel Labs | معماری درست کامپوننت ری‌اکت (composition, context, state) | طراحی کامپوننت‌های قابل نگهداری | `skills/05-vercel-composition-patterns/` |
| 6 | **frontend-ui-engineering** | Addy Osmani (Google) | مهندسی UI در سطح پروداکشن: همه stateها (loading/empty/error/permission)، ریسپانسیو، verification gate | اسکلت مهندسی هر فیچر سازمانی | `skills/06-addyosmani-frontend-ui-engineering/` |
| 7 | **Taste (design-taste-frontend)** | Leonxlnx (~۸۳–۹۷K★, MIT) | کنترل پارامتریک سلیقه (variance/motion/density) + قوانین متریک‌محور ضد جنریک | وقتی کنترل ریز روی «حس» طراحی می‌خواهی | `skills/07-taste-design-taste-frontend/` |
| 8 | **Impeccable** | Paul Bakaus (سازنده jQuery UI, ~۶۵K★) | anti-pattern detection و polish: دو حالت brand (مارکتینگ) و product (اپ/داشبورد) | آدیت و پولیش UI موجود | `skills/08-impeccable/` |
| 9 | **React Native Skills** | Vercel Labs | پرفورمنس موبایل native: لیست ۶۰fps، gesture، platform conventions | فقط اگر اپ native موبایل داری | `skills/09-vercel-react-native-mobile/` |
| 10 | **webapp-testing** | Anthropic (رسمی) | تست بصری با Playwright: اسکرین‌شات و iterate | حلقه verify کردن خروجی | `skills/10-anthropic-webapp-testing/` |
| + | design-system / ui-styling | UI UX Pro Max suite | ساخت tokens و استایل‌دهی سیستماتیک | ساخت/گسترش Design System | `skills/11-…`, `skills/12-…` |

**ترکیب برنده برای وب‌اپ سازمانی (همان چیزی که در Master پیاده شده):**
`UI UX Pro Max (سیستم) + Anthropic frontend-design (سلیقه) + Addy Osmani (مهندسی) + Vercel Guidelines & React BP (کیفیت/پرفورمنس) + Playwright (تأیید بصری)`

## 📁 ساختار این پوشه

```
frontend-skills/
├── README.md                        ← همین فایل (راهنمای فارسی)
├── 00-MASTER-production-frontend/
│   └── SKILL.md                     ← ⭐ قانون اساسی — ترکیب همه اسکیل‌ها، Mobile-First + Enterprise
├── skills/                          ← اسکیل‌های اصلی، تمیز و آماده استفاده (01 تا 12)
├── templates/
│   ├── PROMPT-fa.md                 ← پرامپت آماده فارسی برای گفتن به هر ایجنت
│   ├── PROMPT-en.md                 ← نسخه انگلیسی
│   └── DESIGN.md.template           ← قالب Design System هر پروژه
├── premium-ui-ux-pro-max/           ← ⭐ نسخه Premium اختصاصی ما (برند، لوگو، CIP، بنر، اسلاید، آیکون، اسِت، توکن سازمانی)
└── upstream/                        ← سورس کامل ریپوهای دانلودشده (برای مرجع/آپدیت)
    ├── ui-ux-pro-max-skill/  anthropics-skills/  vercel-agent-skills/
    ├── addyosmani-agent-skills/  taste-skill/  impeccable/
```

## 🚀 چطور از این به بعد با من (ایجنت) کار کنی؟

فقط اول هر درخواست ساخت وب‌اپ این را بگو — یا حتی نگو، چون در همین Workspace ذخیره شده و به آن ارجاع می‌دهم:

> «وب‌اپ [توضیح محصول] را بساز. Mobile-first و production-ready در حد سازمانی.
> طبق `frontend-skills/00-MASTER-production-frontend/SKILL.md` و UI UX Pro Max پیش برو:
> اول Design Contract و DESIGN.md، بعد پیاده‌سازی، آخر هم Verification Gate.»

پرامپت کامل‌تر و آماده کپی: **`templates/PROMPT-fa.md`**

## ⚙️ نصب روی ابزارهای دیگر (اگر خواستی روی Claude Code / Cursor هم داشته باشی)

```bash
# UI UX Pro Max
npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
# یا: npm i -g ui-ux-pro-max-cli && uipro init --ai claude   (--ai cursor / codex / gemini …)

# Anthropic frontend-design (رسمی)
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-plugins-official

# Vercel skills
npx skills add vercel-labs/agent-skills
```

## 🔗 منابع

- UI UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill — وب‌سایت: https://uupm.cc
- Anthropic Skills: https://github.com/anthropics/skills (`skills/frontend-design`)
- Vercel Agent Skills: https://github.com/vercel-labs/agent-skills
- Addy Osmani Agent Skills: https://github.com/addyosmani/agent-skills (`skills/frontend-ui-engineering`)
- Taste Skill: https://github.com/Leonxlnx/taste-skill
- Impeccable: https://github.com/pbakaus/impeccable
- مقالات مقایسه/رتبه‌بندی: Snyk «Top 8 Claude Skills for UI/UX Engineers»، Composio «10 best design skills»، ui-skills.com

> ⚠️ نکته: ستاره/عددها snapshot زمان تحقیق‌اند و سریع تغییر می‌کنند؛ معیار انتخاب فقط ستاره نبوده — لایسنس روشن (MIT/Apache)، نگهداری فعال، و پوشش مکمل هم بررسی شده.
