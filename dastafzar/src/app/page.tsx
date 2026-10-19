import Link from "next/link";
import Converter from "@/components/Converter";


const TOOLS = [
  { icon: "⇄", name: "مبدل تاریخ", href: "/tools/date-converter", desc: "شمسی ↔ میلادی، آنی و دقیق", tag: "رایگان", live: true },
  { icon: "🎂", name: "محاسبه سن", href: "/tools/age-calculator", desc: "سن دقیق به شمسی و میلادی", tag: "رایگان", live: false },
  { icon: "↔", name: "فاصله دو تاریخ", href: "/tools/date-difference", desc: "چند روز بین دو تاریخ است؟", tag: "رایگان", live: false },
  { icon: "🌱", name: "شمارش معکوس نوروز", href: "/tools/nowruz-countdown", desc: "تا بهار چند روز مانده؟", tag: "رایگان", live: false },
  { icon: "🧾", name: "فاکتورساز حرفه‌ای", href: "#tools", desc: "فاکتور فارسی با خروجی تمیز", tag: "تخصصی", live: false },
  { icon: "🔢", name: "عدد به حروف", href: "#tools", desc: "برای چک، قرارداد و فاکتور", tag: "به‌زودی", live: false },
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

      <section className="hero">
        <h1>هر کاری، یه ابزارش <em>اینجاست</em></h1>
        <p className="hero-sub">جعبه‌ابزار آنلاین فارسی — سریع، تمیز و بدون ثبت‌نام. تاریخ، حساب‌وکتاب و سند؛ همه به شمسی و فارسی.</p>
        <Converter />
        <p className="hero-note">بدون ثبت‌نام · بدون آپلود فایل · نتیجه در همان لحظه</p>
      </section>

      <section id="tools" className="tools">
        <h2>ابزارها</h2>
        <div className="tool-grid">
          {TOOLS.map((t) => (
            <Link key={t.name} href={t.href} className="tool-card">
              <span className="tool-icon" aria-hidden="true">{t.icon}</span>
              <h3>{t.name}</h3><p>{t.desc}</p>
              <span className={`tool-tag ${t.tag === "تخصصی" ? "pro" : ""}`}>{t.tag}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="why" className="why">
        <h2>چرا دست‌افزار؟</h2>
        <ul>
          <li><strong>فارسیِ واقعی:</strong> تقویم شمسی جلالی، اعداد فارسی، راست‌چین اصولی — نه ترجمه ماشینی.</li>
          <li><strong>حریم خصوصی:</strong> محاسبه روی دستگاه خودتان؛ چیزی آپلود نمی‌شود.</li>
          <li><strong>کیفیت سازمانی:</strong> هر ابزار تست و ممیزی می‌شود؛ تبلیغات هرگز وسط ابزار نیست.</li>
        </ul>
      </section>

      <section id="faq" className="faq">
        <h2>پرسش‌های پرتکرار</h2>
        <details><summary>مبدل تاریخ دست‌افزار چقدر دقیق است؟</summary><p>بر پایه الگوریتم رسمی جلالی (jalaali) — همان مبنای تقویم رسمی کشور، با تست‌های واحد روی مرز نوروز و سال‌های کبیسه.</p></details>
        <details><summary>ابزارها رایگان‌اند؟</summary><p>ابزارهای پایه همیشه رایگان‌اند. خروجی‌های تخصصی (مثل فاکتور بدون واترمارک) نسخه حرفه‌ای دارند.</p></details>
        <details><summary>نیاز به ثبت‌نام دارم؟</summary><p>نه. همه ابزارهای پایه بدون حساب کار می‌کنند.</p></details>
      </section>

      <footer className="footer">دست‌افزار — ساخته‌شده با دقت در Product Factory · داده‌ای از شما ذخیره نمی‌شود</footer>
    </main>
  );
}
