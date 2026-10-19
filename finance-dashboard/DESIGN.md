# DESIGN.md — جیبتو (Jibeto) | داشبورد مدیریت مالی شخصی

## Design Contract
- **جهت انتخابی کاربر (۲۰۲۶-۱۰-۱۹، از گیت اکتشاف طراحی):** «روشن خلوت» (Light Airy) — استخراج الگو از مراجع واقعی وب، نه کپی: کارت موجودی روشن، حلقه بودجه (Budget Ring) و «جیب‌های» دسته‌بندی (Pockets). جهت قبلی «دفتر حساب» در توکن‌ها/اعداد حفظ شده، ارائه روشن‌تر و خلوت‌تر شده. رد شده با نظر صریح ایجنت: جهت بنفش کارتی (AI-slop و ناسازگار با اعتماد مالی) و تیره جسور (خستگی روزانه چشم).
- **Job:** کاربر در ۵ ثانیه بفهمد امروز / این هفته / این ماه چقدر خرج کرده، پول کجا رفته و آیا از بودجه جلوتر است.
- **User:** یک شخص (Single-user, Local-First) — موبایل وسیله اصلی ثبت خرج است.
- **Primary Action:** ثبت سریع تراکنش (FAB در موبایل / دکمه اصلی در دسکتاپ)
- **Aesthetic Direction:** «دفتر حساب مدرن» (Modern Ledger) — اعداد tabular درشت، hairlineهای دفتر حساب، فضای سفید سخاوتمندانه، یک accent پولی. گرفته‌شده از دنیای واقعی محصول (دفتر حساب/رسید)، نه از ترند SaaS.
- **Reject (Anti-patterns):** گرادیان بنفش/ایندیگو، Glassmorphism، کارت‌های rounded یک‌شکل روی هم، فونت دست‌نویس (Caveat که UI UX Pro Max پیشنهاد داد — برای داشبورد متراکم فارسی نامناسب)، emoji به‌عنوان آیکون.
- **Brand test:** عدد موجودی با تایپوگرافی tabular + خط‌کش دفتر حساب امضای این محصول است؛ بدون لوگو هم «دفتر حساب» بودنش خواناست.

## Source (UI UX Pro Max)
- جستجو: `"personal finance dashboard mobile" --design-system` → Trust Blue/Green مالی تأیید شد؛ Glassmorphism و Caveat/Quicksand **رد شد** (خوانایی/تراکم).
- نمودارها (`--domain chart`): روند زمانی = Area/Line، مقایسه دسته‌بندی = Horizontal Bar، KPI در برابر هدف = Progress/Bullet. هر نمودار fallback جدولی + خلاصه متنی دارد.

## Tokens
| Token | Value |
|---|---|
| `--bg` | `#F6F7F5` (کاغذ خنثی، نه سفید خالص و نه کرم کلیشه‌ای) |
| `--surface` | `#FFFFFF` |
| `--ink` | `#16211C` (متن اصلی — کنتراست روی bg ‏> 12:1) |
| `--ink-2` | `#4A5A52` (متن ثانویه — > 4.5:1) |
| `--primary` | `#0B6B4F` (سبز پولی عمیق — دکمه/لینک روی سفید > 4.5:1) |
| `--primary-ink` | `#084C38` |
| `--income` | `#0B6B4F` · `--expense` | `#C2410C` (نارنجی سوخته، نه قرمز خالص) |
| `--warn` | `#B45309` · `--danger` | `#B42318` |
| `--line` | `#E3E8E3` (hairline دفتر حساب) |
| Radius | `10 / 14 / 20` (سلسله‌مراتبی، نه یک radius برای همه) |
| Spacing | مبنای 4px: 4/8/12/16/24/32/48 |

## Typography
- فارسی: **Vazirmatn** (fallback: Tahoma) — اعداد: `font-variant-numeric: tabular-nums`
- Scale: 12 / 13 / 16(body) / 20 / 24 / 32 / 40(عدد موجودی)
- Body موبایل ≥16px، ورودی‌ها 16px (ضد zoom آیفون)

## Layout & Rules
- Mobile-First: Bottom Nav (۴ بخش) + FAB ثبت؛ Desktop ≥1024: Sidebar + گرید ۱۲ ستونه
- Breakpoints تست: **320 / 390 / 768 / 1024 / 1440** — بدون scroll افقی، touch ≥44px
- RTL کامل با logical properties (`margin-inline-start` و…)، نمودارها LTR داخلی با برچسب فارسی
- Stateهای اجباری: Loading(Skeleton) · Empty · Error+Retry · Success(Toast) · Permission(قفل حریم خصوصی)
- Motion: فقط feedback اکشن (بازشدن فرم، toast) 180–240ms، `prefers-reduced-motion` محترم
- A11y: WCAG 2.2 AA — فوکوس visible، label واقعی، نمودار = خلاصه متنی + جدول قابل دسترس

## Stack (انتخاب و دلیل)
Vite + React 19 + TypeScript strict + CSS Tokens (بدون Tailwind برای کنترل کامل RTL/توکن) + Lucide icons + LocalStorage (Local-First تک‌کاربره؛ بدون سرور/لاگین جعلی). کامپوننت‌ها typed و جدا در `src/components/`، منطق پول در `src/lib/`.
