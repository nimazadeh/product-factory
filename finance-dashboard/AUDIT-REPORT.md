# Audit Report — جیبتو (finance-dashboard) — ۲۰۲۶-۱۰-۱۸
URL: Vite dev (E2E) + Vite preview/production (Lighthouse) · ابزار: Playwright + axe-core + Lighthouse · طبق `frontend-skills/skills/13-browser-audit-e2e`

| # | لایه | نتیجه | جزئیات |
|---|---|---|---|
| 1 | E2E فانکشنال | ✅ | ثبت/حذف تراکنش، persistence، سوییچ روز/هفته/ماه، جستجوی خالی، قفل، اعتبارسنجی فرم — ۱۱ تست × ۳ مرورگر |
| 2 | چندمرورگری | ✅ | **33/33 پاس در Chromium + Firefox + WebKit** |
| 3 | ریسپانسیو 320–1440 | ✅ | بدون اسکرول افقی در هر ۵ سایز؛ همه دکمه‌ها ≥44px (offset) — اسکرین‌شات: `e2e/screenshots/audit-*.png` |
| 4 | Accessibility (axe) | ✅ | ۰ نقض critical/serious (WCAG 2.1/2.2 AA) در هر ۳ موتور |
| 5 | Lighthouse (production) | ✅ | **Performance 92 · Accessibility 100 · Best Practices 100 · SEO 91** · LCP 2.7s · CLS 0 · TBT 0ms |
| 6 | رگرسیون بصری | ⚠️ baseline ساخته شد | اسکرین‌شات‌های این اجرا baseline نوبت‌های بعد شدند؛ diff خودکار از اجرای بعد فعال است |
| 7 | کنسول | ✅ | ۰ خطای console/pageerror |

## چیزهایی که ممیزی پیدا و فیکس شد (همین اجرا)
1. **axe (serious):** `aria-label` روی div اسکلت لودینگ بدون role → `role="status"` اضافه شد (`src/components/States.tsx`).
2. **معیار تاچ:** تست `clientHeight` می‌خواند (بدون border ‏= ۴۲) → اصلاح به `offsetHeight`؛ ناحیه لمس واقعی دکمه‌ها ۴۴px است.
3. **تست اشتباه محصول را متهم می‌کرد:** در دسکتاپ FAB عمداً مخفی است → تست مثل کاربر واقعی از دکمه سایدبار استفاده می‌کند.

## اجرای دوباره
```bash
npx playwright install --with-deps chromium firefox webkit
npx playwright test            # هر ۳ مرورگر؛ سرور dev خودکار بالا می‌آید
```
CI آماده است: `.github/workflows/audit.yml` (با هر push/PR روی گیت‌هاب خودکار اجرا می‌شود).
