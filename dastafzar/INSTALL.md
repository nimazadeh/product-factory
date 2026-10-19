# راهنمای نصب و اجرا — دست‌افزار (لوکال و سرور)

این راهنما قدم‌به‌قدم است؛ از صفر تا سایت + پنل ادمین بالا.

## پیش‌نیازها
- Node.js ‏۲۰٫۱۹ یا بالاتر
- Docker (برای دیتابیس پستگرس) — یا پستگرس نصب‌شده روی سیستم

## قدم ۱ — دریافت کد
```bash
git clone https://github.com/nimazadeh/product-factory.git
cd product-factory/dastafzar
```

## قدم ۲ — تنظیمات محیط (env) ⚠️ مهم‌ترین قدم
دو فایل env لازم است. هر دو از روی نمونه ساخته می‌شوند و **هیچ‌کدام نباید کامیت شوند** (داخل .gitignore هستند):

```bash
cp .env.example .env          # تنظیمات دیتابیس (برای docker compose)
cp api/.env.example api/.env  # تنظیمات بک‌اند
```

**فایل `.env` ریشه** — فقط رمز دیتابیس:
```ini
POSTGRES_PASSWORD=یه-رمز-قوی-دلخواه
```

**فایل `api/.env`** — این‌ها را حتماً عوض کنید:
```ini
DATABASE_URL=postgresql://dastafzar:<همان-رمز-بالا>@localhost:5432/dastafzar
JWT_SECRET=<یه-رشته-تصادفی-بلند-مثلاً-۳۲-نویسه>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<رمز-ورود-پنل-ادمین-دلخواه>
PORT=4000
```
> مدیر اول به‌صورت خودکار با همین `ADMIN_EMAIL/ADMIN_PASSWORD` ساخته می‌شود (فقط بار اول؛ اگر کاربر ساخته شد، تغییر env دیگر اثری ندارد و باید از دیتابیس عوض شود.)

## قدم ۳ — دیتابیس
```bash
docker compose up -d     # پستگرس روی پورت 5432 با رمز قدم ۲
```

## قدم ۴ — بک‌اند (NestJS API)
```bash
cd api
npm install
npx prisma migrate dev   # ساخت جدول‌ها
npm run build
node dist/main.js        # API روی http://localhost:4000/api
cd ..
```

## قدم ۵ — فرانت (Next.js)
```bash
npm install
npm run build
npm run start            # سایت روی http://localhost:3000
```

## قدم ۶ — پنل ادمین
- آدرس: **http://localhost:3000/admin**
- ورود: همان `ADMIN_EMAIL` و `ADMIN_PASSWORD` فایل `api/.env`

## چک سلامت
```bash
curl http://localhost:4000/api/health   # باید {"ok":true} بدهد
```

## اجرای همیشگی روی سرور (خلاصه)
هر سه را با process manager اجرا کنید (مثلاً pm2):
```bash
pm2 start "node dist/main.js" --name dastafzar-api --cwd api
pm2 start "npm run start"     --name dastafzar-web
```
و در production حتماً: دامنه واقعی در `NEXT_PUBLIC_SITE_URL`، رمزهای قوی و `JWT_SECRET` تازه، و قرار دادن `dastafzar.example.com` در sitemap/robots با دامنه خودتان.

## رفع اشکال
| مشکل | علت محتمل |
|---|---|
| خطای اتصال دیتابیس | docker compose بالا نیست یا رمز دو فایل env یکی نیست |
| ورود ادمین قبول نمی‌شود | مدیر با رمز قبلی ساخته شده؛ جدول AdminUser را خالی و API را ری‌استارت کنید |
| پورت اشغال است | 3000/4000/5432 را آزاد کنید یا PORT را عوض کنید |
