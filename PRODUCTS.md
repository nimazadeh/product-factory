# 📦 Product Registry — دفتر ثبت محصولات این Workspace

> قانون کار بلندمدت (از ۲۰۲۶-۱۰-۱۸): هر محصول که تمام شد → آرشیو ZIP → حذف پوشه منبع.
> **قانون ZIP واحد + نسخه روی نام (از ۲۰۲۶-۱۰-۱۹ — جایگزین قانون قبلی): برای هر محصول همیشه فقط یک فایل `_archive/<product>-v<semver>.zip` وجود دارد؛ نسخه دقیق SemVer روی نام فایل است، بعد از هر تغییر بازسازی می‌شود و ZIP قبلی خودکار حذف می‌شود.**
> **قانون اسکرین‌شات (۲۰۲۶-۱۰-۲۰): ZIPها هرگز شامل `screenshots/` نیستند — اسکرین‌شات‌ها فقط در Git می‌مانند تا حجم آرشیو کم بماند.**
> برگرداندن: `_system/restore-product.sh _archive/<product>-latest.zip` — بعد `npm install` و ادامه توسعه.
> آرشیو هرگز شامل `node_modules/dist/build` نیست (قابل بازسازی‌اند و اصلاً در Snapshot ذخیره نمی‌شوند).

| محصول | نسخه | تاریخ | حجم ZIP | SHA-256 | وضعیت |
|---|---|---|---|---|---|

## موجودی فعلی Workspace
- `frontend-skills/` — اسکیل‌های فعال (Master + 12 اسکیل + Premium) — همیشه می‌ماند
- `_archive/skills-upstream-reference.zip` — سورس کامل ریپوهای upstream (۱۲MB)؛ فقط برای مرجع، لازم شد unzip می‌شود
- `_system/` — اسکریپت‌های archive/restore

## چرخه حیات هر محصول
```
توسعه → تست (Verification Gate) → archive-product.sh <dir> <ver> --delete → فقط ZIP + یک ردیف در این فایل
بازگشت: restore-product.sh → npm install --legacy-peer-deps → فیتچر جدید → آرشیو نسخه بعد
```
| finance-dashboard | v2.2 | 2026-10-19 | 2.9M | `3ba98dceb1b286f3bb4310233fc7fbcca027208d0e823fe9934439e044756ad4` | zipped — ready to download (`_archive/finance-dashboard-v2.2.0.zip`) |

| dastafzar | v0.9.0 | 2026-10-21 | 532K | `d07bb0960fc4cb4cacc121ab9ad2a7a4f9453b8bdeb6113ef8355e1081a0131f` | zipped — ready to download (`_archive/dastafzar-v0.9.0.zip`) — rebuilt after every change |
