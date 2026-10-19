# AGENTS.md — قانون اساسی کار در این Workspace
> هر ایجنت (Claude/ChatGPT/Gemini/…) که وارد این Workspace می‌شود، **قبل از هر کاری این فایل را کامل بخواند.**
> صاحب Workspace فارسی‌زبان است؛ پاسخ‌ها پیش‌فرض فارسی، ساده و بدون اصطلاح بی‌دلیل باشند.

## صاحب کار و سبک همکاری
- کاربر غیرفنی نیست، ولی وقت تست ندارد: اسکرین‌شات و Preview زنده بده، نه فقط کد.
- منظور کاربر را به «قانون اجرایی» تبدیل کن: هر تصمیمِ تکرارشونده را در همین فایل یا اسکیل مربوطه بنویس، نه در حافظه چت.
- هدف و محدودیت را از کاربر بگیر؛ راه فنی را خودت انتخاب و دلیلش را کوتاه بگو. وقتی ابهام مهم است، با سؤال کوتاه بپرس؛ حدس پرهزینه نزن.

## قوانین دائمی (غیرقابل مذاکره)
1. **فرانت‌اند:** همیشه طبق `frontend-skills/00-MASTER-production-frontend/SKILL.md` (Mobile-First، Enterprise، Design Contract قبل از کد). جزئیات: `frontend-skills/README.md`
   **+ گیت انتخاب جهت:** قبل از هر UI مهم، طبق `frontend-skills/skills/18-design-exploration/SKILL.md` چند مرجع واقعی از وب بیاور، ۲–۳ جهت سازگار بساز، توصیه صریح بده (مخالفت فنی محترمانه مجاز و لازم است) و انتخاب را به کاربر بسپار.
2. **«تمام شد» ممنوعِ بدون ممیزی:** `frontend-skills/skills/13-browser-audit-e2e/SKILL.md` — ‏E2E در Chromium/Firefox/WebKit + axe + Lighthouse + گزارش در `<product>/AUDIT-REPORT.md`
3. **برند و اسِت:** `frontend-skills/premium-ui-ux-pro-max/SKILL.md` (لوگو، CIP، بنر، اسلاید، آیکون، توکن سازمانی)
4. **بک‌اند و امنیت سرتاسری:** `backend-skills/00-MASTER-backend-security/SKILL.md` + استک مرجع `docs/backend-stack-ADR.md` (NestJS/PostgreSQL) — هر محصول دارای بک‌اند/API/لاگین تابع این دو فایل است.
4. **چرخه ساخت محصول:** نقشه و سؤال (مثل grill-me) → Spec → تیکت‌های کوچک → پیاده‌سازی با تست → بازبینی → ممیزی مرورگری → تحویل
5. **قانون ZIP واحد:** برای هر محصول همیشه فقط یک فایل بایگانی: `_archive/<product>-latest.zip` — نسخه جدید جایگزین قبلی می‌شود، قدیمی‌ها خودکار حذف می‌شوند. اجرا: `_system/archive-product.sh <dir> <version>` (با `--delete` فقط وقتی کاربر گفت محصول تمام شد). شماره نسخه در `VERSION.txt` داخل محصول و در `PRODUCTS.md` ثبت می‌شود.
6. **حافظه Workspace:** `_archive/` = خروجی‌ها؛ `PRODUCTS.md` = دفتر ثبت محصولات/نسخه‌ها. ZIP هرگز شامل `node_modules/dist/build` نیست.
7. **بازگردانی محصول:** `_system/restore-product.sh _archive/<product>-latest.zip` سپس `npm install --legacy-peer-deps` (در این محیط npm بدون این فلگ خطا می‌دهد).

## نقشه Workspace
| مسیر | چیست |
|---|---|
| `frontend-skills/` | مغز طراحی و کیفیت (Master + ۱۳ اسکیل + Premium + مرجع Matt Pocock در `mattpocock-reference/`) |
| `<product>/` | محصول در حال توسعه — در ریشه، یکی در هر زمان ترجیحاً |
| `<product>/DESIGN.md` و `brand/` | قرارداد طراحی و هویت همان محصول |
| `_system/`، `_archive/`، `PRODUCTS.md` | ابزار و حافظه بلندمدت (بند ۵ و ۶) |

## شروع هر سشن (چک‌لیست ایجنت تازه‌وارد)
1. این فایل → 2. `PRODUCTS.md` → 3. اگر تسک فرانت‌اند است: Master Skill → 4. اگر محصول مشخص است: `DESIGN.md` و `AUDIT-REPORT.md` آن → 5. کار را شروع کن و در پایان: ممیزی + ZIP تازه.
