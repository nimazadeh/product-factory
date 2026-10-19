# یادداشت‌های پژوهشی Next.js — دست‌افزار (از مستندات رسمی، ۲۰۲۶-۱۰-۱۹)

منبع: nextjs.org/docs (App Router) — خوانده‌شده از منبع، نه حافظه. هنگام ارتقای Next بازبینی شود.

## اعمال‌شده روی پروژه
- **Cache Components روشن** (`cacheComponents: true` + `partialPrefetching: true`) — پیش‌فرض فعلی create-next-app در Next 16. پیامد: `force-dynamic` ممنوع؛ داده runtime باید پشت `<Suspense>` استریم شود یا کلاینت باشد (داشبورد ما کلاینتی است).
- **next/font/google فونت را در بیلد self-host می‌کند** (از دامنه خود سایت سرو می‌شود، مرورگر به گوگل وصل نمی‌شود) — برای لانچ ایران کافی است؛ فقط بیلد به اینترنت نیاز دارد.
- **متادیتا کامل:** `metadataBase` + `alternates.canonical` + OpenGraph ‏(fa_IR) + Twitter card در layout؛ متادیتای اختصاصی در Server Component هر صفحه.
- **لینک داخلی با `next/link`** (prefetch خودکار)؛ `<a>` فقط برای خارجی/لنگر ساده.
- صفحات ابزار استاتیک (SSG) می‌مانند؛ «امروز» در useEffect کلاینت پر می‌شود تا prerender استاتیک نشکند (الگوی runtime data بدون Suspense سرور).

## قوانین کلی استخراج‌شده
- Metadata API فقط Server Component؛ برای داده وابسته `generateMetadata` + ‏`cache()` ری‌اکت برای حذف فچ تکراری.
- فایل‌های قراردادی `sitemap.ts` / `robots.ts` / `opengraph-image` به‌جای فایل استاتیک دستی.
- در Cache Components: هر خواندن uncached (کوکی/هدر/searchParams) بدون Suspense خطای blocking-route می‌دهد.
- Runtime APIs ‏(cookies/headers/params/searchParams) در صفحات استاتیک ممنوع مگر با generateStaticParams یا استریم.

## هنوز باز (هنگام نیاز)
- `opengraph-image.tsx` تصویری برای اشتراک‌گذاری (فاز سئو پیشرفته)
- `proxy` به‌جای middleware در Next 16 (فعلاً middleware نداریم)
