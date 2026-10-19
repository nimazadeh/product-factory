# یادداشت‌های پژوهشی NestJS — API دست‌افزار (از مستندات رسمی docs.nestjs.com، ۲۰۲۶-۱۰-۱۹)

## اعمال‌شده (شکاف‌هایی که ممیزی با داک پیدا کرد)
- **ValidationPipe سراسری** با `whitelist + forbidNonWhitelisted + transform` و DTO برای هر ورودی (قبلاً برش دستی رشته بود) — تست: بدنه نامعتبر و فیلد اضافه هر دو 400.
- **Rate Limiting** با `@nestjs/throttler`: سقف کلی ۱۲۰/دقیقه و لاگین ۵/دقیقه ضد حدس رمز — تست: تلاش ششم 429.
- **Helmet** برای هدرهای امنیتی — تست: CSP و X-Content-Type-Options در پاسخ health.
- ساختار فعلی یک ماژول فشرده است؛ با رشد API به feature module جدا شود (کنوانسیون CLI).

## نکات داک برای آینده
- داک احراز هویت فعلی Nest پکیج تازه `@nestjs/authentication` را معرفی می‌کند (سشن سروری، رفرش توکن چرخشی، 2FA، API key). راه JWT فعلی ما (`@nestjs/jwt` + گارد سفارشی) معتبر است؛ هنگام آمدن کاربر عمومی، مهاجرت به آن پکیج ارزیابی شود.
- Node لازم: ‎>=20.19‎ (CLI تازه بالاتر)؛ strict موشن TS در پروژه‌های تازه روشن است.
- برای health production از `@nestjs/terminus` استفاده شود (الان health ساده است — فاز لانچ).
- پشت پروکسی ایران: `trust proxy` و tracker سفارشی Throttler برای IP واقعی کاربر.
