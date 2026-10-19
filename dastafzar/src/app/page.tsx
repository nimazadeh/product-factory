import Converter from "@/components/Converter";

// TEMP (design exploration): direction preview needs the query string at request time.
// After the direction is chosen this + the .dir-switch bar are removed and the page goes fully static (SSG).
export const dynamic = "force-dynamic";

const TOOLS = [
  { icon: "⇄", name: "مبدل تاریخ", desc: "شمسی ↔ میلادی، آنی و دقیق", tag: "رایگان", live: true },
  { icon: "🎂", name: "محاسبه سن", desc: "سن دقیق به شمسی و میلادی", tag: "رایگان", live: false },
  { icon: "↔", name: "فاصله دو تاریخ", desc: "چند روز بین دو تاریخ است؟", tag: "رایگان", live: false },
  { icon: "🌱", name: "شمارش معکوس نوروز", desc: "تا بهار چند روز مانده؟", tag: "رایگان", live: false },
  { icon: "🧾", name: "فاکتورساز حرفه‌ای", desc: "فاکتور فارسی با خروجی تمیز", tag: "تخصصی", live: false },
  { icon: "🔢", name: "عدد به حروف", desc: "برای چک، قرارداد و فاکتور", tag: "به‌زودی", live: false },
];

export default async function Home({ searchParams }: { searchParams: Promise<{ dir?: string }> }) {
  const sp = await searchParams;
  const dir = ["a", "b", "c"].includes(sp.dir ?? "") ? sp.dir! : "a";
  return (
    <main className={`landing dir-${dir}`}>
      <header className="topbar">
        <span className="brand"><span className="brand-mark">د</span> دست‌افزار</span>
        <nav aria-label="ناوبری اصلی">
          <a href="#tools">ابزارها</a><a href="#why">چرا دست‌افزار</a><a href="#faq">پرسش‌ها</a>
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
            <article key={t.name} className="tool-card">
              <span className="tool-icon" aria-hidden="true">{t.icon}</span>
              <h3>{t.name}</h3><p>{t.desc}</p>
              <span className={`tool-tag ${t.tag === "تخصصی" ? "pro" : ""}`}>{t.tag}</span>
            </article>
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

      {/* direction preview switcher (design exploration — removed after choice) */}
      <div className="dir-switch" role="group" aria-label="پیش‌نمایش جهت‌های طراحی">
        <a href="/?dir=a" aria-current={dir === "a"}>الف: روشن خلوت</a>
        <a href="/?dir=b" aria-current={dir === "b"}>ب: تیره حرفه‌ای</a>
        <a href="/?dir=c" aria-current={dir === "c"}>ج: گرم کاغذی</a>
      </div>
    </main>
  );
}
