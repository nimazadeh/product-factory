---
name: backend-security-master
description: >
  MASTER for production-grade backend (NestJS/PostgreSQL per ADR-001) and end-to-end product
  security. Combines NestJS best practices, OWASP Top 10:2025/ASVS/API Security, Trail of Bits
  differential review & static analysis, Addy Osmani security/API/CI-CD/observability skills.
  Use for ANY backend, API, auth, database, CI, deployment, or "is this secure?" task.
---

# Backend + End-to-End Security Master

> متمم `docs/backend-stack-ADR.md` و Master فرانت‌اند است. هر محصول دارای بک‌اند، تابع این فایل است.

## چرخه ساخت بک‌اند (ترتیب اجباری)
1. **API Contract قبل از کد** — DTOها، خطاها، pagination و احراز هویت در سند/API spec؛ اسکیل 09.
2. **NestJS** — معماری و قانون‌ها از اسکیل‌های 01 و 02 (module باریک، controller لاغر، service منطق).
3. **از اولین خط امن بنویس** — چک‌لیست سرتاسری پایین + اسکیل 05؛ امنیت مرحله آخر نیست.
4. **تست**: unit + integration روی Postgres واقعی (Testcontainers) + e2e API.
5. **بازبینی امنیتی قبل از merge** — اول differential review (اسکیل 06)، برای تغییر حساس: static analysis (07).
6. **CI** — خط لوله ADR-001 + اسکن‌های امنیتی بند «CI امنیتی»؛ قرمز = merge ممنوع.
7. **گزارش** — `SECURITY-REPORT.md` محصول مثل AUDIT-REPORT فرانت‌اند.

## امنیت سرتاسری — ۹ لایه، هر کدام مالک و چک مشخص
| لایه | قانون کلیدی | مرجع |
|---|---|---|
| 1. فرانت‌اند | هیچ سکرت در کلاینت؛ XSS با escape پیش‌فرض React؛ CSP؛ توکن در cookie httpOnly نه localStorage | 03/05 |
| 2. شبکه/API | HTTPS اجباری، CORS whitelist، Helmet headers، rate-limit (سخت‌تر روی auth)، validation روی همه ورودی‌ها (DTO+whitelist) | 01/03 |
| 3. احراز هویت | Argon2/bcrypt، JWT access کوتاه + refresh چرخان، قفل/تأخیر روی تلاش ناموفق، بازیابی رمز امن | 03/08 |
| 4. مجوز (Authorization) | deny-by-default، چک مالکیت روی هر رکورد (ضد IDOR)، RBAC با Guard — فرانت «مخفی کردن دکمه» مجوز نیست | 03/04 |
| 5. دیتابیس | کوئری پارامتری/Prisma، کم‌ترین دسترسی کاربر DB، migration نسخه‌دار، بک‌آپ + تست بازگردانی، رمزنگاری داده حساس | 08 |
| 6. فایل و ورودی خارجی | محدودیت حجم/نوع فایل، اسکن، URL خارجی = ضد SSRF (allowlist)، آپلود جدا از وب‌روت | 04/05 |
| 7. زیرساخت و داکر | ایمیج مینیمال، کاربر non-root، پین نسخه‌ها، بدون سکرت در ایمیج/لاگ | 10 |
| 8. زنجیره تأمین و CI | قفل نسخه (lockfile)، `npm audit`/Dependabot، سکرت فقط در GitHub Secrets، دسترسی حداقلی توکن CI، امضای خروجی‌ها | 10/04 |
| 9. محصول AI (اگر دارد) | prompt injection را «حل‌شده» فرض نکن؛ داده کاربر fence، ابزار کم‌اختیار، خروجی فیلتر، تأیید انسان برای کار مخرب | 03 (LLM/Agentic Top 10) |

## CI امنیتی اجباری (در همان workflow گیت‌هاب)
```
lint+typecheck → unit/integration (Postgres واقعی) → build
→ npm audit (high+ = fail) → secret scan (gitleaks) → SAST (CodeQL یا Semgrep)
→ docker build + image scan (Trivy) → e2e مرورگری (اسکیل 13 فرانت‌اند)
```

## قالب گزارش هر یافته امنیتی (مثل Trail of Bits: مدرک، نه حدس)
شدت (CVSS تقریبی) · محل (فایل:خط) · مسیر ورودی مهاجم تا نقطه آسیب · سناریوی سوءاستفاده · فیکس مشخص · روش تأیید فیکس. یافته بدون مسیر بهره‌برداری اثبات‌شده گزارش نمی‌شود (ضد خطای کاذب).

## کی کدام اسکیل؟
nestjs ساخت/معماری: 01,02 · ممیزی OWASP کلی: 03,04 · کدنویسی امن روزمره: 05,08 · بازبینی PR حساس: 06 · تحلیل استاتیک عمیق: 07 · طراحی API: 09 · CI/CD: 10 · لاگ/مانیتورینگ: 11
