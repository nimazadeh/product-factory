"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="landing"><section className="tool-page" style={{ textAlign: "center" }}>
      <h1>یه مشکلی پیش اومد</h1>
      <p className="hero-sub">نگران نباشید، داده‌ای از دست نرفته. دوباره تلاش کنید؛ اگر درست نشد چند دقیقه دیگر برگردید.</p>
      <button type="button" className="btn-main" style={{ maxWidth: 260, margin: "18px auto" }} onClick={reset}>تلاش دوباره</button>
      <p><a href="/">بازگشت به صفحه اصلی</a></p>
    </section></main>
  );
}
