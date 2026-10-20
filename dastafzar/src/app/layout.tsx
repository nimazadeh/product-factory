import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted Vazirmatn variable font (100-900) — no Google Fonts request at
// runtime, so the site stays fully self-contained on Iranian hosting.
const vazir = localFont({
  src: "./fonts/vazirmatn-variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-Vazirmatn",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dastafzar.example.com";
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "دست‌افزار — جعبه‌ابزار آنلاین فارسی",
  description: "ابزارهای آنلاین فارسی: مبدل تاریخ شمسی و میلادی، محاسبه سن، فاصله دو تاریخ، شمارش معکوس نوروز و ابزارهای تخصصی کسب‌وکار.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fa_IR", siteName: "دست‌افزار", url: "/", title: "دست‌افزار — جعبه‌ابزار آنلاین فارسی", description: "ابزارهای آنلاین فارسی: مبدل تاریخ، محاسبه سن، شمارش معکوس نوروز و فاکتورساز حرفه‌ای." },
  twitter: { card: "summary", title: "دست‌افزار — جعبه‌ابزار آنلاین فارسی", description: "ابزارهای آنلاین فارسی، سریع و بدون ثبت‌نام." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.className} ${vazir.variable}`}>
      <body>{children}</body>
    </html>
  );
}
