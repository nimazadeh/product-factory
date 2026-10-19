import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowLeftRight, Cake, MoveHorizontal, Hourglass, CalendarCheck2,
  FileText, Calculator, CalendarDays, Banknote, Type, Image as ImageIcon,
  Star, Zap, UserX, ShieldCheck, CalendarClock, ArrowLeft,
} from "lucide-react";
import Converter from "@/components/Converter";
import FaqItem from "@/components/FaqItem";
import NowruzPill from "@/components/NowruzPill";
import OccasionsStrip from "@/components/OccasionsStrip";
import BottomNav from "@/components/BottomNav";

interface Tool { Icon: ComponentType<{ size?: number | string; className?: string }>; name: string; href: string; desc: string; tag: string }
const TOOLS: Tool[] = [
  { Icon: ArrowLeftRight, name: "مبدل تاریخ", href: "/tools/date-converter", desc: "شمسی به میلادی و برعکس، با روز هفته", tag: "رایگان" },
  { Icon: Cake, name: "محاسبه سن", href: "/tools/age-calculator", desc: "سن دقیق به سال، ماه و روز + تولد بعدی", tag: "رایگان" },
  { Icon: MoveHorizontal, name: "فاصله دو تاریخ", href: "/tools/date-difference", desc: "چند روز بین دو تاریخ؟ روز، هفته و ماه", tag: "رایگان" },
  { Icon: Hourglass, name: "شمارش معکوس نوروز", href: "/tools/nowruz-countdown", desc: "روز و ساعت مانده تا لحظه تحویل سال", tag: "رایگان" },
  { Icon: FileText, name: "فاکتورساز حرفه‌ای", href: "#tools", desc: "فاکتور فارسی با خروجی تمیز برای چاپ", tag: "به‌زودی" },
  { Icon: Calculator, name: "عدد به حروف", href: "#tools", desc: "برای چک، قرارداد و فاکتور", tag: "به‌زودی" },
];

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
          <Link href="#tools">ابزارها</Link><Link href="#why">چرا دست‌افزار</Link><Link href="#faq">پرسش‌ها</Link>
        </nav>
      </header>

      <nav className="cat-rail" aria-label="دسته‌بندی ابزارها">
        {CATS.map(({ Icon, label, active }) => (
          <Link key={label} href="#tools" className={`cat${active ? " is-active" : ""}`} aria-current={active ? "true" : undefined}>
            <span className="cat-circle"><Icon size={23} /></span>{label}
          </Link>
        ))}
      </nav>

      <section className="hero hero-green">
        <div className="hero-main">
          <div className="hero-copy">
            <h1>ابزارهای فارسی، دقیق و فوری — <em>بدون ثبت‌نام، بدون هزینه</em></h1>
            <p className="hero-sub">تقویم شمسی تعاملی، تبدیل تاریخ، محاسبه سن و به‌زودی فاکتورساز؛ نتیجه همان لحظه روی همه دستگاه‌ها.</p>
          </div>
          <NowruzPill />
        </div>
        <div className="hero-converter">
          <Converter />
        </div>
        <div className="trust-bar" role="list" aria-label="ویژگی‌های دست‌افزار">
          {TRUST.map(({ Icon, label }) => (
            <span key={label} className="trust-item" role="listitem"><Icon size={17} aria-hidden />{label}</span>
          ))}
        </div>
      </section>

      <section className="flagship" aria-label="ابزار پرچم‌دار">
        <div className="sec-head">
          <div>
            <h2>ابزار پرچم‌دار</h2>
            <p className="sec-sub">کامل‌ترین ابزار دست‌افزار — پیشنهاد ما برای شروع</p>
          </div>
        </div>
        <Link href="/tools/jalali-calendar" className="flag-card">
          <span className="flag-icon"><CalendarCheck2 size={29} aria-hidden /></span>
          <span className="flag-body">
            <span className="flag-badge">پرچم‌دار</span>
            <span className="flag-title">تقویم شمسی تعاملی</span>
            <span className="flag-desc">ماه به ماه بگرد، روی هر روز بزن: معادل میلادی، فاصله از امروز و مناسبت‌ها همان‌جا می‌آیند.</span>
          </span>
          <span className="flag-cta">شروع</span>
        </Link>
      </section>

      <section id="tools" className="tools">
        <div className="sec-head">
          <div>
            <h2>ابزارها</h2>
            <p className="sec-sub">رایگان و بدون ثبت‌نام — نتیجه همان لحظه</p>
          </div>
          <Link className="more-link" href="#tools">مشاهده همه</Link>
        </div>
        <div className="tool-grid">
          {TOOLS.map(({ Icon, name, href, desc, tag }) => (
            <Link key={name} href={href} className="tool-card">
              <span className="tool-icon"><Icon size={25} aria-hidden /></span>
              <span className={`tool-tag ${tag === "به‌زودی" ? "pro" : ""}`}>{tag}</span>
              <h3>{name}</h3><p>{desc}</p>
              <span className="tool-go">شروع <ArrowLeft size={15} aria-hidden /></span>
            </Link>
          ))}
        </div>
      </section>

      <OccasionsStrip />

      <section id="why" className="why">
        <h2>چرا دست‌افزار؟</h2>
        <ul>
          <li><strong>همیشه به تاریخ شمسی:</strong> دیگر لازم نیست برای هر تبدیل، اول میلادی‌اش را حدس بزنید — همه‌چیز از اول شمسی و فارسی است.</li>
          <li><strong>بدون ثبت‌نام و رایگان:</strong> وارد می‌شوید، استفاده می‌کنید، می‌روید. نه حساب می‌خواهد نه هزینه‌ای برای ابزارهای پایه.</li>
          <li><strong>خصوصی و سریع:</strong> محاسبه روی دستگاه خودتان انجام می‌شود؛ نه داده‌ای جایی می‌رود، نه منتظر سرور می‌مانید.</li>
          <li><strong>آماده اشتراک‌گذاری:</strong> نتیجه‌ها را همان‌جا کپی کنید یا برای خانواده و دوستان بفرستید — مثل شمارش معکوس نوروز.</li>
        </ul>
      </section>

      <section id="faq" className="faq">
        <h2>پرسش‌های پرتکرار</h2>
        <FaqItem q="مبدل تاریخ دست‌افزار چقدر دقیق است؟" a="بر پایه الگوریتم رسمی جلالی (jalaali) — همان مبنای تقویم رسمی کشور، با تست روی مرز نوروز و سال‌های کبیسه." />
        <FaqItem q="ابزارها رایگان‌اند؟" a="ابزارهای پایه همیشه رایگان‌اند. خروجی‌های تخصصی (مثل فاکتور بدون واترمارک) نسخه حرفه‌ای دارند." />
        <FaqItem q="نیاز به ثبت‌نام دارم؟" a="نه. همه ابزارهای پایه بدون حساب کار می‌کنند و داده‌ای از شما ذخیره نمی‌شود." />
      </section>

      <footer className="footer">دست‌افزار — ساخته‌شده با دقت در Product Factory · داده‌ای از شما ذخیره نمی‌شود</footer>
      <BottomNav />
    </main>
  );
}
