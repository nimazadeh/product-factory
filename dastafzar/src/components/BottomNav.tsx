// Mobile bottom navigation (Android app pattern).
import Link from "next/link";
import { Home, LayoutGrid, CalendarDays, LayoutDashboard } from "lucide-react";

export default function BottomNav({ active = "home" }: { active?: "home" | "tools" | "calendar" | "panel" }) {
  const cls = (k: string) => `bn-item${active === k ? " is-active" : ""}`;
  return (
    <nav className="bottom-nav" aria-label="ناوبری موبایل">
      <Link href="/" className={cls("home")} aria-current={active === "home" ? "page" : undefined}><Home size={23} aria-hidden /><span>خانه</span></Link>
      <Link href="/tools" className={cls("tools")} aria-current={active === "tools" ? "page" : undefined}><LayoutGrid size={23} aria-hidden /><span>ابزارها</span></Link>
      <Link href="/tools/jalali-calendar" className={cls("calendar")} aria-current={active === "calendar" ? "page" : undefined}><CalendarDays size={23} aria-hidden /><span>تقویم</span></Link>
      <Link href="/admin" className={cls("panel")} aria-current={active === "panel" ? "page" : undefined}><LayoutDashboard size={23} aria-hidden /><span>پنل</span></Link>
    </nav>
  );
}
