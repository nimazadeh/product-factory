import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({ subsets: ["arabic"], weight: ["400", "500", "700", "800"], display: "swap" });

export const metadata: Metadata = {
  title: "دست‌افزار — جعبه‌ابزار آنلاین فارسی",
  description: "ابزارهای آنلاین فارسی: مبدل تاریخ شمسی و میلادی، محاسبه سن، فاصله دو تاریخ، شمارش معکوس نوروز و ابزارهای تخصصی کسب‌وکار.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.className}>
      <body>{children}</body>
    </html>
  );
}
