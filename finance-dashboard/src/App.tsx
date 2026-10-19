import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Bell, Home, ListFilter, Lock, Pencil, PiggyBank, Plus, Search, Sparkles, Trash2, TrendingDown, ChartPie, Settings } from "lucide-react";
import type { Period, Transaction } from "./lib/types";
import { BUDGETS } from "./lib/types";
import { SEED } from "./lib/seed";
import { byCategory, dailySeries, dateFa, fmt, fmtShort, fmtToman, inPeriod, sum, PERIOD_LABEL, daysInPeriod } from "./lib/money";
import { BudgetRing, CategoryBars, TrendChart } from "./components/Charts";
import TxForm from "./components/TxForm";
import Select from "./components/Select";
import { ConfirmDialog, Toasts, type ToastData } from "./components/Feedback";
import Pagination from "./components/Pagination";
import { Empty, EmptySearch, ErrorBox, Locked, Skeleton } from "./components/States";

const KEY="jibeto-tx-v1";
type View="home"|"tx"|"budget"|"more";
export default function App(){
  const [loading,setLoading]=useState(true); const [error,setError]=useState(false); const [locked,setLocked]=useState(false);
  const [txs,setTxs]=useState<Transaction[]>(()=>{ try{ const r=localStorage.getItem(KEY); return r?JSON.parse(r) as Transaction[]:SEED; }catch{ return SEED; }});
  const [period,setPeriod]=useState<Period>("month"); const [view,setView]=useState<View>("home"); const [formOpen,setFormOpen]=useState(false); const [editing,setEditing]=useState<Transaction|null>(null);
  const [query,setQuery]=useState(""); const [catFilter,setCatFilter]=useState("همه"); const [toasts,setToasts]=useState<ToastData[]>([]);
  const [pendingDelete,setPendingDelete]=useState<Transaction|null>(null);
  const [page,setPage]=useState(1); const [pageSize,setPageSize]=useState(10);
  useEffect(()=>{ const id=setTimeout(()=>setLoading(false),650); return ()=>clearTimeout(id); },[]);
  useEffect(()=>{ try{ localStorage.setItem(KEY,JSON.stringify(txs)); }catch{ setError(true); } },[txs]);
  useEffect(()=>{ setPage(1); },[catFilter,query,period,view]);
  const pushToast=(text:string,kind:ToastData["kind"]="success")=>{ const id=Date.now()+Math.random(); setToasts(p=>[...p.slice(-2),{id,kind,text}]); setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),4200); };

  const cur=useMemo(()=>txs.filter(t=>inPeriod(t,period,0)),[txs,period]);
  const prev=useMemo(()=>txs.filter(t=>inPeriod(t,period,1)),[txs,period]);
  const income=sum(cur,"income"), expense=sum(cur,"expense"), prevExpense=sum(prev,"expense");
  const balance=useMemo(()=>sum(txs,"income")-sum(txs,"expense"),[txs]);
  const cats=useMemo(()=>byCategory(cur),[cur]); const series=useMemo(()=>dailySeries(txs.filter(t=>inPeriod(t,period,0)||period!=="day"),period),[txs,period]);
  const change=prevExpense?((expense-prevExpense)/prevExpense)*100:0;
  const dailyAvg=expense/Math.max(1,daysInPeriod(period));
  const topCat=cats[0];
  const filtered=useMemo(()=>cur.filter(t=>(catFilter==="همه"||t.category===catFilter)&&(t.title.includes(query)||t.category.includes(query))).sort((a,b)=>b.date.localeCompare(a.date)),[cur,query,catFilter]);
  useEffect(()=>{ const maxPage=Math.max(1,Math.ceil(filtered.length/pageSize)); if(page>maxPage) setPage(maxPage); },[filtered.length,page,pageSize]);

  const add=(tx:Transaction)=>{ setTxs(p=>[tx,...p]); setFormOpen(false); pushToast(tx.type==="income"?"درآمد ثبت شد":"تراکنش ثبت شد"); };
  const remove=(tx:Transaction)=>setPendingDelete(tx);
  const confirmRemove=()=>{ if(!pendingDelete) return; setTxs(p=>p.filter(t=>t.id!==pendingDelete.id)); setPendingDelete(null); pushToast("تراکنش حذف شد","info"); };
  if(locked) return <Locked onUnlock={()=>setLocked(false)}/>;

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><img src="/logo.svg" alt="" width="40" height="40" className="brand-logo"/><strong>جیبتو</strong></div>
      <nav aria-label="ناوبری اصلی">
        <button className={view==="home"?"active":""} onClick={()=>setView("home")}><Home/>داشبورد</button>
        <button className={view==="tx"?"active":""} onClick={()=>setView("tx")}><ListFilter/>تراکنش‌ها</button>
        <button className={view==="budget"?"active":""} onClick={()=>setView("budget")}><ChartPie/>بودجه‌ها</button>
        <button className={view==="more"?"active":""} onClick={()=>setView("more")}><Settings/>بیشتر</button>
      </nav>
      <button className="btn-primary side-add" onClick={()=>{setEditing(null);setFormOpen(true);}}><Plus/>ثبت تراکنش</button>
      <button className="ghost" onClick={()=>setLocked(true)}><Lock/>قفل حریم خصوصی</button>
    </aside>

    <main className="main" id="main">
      <header className="topbar">
        <div><p className="date">{new Intl.DateTimeFormat("fa-IR",{weekday:"long",day:"numeric",month:"long"}).format(new Date())}</p><h1>{view==="home"?"داشبورد مالی":view==="tx"?"تراکنش‌ها":view==="budget"?"بودجه‌ها":"بیشتر"}</h1></div>
        <div className="top-actions"><button className="iconbtn" aria-label="اعلان‌ها"><Bell/></button><button className="iconbtn only-mobile" onClick={()=>setLocked(true)} aria-label="قفل کردن"><Lock/></button><span className="avatar" aria-label="حساب کاربری شخصی">ش</span></div>
      </header>

      {loading ? <Skeleton/> : error ? <ErrorBox onRetry={()=>{setError(false);setLoading(true);setTimeout(()=>setLoading(false),500);}}/> : <>
      {(view==="home"||view==="tx") && <>
      <section className="hero" aria-labelledby="bal-label">
        <div><p id="bal-label">موجودی کل</p><div className="balance num">{fmtToman(balance)}</div>
          <p className="hero-sub"><span className="inc"><ArrowDownLeft size={16}/>درآمد {PERIOD_LABEL[period]}: {fmtShort(income)}</span><span className="exp"><ArrowUpRight size={16}/>هزینه: {fmtShort(expense)}</span></p>
          <BudgetRing used={byCategory(txs.filter(t=>inPeriod(t,"month",0))).filter(c=>BUDGETS.some(b=>b.category===c.category)).reduce((a,c)=>a+c.total,0)} total={BUDGETS.reduce((a,b)=>a+b.limit,0)} label="بودجه دسته‌ها"/></div>
        <div className="seg period" role="group" aria-label="بازه زمانی">
          {(["day","week","month"] as Period[]).map(p=><button key={p} aria-pressed={period===p} className={period===p?"on":""} onClick={()=>setPeriod(p)}>{p==="day"?"روز":p==="week"?"هفته":"ماه"}</button>)}
        </div>
      </section>

      <section className="kpis" aria-label="شاخص‌های دوره">
        <article className="kpi"><span>هزینه {PERIOD_LABEL[period]}</span><strong className="num">{fmtToman(expense)}</strong><small className={change<=0?"good":"bad"}><TrendingDown size={14}/>{prevExpense?`${fmt(Math.abs(change))}٪ ${change<=0?"کمتر":"بیشتر"} از دوره قبل`:"دوره قبلی برای مقایسه نیست"}</small></article>
        <article className="kpi"><span>میانگین هزینه روزانه</span><strong className="num">{fmtToman(dailyAvg)}</strong><small>در {PERIOD_LABEL[period]}</small></article>
        <article className="kpi"><span>نرخ پس‌انداز این دوره</span><strong className="num">{income?fmt(Math.round((income-expense)/income*100))+"٪":"—"}</strong><small><PiggyBank size={14}/>از درآمد دوره</small></article>
      </section>
      </>}

      {view==="home" && <>
        <section className="panel"><div className="panel-head"><h2>روند هزینه</h2><span className="muted">{PERIOD_LABEL[period]}</span></div>
          {cur.length? <TrendChart data={period==="day"?[{label:"امروز",expense,income}]:series}/> : <Empty title="هنوز تراکنشی نیست" body="اولین تراکنش‌تان را ثبت کنید تا روند هزینه اینجا نمایش داده شود." action={<button className="btn-primary sm" onClick={()=>{setEditing(null);setFormOpen(true);}}>ثبت تراکنش</button>}/>}
        </section>
        <div className="grid2">
          <section className="panel"><div className="panel-head"><h2>هزینه بر اساس دسته</h2></div>{cats.length?<CategoryBars items={cats}/>:<Empty title="داده‌ای نیست" body="در این بازه هزینه‌ای ثبت نشده است."/>}</section>
          <section className="panel insight"><div className="panel-head"><h2><Sparkles size={18}/> بینش هوشمند</h2></div>
            {topCat ? <ul className="insights">
              <li>بیشترین هزینه شما در <strong>{topCat.category}</strong> بوده: <span className="num">{fmtToman(topCat.total)}</span> ({fmt(expense?topCat.total/expense*100:0)}٪ کل هزینه)</li>
              <li>{change<=0?<>نسبت به دوره قبل <strong className="good">{fmt(Math.abs(change))}٪ کمتر</strong> خرج کرده‌اید. آفرین!</>:<>نسبت به دوره قبل <strong className="bad">{fmt(Math.abs(change))}٪ بیشتر</strong> خرج کرده‌اید؛ دسته {topCat.category} را بررسی کنید.</>}</li>
              <li>با میانگین فعلی، هزینه ماهانه‌تان حدود <span className="num">{fmtToman(dailyAvg*30)}</span> می‌شود.</li>
            </ul>:<Empty title="بینشی نداریم" body="با ثبت چند تراکنش، تحلیل هوشمند اینجا ساخته می‌شود."/>}
          </section>
        </div>
        <section className="panel"><div className="panel-head"><h2>جیب‌های من</h2><span className="muted">سهم هر دسته از هزینه این دوره</span></div>
          {cats.length ? <div className="pockets">{cats.slice(0,4).map(c=>(<article key={c.category} className="pocket"><span className="pocket-name">{c.category}</span><strong className="num">{fmtToman(c.total)}</strong><span className="pocket-pct num">{fmt(expense?c.total/expense*100:0)}٪ از هزینه دوره</span><span className="catbars-track"><span className="catbars-fill" style={{width:`${expense?c.total/expense*100:0}%`}}/></span></article>))}</div> : <Empty title="جیبی نداریم" body="با ثبت اولین هزینه، جیب‌های دسته‌بندی اینجا ساخته می‌شوند."/>}
        </section>
        <Recent txs={filtered.slice(0,5)} onDelete={remove} onEdit={(tx)=>{setEditing(tx);setFormOpen(true);}} onSeeAll={()=>setView("tx")}/>
      </>}

      {view==="tx" && <section className="panel">
        <div className="filters"><label className="search"><Search size={18}/><span className="sr-only">جستجو در تراکنش‌ها</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="جستجو…" type="search"/></label>
        <div className="field"><Select ariaLabel="فیلتر دسته‌بندی" value={catFilter} onChange={setCatFilter} options={["همه","درآمد",...new Set(txs.map(t=>t.category))]}/></div></div>
        {txs.length===0?<Empty title="هنوز تراکنشی ثبت نکرده‌اید" body="با دکمه + اولین درآمد یا هزینه‌تان را ثبت کنید." action={<button className="btn-primary sm" onClick={()=>{setEditing(null);setFormOpen(true);}}>ثبت اولین تراکنش</button>}/>
        : filtered.length===0?<EmptySearch/>:<>
          <TxList txs={filtered.slice((page-1)*pageSize,page*pageSize)} onDelete={remove} onEdit={(tx)=>{setEditing(tx);setFormOpen(true);}}/>
          <Pagination page={page} pages={Math.max(1,Math.ceil(filtered.length/pageSize))} total={filtered.length} pageSize={pageSize} onPage={setPage} onPageSize={(n)=>{setPageSize(n);setPage(1);}}/>
        </>}
      </section>}

      {(view==="budget"||view==="home") && view==="budget" && <section className="panel"><h2>بودجه ماهانه</h2><div className="budgets">
        {BUDGETS.map(b=>{ const spent=byCategory(txs.filter(t=>inPeriod(t,"month",0))).find(c=>c.category===b.category)?.total??0; const pct=Math.min(100,spent/b.limit*100); const over=spent>b.limit;
          return <article key={b.category} className="budget"><div className="budget-head"><strong>{b.category}</strong><span className="num">{fmtShort(spent)} از {fmtShort(b.limit)}</span></div>
          <div className="track" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`بودجه ${b.category}`}><span style={{width:`${pct}%`}} className={over?"over":pct>80?"warn":""}/></div>
          <p className={over?"bad":"muted"}>{over?`بودجه تمام شده! ${fmtShort(spent-b.limit)} بیشتر خرج شده است.`:`${fmt(100-pct)}٪ از بودجه باقی مانده است.`}</p></article>;})}
      </div></section>}

      {view==="more" && <section className="panel stack-sm">
        <h2>بیشتر</h2>
        <button className="rowbtn" onClick={()=>setLocked(true)}><Lock/>قفل حریم خصوصی</button>
        <button className="rowbtn" onClick={()=>{ if(confirm("همه تراکنش‌ها پاک و داده نمونه برگردد؟")){ setTxs(SEED); pushToast("داده نمونه بازیابی شد","info"); }}}><Trash2/>بازیابی داده نمونه</button>
        <p className="muted">جیبتو نسخه تک‌کاربره و Local-First است؛ داده‌ها فقط روی همین دستگاه ذخیره می‌شوند و حسابی ساخته نمی‌شود.</p>
      </section>}
      </>}
    </main>

    <button className="fab" onClick={()=>{setEditing(null);setFormOpen(true);}} aria-label="ثبت تراکنش جدید"><Plus/></button>
    <nav className="bottomnav" aria-label="ناوبری موبایل">
      <button className={view==="home"?"active":""} onClick={()=>setView("home")}><Home/>داشبورد</button>
      <button className={view==="tx"?"active":""} onClick={()=>setView("tx")}><ListFilter/>تراکنش‌ها</button>
      <button className={view==="budget"?"active":""} onClick={()=>setView("budget")}><ChartPie/>بودجه</button>
      <button className={view==="more"?"active":""} onClick={()=>setView("more")}><Settings/>بیشتر</button>
    </nav>
    <TxForm open={formOpen} editing={editing} onClose={()=>{setFormOpen(false);setEditing(null);}} onAdd={add} onUpdate={(tx)=>{ setTxs(p=>p.map(t=>t.id===tx.id?tx:t)); setFormOpen(false); setEditing(null); pushToast("تراکنش ویرایش شد"); }}/>
    <Toasts items={toasts} dismiss={(id)=>setToasts(p=>p.filter(t=>t.id!==id))}/>
    {pendingDelete && <ConfirmDialog title="این تراکنش حذف شود؟" body={`«${pendingDelete.title}» به مبلغ ${fmtToman(pendingDelete.amount)} برای همیشه حذف می‌شود و قابل برگشت نیست.`} confirmLabel="بله، حذف شود" onConfirm={confirmRemove} onCancel={()=>setPendingDelete(null)}/>}
  </div>;
}
function Recent({txs,onDelete,onEdit,onSeeAll}:{txs:Transaction[];onDelete(tx:Transaction):void;onEdit(tx:Transaction):void;onSeeAll():void}){
  return <section className="panel"><div className="panel-head"><h2>تراکنش‌های اخیر</h2><button className="link" onClick={onSeeAll}>مشاهده همه</button></div>
  {txs.length?<TxList txs={txs} onDelete={onDelete} onEdit={onEdit}/>:<EmptySearch/>}</section>;
}
export function TxList({txs,onDelete,onEdit}:{txs:Transaction[];onDelete(tx:Transaction):void;onEdit(tx:Transaction):void}){
  return <ul className="txlist">{txs.map(t=><li key={t.id}>
    <span className={`tx-ic ${t.type}`}>{t.type==="income"?<ArrowDownLeft size={18}/>:<ArrowUpRight size={18}/>}</span>
    <span className="tx-main"><strong>{t.title}</strong><small>{t.category} · {dateFa(t.date)}</small></span>
    <span className={`num tx-amt ${t.type}`}>{t.type==="income"?"+":"−"} {fmt(t.amount)}</span>
    <button className="iconbtn ghostic" onClick={()=>onEdit(t)} aria-label={`ویرایش ${t.title}`}><Pencil size={18}/></button><button className="iconbtn danger" onClick={()=>onDelete(t)} aria-label={`حذف ${t.title}`}><Trash2 size={18}/></button></li>)}</ul>;
}
