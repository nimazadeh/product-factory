---
name: component-craft-forms
description: >
  Micro-detail craft for form controls and interactive components — the layer AI defaults get wrong:
  custom Select (chevron inset & rotation, animated listbox, full keyboard model), input states,
  focus rings, press feedback, optical alignment, exact spacing/timing numbers. Use whenever building
  or reviewing ANY input, select, checkbox, switch, date field, button, dialog, or dropdown.
  Companion to 14-baseline-ui, 15-fixing-motion-performance, 16-fixing-accessibility.
---

# Component Craft — مو لا درزش نره (فرم‌ها و کنترل‌ها)

> چرا AI اینجا کم می‌آورد؟ چون از روی **عکس و کدِ ساکن** یاد گرفته، نه از تعامل: حالت باز/بسته، فوکوس، hover و فشرده‌شدن را «نمی‌بیند». این اسکیل آن حالت‌ها را با عدد اجباری می‌کند. قانون طلایی: هر کنترل باید در ۶ حالت طراحی شود: `default · hover · focus-visible · open/active · disabled · error` — نبودن هر کدام = ناقص.

## Select (مثال کلاسیک خرابی AI)
- ❌ ممنوع: `<select>` خام با استایل پیش‌فرض مرورگر (آیکون می‌چسبد به دیوار، انیمیشن ندارد، لیست OS-rendered و ناهماهنگ است).
- ✅ پیش‌فرض ما: **کامپوننت Select سفارشی دست‌ساز** (یا Radix/Base UI Select اگر در پروژه هست):
  - دکمه: ارتفاع ≥48px، `padding-inline: 14px 44px` (جای فلش از متن جداست)، فلش ChevronDown ‏۲۰px در `inset-inline-end: 14px` — هرگز چسبیده به لبه (حداقل ۱۲px فاصله).
  - **فلش هنگام بازشدن ۱۸۰° می‌چرخد**، `transition: transform 180ms ease-out`؛ بستن جهت عکس.
  - لیست: `opacity 0→1 + translateY(-4px→0)` در ۱۸۰ms ease-out، سایه واقعی، radius هم‌خانواده دکمه، `max-height` + اسکرول داخلی، آیتم ≥44px، آیتم انتخاب‌شده با تیک و پس‌زمینه semantic.
  - **کیبورد کامل**: Space/Enter/↑/↓ باز و جابه‌جایی، Esc بستن و برگشت فوکوس به دکمه، تایپ‌اول (typeahead)؛ `aria-haspopup="listbox"`, `aria-expanded`, گزینه‌ها `role="option"` + `aria-selected`.
  - کلیک بیرون = بستن؛ در موبایل لیست از پایین (bottom-sheet) اگر جا کم است.
  - فقط وقتی فرم خیلی ساده/`required` سیستمی است native select مجاز است — آن هم با `appearance:none` + فلش سفارشی با همان فاصله/چرخشِ ممکن نیست → پس تقریباً همیشه سفارشی.

## Input / Textarea / Date
- ارتفاع ≥48px، فونت ورودی ≥16px (ضد zoom iOS)، label واقعی بالای فیلد (نه placeholder به‌جای لیبل)، helper زیر فیلد.
- حالت‌ها: border در hover پررنگ‌تر، focus حلقه ۳px با offset (نه حذف outline)، error: border + آیکون + متن خطا چسبیده به همان فیلد با `aria-describedby`، disabled: کنتراست خوانا + `not-allowed`.
- آیکون داخل فیلد: ‏۱۸–۲۰px، فاصله از لبه ۱۲px، از متن ۸px؛ آیکون تزئینی `aria-hidden`.
- فیلد مبلغ/عدد: `inputMode` درست، اعداد tabular، جهت LTR برای عدد/تاریخ شمسی‌نما حتی در صفحه RTL.

## دکمه و کنترل‌های دیگر
- Press feedback: `scale(0.97)` در `:active` با ۱۰۰ms — نه کمتر از 0.95. Hover فقط تغییر رنگ/سایه ملایم در ۱۵۰ms؛ `transition` با نام خاصیت (هرگز `all`).
- Checkbox/Switch/Radio سفارشی با همان رنگ semantic، تیک با انیمیشن ۱۵۰ms، ناحیه لمس ≥44px حتی اگر مربع ۲۰px است.
- Segmented/Tabs: نشانگر فعال با حرکت (transform) نه ظاهر/غیب ناگهانی؛ `aria-pressed/selected`.
- Dialog/Sheet: ورود با opacity+translate ‏۲۰۰–۲۵۰ms، Esc و کلیک بیرون، قفل اسکرول بدنه، فوکوس اول داخل و برگشت فوکوس بعد از بستن.

## اعداد طلایی (بدون استثنا)
فاصله از لبه برای آیکون کنترل‌ها **۱۲–۱۴px** · ارتفاع کنترل **۴۸px** · لمس **≥44px** · مدت میکرواینترکشن **۱۰۰–۲۰۰ms** (بازشدن لیست تا ۲۵۰ms) · easing خروجی `ease-out`/`cubic-bezier(.22,1,.36,1)` · فقط `transform/opacity` انیمیت شود · `prefers-reduced-motion`: چرخش و حرکت حذف، تغییر فوری.

## قبل از تحویل هر فرم — چک بصری تعاملی
حتماً در مرورگر (ممیزی اسکیل ۱۳): یک‌بار فقط با کیبورد کل فرم را پر کن؛ سلکت را باز کن و فلش را ببین می‌چرخد؛ آیتم را با ↑/↓ انتخاب کن؛ خطا را عمداً بساز و جایش را ببین. اسکرین‌شاتِ «حالت باز سلکت» جزو خروجی است.

## حذف و بازخورد (قانون ۲۰۲۶-۱۰-۱۹، از همین محصول)
- هر حذف/کار برگشت‌ناپذیر: **اول Confirm Dialog** (الگوی AlertDialog) — فوکوس پیش‌فرض روی «انصراف» امن است، Esc/کلیک بیرون = انصراف، متن پاپ‌آپ باید اسم و مشخصه آیتم را بگوید («کتاب X حذف شود؟») نه «مطمئنی؟» کلی.
- بازخورد نتیجه با **Toast بالای صفحه سمت راست بصری** (در RTL یعنی `inset-inline-start`)، حداکثر ۳ تا روی هم، بستن دستی + خودکار ~۴ ثانیه، `role=status`.
- انتخاب کتابخونه Toast: پیش‌فرض **سیستم سفارشی خودمان** (سبک، هم‌توکن با برند، RTL واقعی، بدون وابستگی)؛ react-hot-toast فقط وقتی پروژه از قبل داردش یا نیاز اعلان پیچیده (promise/action) جدی است؛ react-toastify برای پروژه‌های ما سنگین و CSS-محور است — انتخاب اول نیست.
- Date picker و popoverهای انتهای فرم باید **به سمت بالا** باز شوند (قانون کاربر ۲۰۲۶-۱۰-۱۹) تا باز شدنشان صفحه/شیت را به اسکرول وادار نکند؛ مبدأ انیمیشن هم از پایین (محل دکمه) است.
