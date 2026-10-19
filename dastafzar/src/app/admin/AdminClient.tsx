"use client";
import { useEffect, useState } from "react";

const API = "";
const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

interface Stats {
  totalEvents: number; last30: number; feedbackOpen: number;
  byTool: { tool: string; count: number }[];
  daily: Record<string, number>;
  occasions: { id: string; title: string; month: number; day: number; enabled: boolean }[];
  tools: { slug: string; title: string; enabled: boolean }[];
  recent: { id: string; tool: string; action: string; createdAt: string }[];
}

export default function AdminClient() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [occ, setOcc] = useState({ title: "", month: 1, day: 1 });

  const load = async (tk: string) => {
    const r = await fetch(`${API}/api-backend/admin/stats`, { headers: { Authorization: `Bearer ${tk}` } });
    if (r.ok) setStats(await r.json());
  };
  useEffect(() => { const tk = localStorage.getItem("dastafzar-admin") ?? ""; if (tk) { setToken(tk); load(tk); } }, []);

  const login = async () => {
    setErr("");
    const r = await fetch(`${API}/api-backend/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.message ?? "ورود ناموفق"); return; }
    localStorage.setItem("dastafzar-admin", d.token); setToken(d.token); load(d.token);
  };
  const authed = (init: RequestInit = {}) => ({ ...init, headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });

  if (!token || !stats) return (
    <main className="landing"><div className="login-box">
      <h1 style={{ textAlign: "center", marginTop: 0 }}>داشبورد مدیریت دست‌افزار</h1>
      <input type="email" dir="ltr" placeholder="ایمیل مدیر" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="ایمیل مدیر" />
      <input type="password" dir="ltr" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="رمز عبور" />
      <button type="button" className="btn-main" onClick={login}>ورود</button>
      {err && <p className="err-msg" role="alert">{err}</p>}
    </div></main>
  );

  const maxDay = Math.max(1, ...Object.values(stats.daily));
  return (
    <main className="landing"><div className="admin-wrap">
      <header className="topbar"><span className="brand"><span className="brand-mark">د</span> داشبورد دست‌افزار</span>
        <button type="button" className="copy-btn" onClick={() => { localStorage.removeItem("dastafzar-admin"); location.reload(); }}>خروج</button></header>

      <div className="admin-grid">
        <div className="stat-card"><span>کل رویدادها</span><strong>{fa(stats.totalEvents)}</strong></div>
        <div className="stat-card"><span>۳۰ روز اخیر</span><strong>{fa(stats.last30)}</strong></div>
        <div className="stat-card"><span>پیام بازخورد باز</span><strong>{fa(stats.feedbackOpen)}</strong></div>
        <div className="stat-card"><span>ابزار فعال</span><strong>{fa(stats.tools.filter((t) => t.enabled).length)} از {fa(stats.tools.length)}</strong></div>
      </div>

      <section className="admin-panel"><h2>استفاده از ابزارها</h2>
        {stats.byTool.map((t) => (
          <div className="admin-row" key={t.tool}><span>{t.tool}</span>
            <span style={{ flex: 1, background: "var(--bg)", borderRadius: 99, height: 10, margin: "0 12px" }}>
              <span style={{ display: "block", height: 10, borderRadius: 99, background: "var(--primary)", width: `${Math.max(4, (t.count / Math.max(1, stats.byTool[0]?.count ?? 1)) * 100)}%` }} /></span>
            <strong>{fa(t.count)}</strong></div>
        ))}
        <h2 style={{ marginTop: 22 }}>روند روزانه (۳۰ روز)</h2>
        <div style={{ display: "flex", gap: 3, alignItems: "end", height: 90 }} role="img" aria-label="نمودار میله‌ای استفاده روزانه">
          {Object.entries(stats.daily).sort().map(([d, c]) => <span key={d} title={`${d}: ${c}`} style={{ flex: 1, background: "var(--primary)", borderRadius: 3, height: `${(c / maxDay) * 100}%`, minHeight: 3 }} />)}
        </div>
      </section>

      <section className="admin-panel"><h2>روشن/خاموش ابزارها (بدون نیاز به انتشار تازه)</h2>
        {stats.tools.map((t) => (
          <div className="admin-row" key={t.slug}><span>{t.title} <small>({t.slug})</small></span>
            <button type="button" className={`switch ${t.enabled ? "on" : ""}`} aria-pressed={t.enabled}
              onClick={async () => { await fetch(`${API}/api-backend/admin/tools/${t.slug}`, authed({ method: "PATCH", body: JSON.stringify({ enabled: !t.enabled }) })); load(token); }}>
              {t.enabled ? "روشن" : "خاموش"}</button></div>
        ))}
      </section>

      <section className="admin-panel"><h2>مناسبت‌های شمارش معکوس</h2>
        {stats.occasions.map((o) => (
          <div className="admin-row" key={o.id}><span>{o.title} — {fa(o.month)}/{fa(o.day)}</span>
            <button type="button" className="copy-btn" onClick={async () => { await fetch(`${API}/api-backend/admin/occasions/${o.id}`, authed({ method: "DELETE" })); load(token); }}>حذف</button></div>
        ))}
        <div className="admin-row">
          <input className="mini-input" placeholder="نام مناسبت" value={occ.title} onChange={(e) => setOcc({ ...occ, title: e.target.value })} aria-label="نام مناسبت" />
          <input className="mini-input" type="number" min={1} max={12} value={occ.month} onChange={(e) => setOcc({ ...occ, month: +e.target.value })} aria-label="ماه شمسی" style={{ width: 90 }} />
          <input className="mini-input" type="number" min={1} max={31} value={occ.day} onChange={(e) => setOcc({ ...occ, day: +e.target.value })} aria-label="روز شمسی" style={{ width: 90 }} />
          <button type="button" className="copy-btn" onClick={async () => { if (!occ.title) return; await fetch(`${API}/api-backend/admin/occasions`, authed({ method: "POST", body: JSON.stringify(occ) })); setOcc({ title: "", month: 1, day: 1 }); load(token); }}>افزودن</button>
        </div>
      </section>

      <section className="admin-panel"><h2>آخرین رویدادها</h2>
        <table className="admin-table"><thead><tr><th>ابزار</th><th>رویداد</th><th>زمان</th></tr></thead>
          <tbody>{stats.recent.map((r) => <tr key={r.id}><td>{r.tool}</td><td>{r.action}</td><td dir="ltr">{new Date(r.createdAt).toLocaleString("fa-IR")}</td></tr>)}</tbody></table>
      </section>
    </div></main>
  );
}
