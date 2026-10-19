---
name: production-frontend-master
description: >
  MASTER skill for building production-ready, enterprise-grade, mobile-first web applications.
  Combines UI UX Pro Max + Anthropic frontend-design + Vercel Web Design Guidelines +
  Vercel React Best Practices + Addy Osmani frontend-ui-engineering + Taste + Impeccable.
  Use ALWAYS when building, redesigning, reviewing or fixing any web app, page, dashboard,
  landing, component, or UI in this workspace — unless the user explicitly opts out.
---

# Production Frontend Master — Enterprise / Mobile-First / UI UX Pro Max

> این فایل، قانون اساسی فرانت‌اند این Workspace است. قبل از نوشتن هر خط UI، این فایل + اسکیل مرتبط در `../skills/` را بخوان.

## 0. ترتیب اجباری اجرا (Never skip)

1. **Design Contract قبل از کد** — یک پاراگراف بنویس: کارِ این صفحه چیست؟ کاربر اصلی؟ Primary Action؟ aesthetic direction؟ چه چیزهایی را Reject می‌کنیم (anti-patterns)؟
2. **Design System قبل از Component** — از UI UX Pro Max (`../skills/01-ui-ux-pro-max/`) برای product type، palette، font pairing و style جستجو/انتخاب کن و در `DESIGN.md` پروژه ذخیره کن: tokens (color/spacing/radius/shadow/typography)، نه مقادیر hardcoded پراکنده.
3. **Mobile-First** — اول 320–390px طراحی/کد بزن، بعد `sm/md/lg/xl`. هیچ layoutـی نباید در موبایل scroll افقی، متن ریز غیرقابل‌خواندن، یا دکمه کوچک‌تر از 44–48px داشته باشد.
4. **Build** با stack پروژه (پیش‌فرض پیشنهادی پایین).
5. **Polish Loop** — baseline/spacing/typography → accessibility → motion-performance.
6. **Verification Gate** — چک‌لیست انتهای این فایل. بدون پاس‌کردن آن، کار «تمام» نیست.

## 1. Stack پیش‌فرض (اگر پروژه stack مشخصی ندارد)

- **Framework:** Next.js (App Router) + React 19 / یا Vite + React برای SPA — TypeScript `strict`
- **Styling:** Tailwind CSS + CSS Variables (design tokens) — بدون custom CSS پراکنده مگر ضرورت
- **Components:** shadcn/ui (Radix primitives) — reuse از `components/ui`، نساختن دوباره Button/Dialog/Select از صفر
- **Icons:** Lucide (یک خانواده آیکون، نه ترکیب چندتا) — بدون emoji به‌عنوان آیکون
- **Forms:** React Hook Form + Zod — validation در client + server
- **Data:** TanStack Query (server state) + Zustand فقط برای client state واقعی — نه Redux برای همه‌چیز
- **Motion:** Motion/Framer Motion یا CSS transitions — فقط intentional، با `prefers-reduced-motion`
- **Testing/QA:** Playwright (screenshot در 320/768/1024/1440) + axe/Lighthouse

> اگر محصول native mobile است، به‌جای این بخش: `../skills/09-vercel-react-native-mobile/`

## 2. Anti-Slop — ممنوعیت‌های ظاهری (از frontend-design + Taste + Impeccable)

- ❌ بنفش/ایندیگو گرادیانی پیش‌فرض، Inter/Roboto/Arial به‌عنوان انتخاب تنبل، کارت‌های یک‌شکل `rounded-2xl` روی هم، hero جنریک «سه کارت + فوتر»
- ✅ قبل از کد، یک جهت زیبایی‌شناختی مشخص انتخاب کن (editorial / refined-minimal / brutalist / luxury / playful / enterprise-dense…) و به آن وفادار بمان
- ✅ تایپوگرافی expressive و سلسله‌مراتب واقعی (scale مشخص)، رنگ از palette محصول/صنعت، نه حدس مدل
- ✅ Brand test: اگر لوگو/ناو را برداری و صفحه بتواند مال هر شرکت دیگری باشد، برندینگ ضعیف است — درستش کن
- ✅ حداقل ۲–۳ motion معنادار (نه نویز)، texture/depth ظریف به‌جای پس‌زمینه تخت بی‌دلیل

## 3. Mobile-First & Responsive (غیرقابل مذاکره)

- Breakpointها: `320 / 390 / 768 / 1024 / 1440` — در همه تست کن
- Touch target ≥ 44px (ترجیحاً 48px)، فاصله کافی بین اهداف لمسی، thumb-zone برای اکشن اصلی موبایل
- Typography موبایل ≥ 16px برای body/input (جلوگیری از zoom آیفون)، line-height و contrast خوانا
- Navigation موبایل: الگوی روشن (bottom nav / drawer / sticky header) — منوی دسکتاپ را squeeze نکن
- Performance موبایل: budget برای 3G/4G، lazy-load زیر fold، `next/image`/optimized images، بدون layout shift (CLS)

## 4. Enterprise / Production-Ready (از frontend-ui-engineering + Vercel)

هر صفحه/کامپوننت باید این stateها را داشته باشد، وگرنه ناقص است:
`loading (skeleton) · empty · error (با retry) · success · permission/unauthorized · offline (در صورت نیاز)`

