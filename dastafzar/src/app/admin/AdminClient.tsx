"use client";
// Admin dashboard — phases: login / loading (skeleton) / ready / error.
// Skeleton + Empty patterns follow Skill 22 (shadcn system): a list must
// never render as a blank gap while loading or when it has no data.
import { useCallback, useEffect, useState } from "react";
import { BarChart3, CalendarPlus, Inbox, Loader2, LogOut, Mail, LockKeyhole, RefreshCw, TriangleAlert } from "lucide-react";
import { apiFetch, userMessage } from "@/lib/errors";
import { firstError, loginSchema, statsSchema, type Stats } from "@/lib/schemas";

const API = "";
const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="skel-stack" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => <span key={i} className="skel" style={{ width: `${92 - i * 14}%` }} />)}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="empty-state"><Inbox size={18} aria-hidden /> {text}</p>;
}

type Phase = "login" | "loading" | "ready" | "error";

export default function AdminClient() {
  const [phase, setPhase] = useState<Phase>("login");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [occ, setOcc] = useState({ title: "", month: 1, day: 1 });

  const load = useCallback(async (tk: string) => {
    setPhase("loading");
    try {
      const raw = await apiFetch<unknown>(`${API}/api-backend/admin/stats`, { headers: { Authorization: `Bearer ${tk}` } });
      const parsed = statsSchema.safeParse(raw);
      if (parsed.success) { setStats(parsed.data); setPhase("ready"); }
      else { console.error("stats shape", parsed.error); setErr("داده دریافتی از سرور ناقص بود."); setPhase("error"); }
    } catch (e) { setErr(userMessage(e)); setPhase("error"); }
  }, []);

  useEffect(() => {
    const tk = localStorage.getItem("dastafzar-admin") ?? "";
    if (tk) { setToken(tk); load(tk); }
  }, [load]);

  const login = async () => {
    setErr("");
    const v = loginSchema.safeParse({ email, password });
    if (!v.success) { setErr(firstError(v)); return; }
    setBusy(true);
    try {
      const d = await apiFetch<{ token: string }>(`${API}/api-backend/auth/login`, { method: "POST", body: JSON.stringify(v.data) });
      localStorage.setItem("dastafzar-admin", d.token); setToken(d.token); load(d.token);
    } catch (e) { setErr(userMessage(e)); } finally { setBusy(false); }
  };
  const logout = () => { localStorage.removeItem("dastafzar-admin"); location.reload(); };
  const authed = (init: RequestInit = {}) => ({ ...init, headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });

  if (phase === "loading") return (
    <main className="landing"><div className="admin-wrap" aria-busy="true" aria-label="در حال بارگذاری داشبورد">
      <header className="topbar"><span className="brand"><span className="brand-mark">د</span> داشبورد دست‌افزار</span></header>
      <div className="admin-grid">
        {[0, 1, 2, 3].map((i) => <div key={i} className="stat-card"><span className="skel skel-sm" /><strong className="skel skel-lg" /></div>)}
      </div>
      <section className="admin-panel"><Skeleton lines={5} /></section>
      <section className="admin-panel"><Skeleton lines={4} /></section>
    </div></main>
  );

  if (phase === "error") return (
    <main className="landing"><div className="login-box" role="alert">
      <p className="err-hero"><TriangleAlert size={30} aria-hidden /></p>
      <h1 style={{ textAlign: "center", marginTop: 0, fontSize: 19 }}>خطا در بارگذاری داشبورد</h1>
      <p className="err-msg" style={{ textAlign: "center" }}>{err || "ارتباط با سرور برقرار نشد."}</p>
      <button type="button" className="btn-main" onClick={() => token && load(token)}><RefreshCw size={17} aria-hidden /> تلاش دوباره</button>
      <button type="button" className="copy-btn" style={{ width: "100%", marginTop: 10 }} onClick={logout}>خروج و ورود دوباره</button>
    </div></main>
  );

  if (!token || !stats) return (
    <main className="landing"><div className="login-box">
      <h1 style={{ textAlign: "center", marginTop: 0 }}>داشبورد مدیریت دست‌افزار</h1>
      <form onSubmit={(e) => { e.preventDefault(); login(); }}>
        <div className="field">
          <label htmlFor="adm-email"><Mail size={15} aria-hidden /> ایمیل مدیر</label>
          <input id="adm-email" type="email" dir="ltr" autoComplete="username" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err} />
        </div>
        <div className="field">
          <label htmlFor="adm-pass"><LockKeyhole size={15} aria-hidden /> رمز عبور</label>
          <input id="adm-pass" type="password" dir="ltr" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!err} />
        </div>
        {err && <p className="err-msg" role="alert">{err}</p>}
        <button type="submit" className="btn-main" disabled={busy}>{busy ? <><Loader2 size={18} className="spin" aria-hidden /> در حال بررسی…</> : "ورود"}</button>
      </form>
    </div></main>
  );

  const maxDay = Math.max(1, ...Object.values(stats.daily));
  return (
    <main className="landing"><div className="admin-wrap">
      <header className="topbar"><span className="brand"><span className="brand-mark">د</span> داشبورد دست‌افزار</span>
        <button type="button" className="copy-btn" onClick={logout}><LogOut size={16} aria-hidden /> خروج</button></header>

      <div className="admin-grid">
        <div className="stat-card"><span>کل رویدادها</span><strong>{fa(stats.totalEvents)}</strong></div>
        <div className="stat-card"><span>۳۰ روز اخیر</span><strong>{fa(stats.last30)}</strong></div>
        <div className="stat-card"><span>پیام بازخورد باز</span><strong>{fa(stats.feedbackOpen)}</strong></div>
        <div className="stat-card"><span>ابزار فعال</span><strong>{fa(stats.tools.filter((t) => t.enabled).length)} از {fa(stats.tools.length)}</strong></div>
      </div>

      <section className="admin-panel"><h2><BarChart3 size={19} aria-hidden /> استفاده از ابزارها</h2>
        {stats.byTool.length === 0 ? <EmptyState text="هنوز رویدادی ثبت نشده است؛ به محض استفاده از ابزارها اینجا نمایش داده می‌شود." /> :
          stats.byTool.map((t) => (
            <div className="admin-row" key={t.tool}><span>{t.tool}</span>
              <span className="usage-track"><span className="usage-fill" style={{ width: `${Math.max(4, (t.count / Math.max(1, stats.byTool[0]?.count ?? 1)) * 100)}%` }} /></span>
              <strong>{fa(t.count)}</strong></div>
          ))}
        <h2 style={{ marginTop: 22 }}>روند روزانه (۳۰ روز)</h2>
        {Object.keys(stats.daily).length === 0 ? <EmptyState text="داده‌ای برای نمودار روزانه نیست." /> : (
          <div className="daily-chart" role="img" aria-label="نمودار میله‌ای استفاده روزانه">
            {Object.entries(stats.daily).sort().map(([d, c]) => <span key={d} title={`${d}: ${c}`} className="daily-bar" style={{ height: `${(c / maxDay) * 100}%` }} />)}
          </div>
        )}
      </section>

      <section className="admin-panel"><h2>روشن/خاموش ابزارها (بدون نیاز به انتشار تازه)</h2>
        {stats.tools.length === 0 ? <EmptyState text="ابزاری ثبت نشده است." /> :
          stats.tools.map((t) => (
            <div className="admin-row" key={t.slug}><span>{t.title} <small>({t.slug})</small></span>
              <button type="button" className={`switch ${t.enabled ? "on" : ""}`} aria-pressed={t.enabled} disabled={busy}
                onClick={async () => { setBusy(true); try { await fetch(`${API}/api-backend/admin/tools/${t.slug}`, authed({ method: "PATCH", body: JSON.stringify({ enabled: !t.enabled }) })); load(token); } finally { setBusy(false); } }}>
                {t.enabled ? "روشن" : "خاموش"}</button></div>
          ))}
      </section>

      <section className="admin-panel"><h2><CalendarPlus size={19} aria-hidden /> مناسبت‌های شمارش معکوس</h2>
        {stats.occasions.length === 0 ? <EmptyState text="مناسبتی ثبت نشده است؛ از فرم زیر اضافه کنید." /> :
          stats.occasions.map((o) => (
            <div className="admin-row" key={o.id}><span>{o.title} — {fa(o.month)}/{fa(o.day)}</span>
              <button type="button" className="copy-btn" onClick={async () => { await fetch(`${API}/api-backend/admin/occasions/${o.id}`, authed({ method: "DELETE" })); load(token); }}>حذف</button></div>
          ))}
        <div className="admin-row">
          <input className="mini-input" placeholder="نام مناسبت" value={occ.title} onChange={(e) => setOcc({ ...occ, title: e.target.value })} aria-label="نام مناسبت" />
          <input className="mini-input" type="number" min={1} max={12} value={occ.month} onChange={(e) => setOcc({ ...occ, month: +e.target.value })} aria-label="ماه شمسی" style={{ width: 90 }} />
          <input className="mini-input" type="number" min={1} max={31} value={occ.day} onChange={(e) => setOcc({ ...occ, day: +e.target.value })} aria-label="روز شمسی" style={{ width: 90 }} />
          <button type="button" className="copy-btn" disabled={!occ.title} onClick={async () => { if (!occ.title) return; await fetch(`${API}/api-backend/admin/occasions`, authed({ method: "POST", body: JSON.stringify(occ) })); setOcc({ title: "", month: 1, day: 1 }); load(token); }}>افزودن</button>
        </div>
      </section>

      <section className="admin-panel"><h2>آخرین رویدادها</h2>
        {stats.recent.length === 0 ? <EmptyState text="رویدادی برای نمایش نیست." /> : (
          <table className="admin-table"><thead><tr><th>ابزار</th><th>رویداد</th><th>زمان</th></tr></thead>
            <tbody>{stats.recent.map((r) => <tr key={r.id}><td>{r.tool}</td><td>{r.action}</td><td dir="ltr">{new Date(r.createdAt).toLocaleString("fa-IR")}</td></tr>)}</tbody></table>
        )}
      </section>
    </div></main>
  );
}
