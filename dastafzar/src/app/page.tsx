import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowLeftRight, Cake, MoveHorizontal, Hourglass, CalendarCheck2,
  FileText, Calculator, CalendarDays, Banknote, Type, Image as ImageIcon,
  Star, Zap, UserX, ShieldCheck, CalendarClock, ArrowLeft,
} from "lucide-react";
import Converter from "@/components/Converter";
import FaqAccordion from "@/components/FaqAccordion";
import NowruzPill from "@/components/NowruzPill";
import OccasionsStrip from "@/components/OccasionsStrip";
import BottomNav from "@/components/BottomNav";
import Reveal from "@/components/Reveal";
import CardSample from "@/components/CardSample";
import { TOOLS as TOOL_REGISTRY } from "@/lib/tools-data";

// Single source of truth: src/lib/tools-data.ts — a new tool is added THERE
// once and appears in the landing preview, /tools catalog and future nav.
const TOOL_ICONS: Record<string, ComponentType<{ size?: number | string; className?: string }>> = {
  "date-converter": ArrowLeftRight, "age-calculator": Cake, "date-difference": MoveHorizontal,
  "nowruz-countdown": Hourglass, "jalali-calendar": CalendarCheck2, "invoice-maker": FileText,
};

const CATS = [
  { Icon: CalendarDays, label: "تاریخ و تقویم", active: true },
  { Icon: FileText, label: "فاکتورساز", active: false },
  { Icon: Banknote, label: "مالی", active: false },
  { Icon: Type, label: "متن و عدد", active: false },
  { Icon: ImageIcon, label: "عکس", active: false },
  { Icon: Star, label: "محبوب‌ها", active: false },
];

// Trust strip: one hairline-divided row, no pills, no checkmarks — the clean
// replacement the user asked for instead of ticked chips.
const TRUST = [
  { Icon: Zap, label: "نتیجه فوری" },
  { Icon: UserX, label: "بدون ثبت‌نام" },
  { Icon: ShieldCheck, label: "بدون ذخیره داده" },
  { Icon: CalendarClock, label: "همیشه شمسی" },
];

export default function Home() {
  return (
    <main className="landing">
      <header className="topbar">
        <span className="brand"><span className="brand-mark">د</span> دست‌افزار</span>
        <nav aria-label="ناوبری اصلی">
          <Link href="/tools">ابزارها</Link><Link href="#why">چرا دست‌افزار</Link><Link href="#faq">پرسش‌ها</Link>
        </nav>
      </header>

      <nav className="cat-rail" aria-label="دسته‌بندی ابزارها">
        {CATS.map(({ Icon, label, active }) => (
          <Link key={label} href="/tools" className={`cat${active ? " is-active" : ""}`} aria-current={active ? "true" : undefined}>
            <span className="cat-circle"><Icon size={23} /></span>{label}
          </Link>
        ))}
      </nav>

      <section className="lvb-hero">
        <h1>هر تاریخ و تقویمی،<br />همین‌جا و همین حالا</h1>
        <p>مبدل، تقویم کامل شمسی با همه مناسبت‌ها، محاسبه سن — رایگان، بدون ثبت‌نام.</p>
        <div className="lvb-card"><Converter /></div>
        <NowruzPill />
        <div className="trust-bar" role="list" aria-label="ویژگی‌های دست‌افزار">
          {TRUST.map(({ Icon, label }) => (
            <span key={label} className="trust-item" role="listitem"><Icon size={17} aria-hidden />{label}</span>
          ))}
        </div>
      </section>

      <Reveal><section className="tools lvb-tools" aria-label="ابزارها">
        <div className="sec-head">
          <div>
            <h2>ابزارها</h2>
            <p className="sec-sub">نتیجه زنده روی هر کارت — رایگان و بدون ثبت‌نام</p>
          </div>
          <Link className="more-link" href="/tools">مشاهده همه ابزارها</Link>
        </div>
        <div className="lvb-strip">
          {TOOL_REGISTRY.map((t) => { const Icon = TOOL_ICONS[t.slug] ?? CalendarDays; return (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="lvb-item">
              <span className="lvb-icon"><Icon size={26} aria-hidden /></span>
              <strong>{t.title}</strong><small>{t.short}</small><CardSample slug={t.slug} />
            </Link> ); })}
        </div>
        <p className="tools-cta-row"><Link className="tools-cta" href="/tools">دیدن همه ابزارها <ArrowLeft size={16} aria-hidden /></Link></p>
      </section></Reveal>

      <Reveal><OccasionsStrip /></Reveal>

      <Reveal><section id="why" className="why">
        <h2>چرا دست‌افزار؟</h2>
        <ul>
          <li><strong>همیشه به تاریخ شمسی:</strong> دیگر لازم نیست برای هر تبدیل، اول میلادی‌اش را حدس بزنید — همه‌چیز از اول شمسی و فارسی است.</li>
          <li><strong>بدون ثبت‌نام و رایگان:</strong> وارد می‌شوید، استفاده می‌کنید، می‌روید. نه حساب می‌خواهد نه هزینه‌ای برای ابزارهای پایه.</li>
          <li><strong>خصوصی و سریع:</strong> محاسبه روی دستگاه خودتان انجام می‌شود؛ نه داده‌ای جایی می‌رود، نه منتظر سرور می‌مانید.</li>
          <li><strong>آماده اشتراک‌گذاری:</strong> نتیجه‌ها را همان‌جا کپی کنید یا برای خانواده و دوستان بفرستید — مثل شمارش معکوس نوروز.</li>
        </ul>
      </section></Reveal>

      <Reveal><section id="faq" className="faq">
        <h2>پرسش‌های پرتکرار</h2>
        <FaqAccordion />
      </section></Reveal>

      <footer className="footer">دست‌افزار — ساخته‌شده با دقت در Product Factory · داده‌ای از شما ذخیره نمی‌شود</footer>
      <BottomNav />
    </main>
  );
}