- **Accessibility — WCAG 2.2 AA:** semantic HTML، keyboard navigation کامل، focus visible، label برای همه inputها، contrast کافی، screen-reader announcement برای تغییرهای dynamic، احترام به `prefers-reduced-motion`
- **Component Architecture:** composition بر inheritance، یک کامپوننت در هر فایل، Props typed و exported، بدون inline component در render، memo/derived-state درست (قوانین `../skills/04` و `05`)
- **Performance:** code-splitting/dynamic import، parallel fetching، Suspense boundaries، جلوگیری از waterfall و re-render بیهوده، bundle budget
- **Security/Quality:** بدون `dangerouslySetInnerHTML` بدون sanitize، env secret در client ممنوع، error boundary، i18n/RTL readiness (ساختار logical properties: `ms/me/ps/pe/start/end` به‌جای left/right فیزیکی وقتی محصول چندزبانه است)
- **Consistency:** فقط از tokens و کامپوننت‌های Design System استفاده کن؛ رنگ/spacing/font جدید بدون ثبت در `DESIGN.md` ممنوع

## 5. Workflow ساخت هر فیچر

```
1. بخوان: این فایل + DESIGN.md پروژه (اگر نیست، با UI UX Pro Max بساز)
2. Design Contract بنویس (بخش 0-1)
3. اول موبایل، بعد دسکتاپ — کامپوننت‌ها با همه stateها
4. Screenshot/Playwright در 4 breakpoint + dark mode (اگر دارد)
5. پاس‌های polish: spacing/typography → a11y → motion/perf
6. چک‌لیست Verification را تیک بزن و در گزارش نهایی بنویس چه چیزهایی verify شد
```

## 6. Verification Gate — چک‌لیست تحویل

- [ ] بدون console error؛ keyboard-only قابل استفاده؛ focus دیده می‌شود
- [ ] در 320/768/1024/1440 درست است؛ scroll افقی ندارد؛ touch targetها ≥44px
- [ ] Loading/Empty/Error/Success/Permission stateها پیاده شده
- [ ] رنگ/فونت/spacing فقط از Design System؛ هیچ «AI slop» (بخش ۲) دیده نمی‌شود
- [ ] Lighthouse: Performance/Accessibility/Best-Practices قابل قبول؛ CLS/LCP حواس‌جمع
- [ ] Dark mode (اگر در scope است)، RTL (اگر محصول فارسی/عربی دارد)، reduced-motion
- [ ] کامپوننت‌ها typed، تست‌پذیر، و در صورت وجود Storybook/story به‌روز شده

## 7. کی کدام اسکیل جزئی را باز کنم؟

| نیاز | فایل |
|---|---|
| انتخاب style/palette/font/chart برای صنعت محصول | `../skills/01-ui-ux-pro-max/SKILL.md` (+ `data/`, `scripts/search.py`) |
| جهت هنری، فرار از ظاهر جنریک AI | `../skills/02-anthropic-frontend-design/SKILL.md` + `../skills/07-taste-design-taste-frontend/SKILL.md` |
| آدیت UX/a11y/forms (۱۰۰+ قانون) | `../skills/03-vercel-web-design-guidelines/SKILL.md` |
| پرفورمنس React/Next.js | `../skills/04-vercel-react-best-practices/SKILL.md` (+ `rules/`) |
| معماری کامپوننت React | `../skills/05-vercel-composition-patterns/SKILL.md` |
| مهندسی UI پروداکشن، stateها، verification | `../skills/06-addyosmani-frontend-ui-engineering/SKILL.md` |
| polish/audit نهایی، anti-pattern detection | `../skills/08-impeccable/SKILL.md` |
| ساخت/نگهداری Design System و tokens | `../skills/11-ui-ux-design-system/SKILL.md` + `../skills/12-ui-ux-ui-styling/SKILL.md` |
| تست بصری با Playwright | `../skills/10-anthropic-webapp-testing/SKILL.md` |
| **ممیزی کامل مرورگری (E2E+axe+Lighthouse، قبل از «تمام شد»)** | `../skills/13-browser-audit-e2e/SKILL.md` |
| پولیش ضد اسلاپ (spacing/typography/motion/a11y) | `../skills/14-ibelick-baseline-ui/SKILL.md` + `15-…motion` + `16-…accessibility` |
| **جزئیات ریز کنترل‌ها (Select/Input/Button — حالت باز، چرخش فلش، کیبورد)** | `../skills/17-component-craft-forms/SKILL.md` |
| مهندسی طراحی و موشن حرفه‌ای (Emil Kowalski) | `../skills/19-emil-design-engineering/SKILL.md` |
| نمودار و داشبورد داده (Tufte) | `../skills/20-tufte-data-viz/SKILL.md` |
| RTL و محصول فارسی (تقویم جلالی، property منطقی، آیکون جهت‌دار) | `../skills/21-rtl-persian/SKILL.md` |

## 8. خروجی مورد انتظار از ایجنت

در پایان هر تسک UI بگو: Design Contract چه بود، چه Design System/tokensـی استفاده شد، در چه breakpointهایی verify شد، و کدام stateها پوشش داده شد. اسکرین‌شات یا preview زنده بده، نه فقط کد.
