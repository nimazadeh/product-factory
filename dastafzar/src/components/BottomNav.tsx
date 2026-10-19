// Mobile bottom navigation (Android app pattern) — landing page only for now.
import Link from "next/link";
import { Home, LayoutGrid, CalendarDays, LayoutDashboard } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="ناوبری موبایل">
      <Link href="/" className="bn-item is-active"><Home size={23} aria-hidden /><span>خانه</span></Link>
      <Link href="#tools" className="bn-item"><LayoutGrid size={23} aria-hidden /><span>ابزارها</span></Link>
      <Link href="/tools/jalali-calendar" className="bn-item"><CalendarDays size={23} aria-hidden /><span>تقویم</span></Link>
      <Link href="/admin" className="bn-item"><LayoutDashboard size={23} aria-hidden /><span>پنل</span></Link>
    </nav>
  );
}
