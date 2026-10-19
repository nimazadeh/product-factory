# اعتبارسنجی و خطا — قرارداد سراسری (Zod، از داک رسمی ۲۰۲۶-۱۰-۱۹)

## تصمیم: Zod در هر دو سمت (جایگزین class-validator)
- **سرور** (`api/src/schemas.ts` + `ZodPipe` per-route): هر بدنه با `safeParse`؛ خطا = اولین پیام‌های فیلدی فارسی. Zod فیلد ناشناس را strip می‌کند (رفتار پیش‌فرض) — یعنی داده اضافه بی‌صدا حذف می‌شود، نه ذخیره.
- **کلاینت** (`src/lib/schemas.ts`): همان قراردادها mirror؛ فرم لاگین پیش از ارسال validate می‌شود و پاسخ آمار سرور هم با `statsSchema` parse می‌شود — به سرور اعتماد کور نداریم.
- تایپ‌ها همه از `z.infer` — یک منبع حقیقت برای تایپ و runtime (TS strict در هر دو پروژه فعال است؛ Zod به `strict: true` نیاز دارد).

## Error Handling
- **سرور:** فیلتر سراسری `AllExceptionsFilter` — شکل واحد `{statusCode, message, errors?, path, timestamp}`؛ جزئیات 5xx فقط لاگ سرور، به کاربر «خطای داخلی» آرام.
- **کلاینت:** `apiFetch` در `lib/errors.ts` — خطای شبکه/۴۰۱/۴۲۹ به پیام فارسی انسانی؛ جزئیات فنی فقط console. صفحات `error.tsx` و `not-found.tsx` فارسی با راه برگشت.

## قوانین React/TS استخراج‌شده (react.dev + هندبوک TS)
- کامپوننت خالص (pure): رندر بدون side-effect؛ داده از props/state؛ StrictMode چارچوب‌ها روشن است.
- تفکیک: اول نسخه استاتیک و سلسله‌مراتب کامپوننت، بعد تعامل و state (الگوی «Thinking in React»).
- TS: خطای تایپ پیش از اجرا گرفته می‌شود؛ هیچ `any` تازه بدون دلیل مکتوب.
