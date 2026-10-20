import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarRange, Sparkles } from "lucide-react";
import { TOOLS } from "@/lib/tools-data";
import ToolsCatalog from "./ToolsCatalog";

export const metadata: Metadata = {
  title: "همه ابزارها | دست‌افزار",
  description: "فهرست کامل ابزارهای دست‌افزار: مبدل تاریخ، محاسبه سن، اختلاف دو تاریخ، شمارش معکوس نوروز و تقویم شمسی با همه مناسبت‌ها و تعطیلات رسمی ایران.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <main className="tools-page">
      <div className="tools-page-inner">
        <Link className="back-link" href="/"><ArrowRight size={16} /> برگشت به خانه</Link>
        <h1>همه ابزارها</h1>
        <p className="tools-page-lead">هر ابزاری که لازم داری، اینجاست — رایگان و بدون ثبت‌نام.</p>
        <ToolsCatalog tools={TOOLS} />
      </div>
    </main>
  );
}
