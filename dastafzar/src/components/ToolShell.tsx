import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function ToolShell({ title, desc, children, navActive = "tools" }: {
  title: string; desc: string; children: ReactNode; navActive?: "tools" | "calendar";
}) {
  return (
    <main className="landing">
      <header className="topbar">
        <Link className="brand" href="/" style={{ textDecoration: "none" }}><span className="brand-mark">د</span> دست‌افزار</Link>
        <nav aria-label="ناوبری اصلی"><Link href="/tools">همه ابزارها</Link></nav>
      </header>
      <section className="tool-page">
        <Link href="/tools" className="back-link"><ArrowRight size={17} aria-hidden /> همه ابزارها</Link>
        <h1>{title}</h1>
        <p className="hero-sub">{desc}</p>
        {children}
        <p className="hero-note">بدون ثبت‌نام · محاسبه روی دستگاه شما · بدون ذخیره داده</p>
      </section>
      <footer className="footer">دست‌افزار — جعبه‌ابزار آنلاین فارسی</footer>
      <BottomNav active={navActive === "calendar" ? "calendar" : "tools"} />
    </main>
  );
}
