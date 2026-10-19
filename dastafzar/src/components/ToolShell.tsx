import type { ReactNode } from "react";

export default function ToolShell({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <main className="landing">
      <header className="topbar">
        <a className="brand" href="/" style={{ textDecoration: "none" }}><span className="brand-mark">د</span> دست‌افزار</a>
        <nav aria-label="ناوبری اصلی"><a href="/#tools">همه ابزارها</a></nav>
      </header>
      <section className="tool-page">
        <h1>{title}</h1>
        <p className="hero-sub">{desc}</p>
        {children}
        <p className="hero-note">بدون ثبت‌نام · محاسبه روی دستگاه شما · بدون ذخیره داده</p>
      </section>
      <footer className="footer">دست‌افزار — جعبه‌ابزار آنلاین فارسی</footer>
    </main>
  );
}
