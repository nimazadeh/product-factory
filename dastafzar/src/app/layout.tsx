import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({ subsets: ["arabic"], weight: ["400", "500", "700", "800"], display: "swap" });

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
    <html lang="fa" dir="rtl" className={vazir.className}>
      <body>{children}</body>
    </html>
  );
}
