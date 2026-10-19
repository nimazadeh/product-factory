# ADR-001 — استک پیش‌فرض بک‌اند محصولات (تصمیم معماری، ۲۰۲۶-۱۰-۱۸)

## تصمیم
**NestJS (TypeScript) + PostgreSQL + Prisma + Redis (فقط وقتی لازم شد) + Docker** — در یک monorepo کنار فرانت‌اند.

## چرا این استک (معیارها: راحتی در GitHub CI، قدرت production، تک‌زبانه بودن با فرانت‌اند ما)
| نیاز | انتخاب | دلیل |
|---|---|---|
| زبان و تایپ | TypeScript مشترک فرانت/بک | یک زبان، تایپ‌های مشترک (DTO/Zod) بین دو طرف، استخدام و نگهداری ساده |
| فریم‌ورک | NestJS | ساختار سازمانی آماده (Module/Guard/Interceptor)، validation، Swagger/OpenAPI خودکار، تست‌پذیری بالا — در حد Enterprise |
| دیتابیس | PostgreSQL | قوی‌ترین انتخاب عمومی production: تراکنش، JSON، ایندکس، بک‌آپ و ابزار بالغ |
| ORM و مهاجرت | Prisma | schema خوانا، migration نسخه‌دار، تایپ امن از دیتابیس تا API |
| احراز هویت | JWT access کوتاه + refresh چرخان (httpOnly cookie) + Argon2 | استاندارد امن؛ نقش‌ها با Guard (RBAC) |
| تست | Vitest/Jest + Supertest + Testcontainers | تست واقعی روی Postgres واقعی داخل کانتینر، نه mock دروغین |
| CI | GitHub Actions + سرویس Postgres داخلی + Docker Compose | بدون سرور خارجی، هر PR کامل تست می‌شود |

## خط لوله CI بک‌اند (هر push/PR)
```
install → lint → typecheck → unit tests → migration check (prisma validate/migrate diff)
→ بالا آوردن Postgres با Testcontainers/Compose → integration/e2e API tests → build Docker image
```
قرمز در هر قدم = merge ممنوع. تصویر داکر ساخته‌شده همان چیزی است که deploy می‌شود.

## الزامات production-grade (چک‌لیست هر بک‌اند)
- [ ] validation ورودی + rate limit + helmet/CORS محدود + بدون لو رفتن خطای داخلی
- [ ] migration برای هر تغییر اسکیما (بدون دست‌کاری دستی DB)
- [ ] لاگ ساخت‌یافته + request-id + health/readiness endpoint
- [ ] env با نمونه `.env.example`، سکرت فقط در GitHub Secrets/سرور — هرگز در ریپو
- [ ] بک‌آپ خودکار دیتابیس و تستِ برگرداندن آن

## کی این تصمیم عوض می‌شود؟ (استثناها)
- محصول realtime/خیلی پرترافیک اختصاصی یا تیم پایتون قوی → FastAPI قابل دفاع است
- ابزار داخلی تک‌فایله سریع → Next.js Route Handlers کافی است و بک‌اند جدا نمی‌سازیم
- قانون: بک‌اند جدا فقط وقتی لازم است (لاگین/سینک/چندکاربره/پرداخت) — پیش‌فرض همان بحث Local-First فرانت‌اند است
