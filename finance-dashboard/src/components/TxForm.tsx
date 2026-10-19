import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, type Transaction, type TxType } from "../lib/types";
import Select from "./Select";
import JalaliDatePicker from "./JalaliDatePicker";
interface Props { open: boolean; editing?: Transaction | null; onClose(): void; onAdd(tx: Transaction): void; onUpdate?(tx: Transaction): void }
export default function TxForm({open,editing,onClose,onAdd,onUpdate}:Props){
  const [type,setType]=useState<TxType>("expense"); const [title,setTitle]=useState(""); const [amount,setAmount]=useState(""); const [category,setCategory]=useState<string>("خوراک"); const [date,setDate]=useState(()=>new Date().toISOString().slice(0,10)); const [err,setErr]=useState("");
  const firstRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{ if(open){ setErr(""); if(editing){ setType(editing.type); setTitle(editing.title); setAmount(String(editing.amount)); setCategory(editing.category); setDate(editing.date);} else { setType("expense"); setTitle(""); setAmount(""); setCategory("خوراک"); setDate(new Date().toISOString().slice(0,10)); } setTimeout(()=>firstRef.current?.focus(),50);} },[open,editing]);
  if(!open) return null;
  const submit=(e:React.FormEvent)=>{ e.preventDefault(); const amt=Number(amount.replace(/[^\d]/g,""));
    if(title.trim().length<2) return setErr("عنوان باید حداقل ۲ حرف باشد.");
    if(!amt||amt<=0) return setErr("مبلغ باید بزرگ‌تر از صفر باشد.");
    if(!date) return setErr("تاریخ را انتخاب کنید.");
    const tx:Transaction={id:editing?.id ?? crypto.randomUUID(),title:title.trim(),amount:amt,type,category:type==="income"?"درآمد":category,date}; if(editing && onUpdate) onUpdate(tx); else onAdd(tx); };
  return <div className="overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="txform-title">
      <div className="sheet-head"><h2 id="txform-title">{editing?"ویرایش تراکنش":"ثبت تراکنش"}</h2><button className="iconbtn" onClick={onClose} aria-label="بستن فرم"><X/></button></div>
      <form onSubmit={submit} noValidate>
        <div className="seg" role="group" aria-label="نوع تراکنش">
          <button type="button" aria-pressed={type==="expense"} className={type==="expense"?"on-expense":""} onClick={()=>setType("expense")}>هزینه</button>
          <button type="button" aria-pressed={type==="income"} className={type==="income"?"on-income":""} onClick={()=>setType("income")}>درآمد</button>
        </div>
        <label>عنوان<input ref={firstRef} value={title} onChange={e=>setTitle(e.target.value)} placeholder="مثلاً سوپرمارکت" autoComplete="off"/></label>
        <label>مبلغ (تومان)<input inputMode="numeric" dir="ltr" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="250000" aria-describedby={err?"form-err":undefined}/></label>
        {type==="expense" && <div className="field"><label id="cat-label">دسته‌بندی</label><Select ariaLabel="دسته‌بندی" value={category} onChange={setCategory} options={[...CATEGORIES]}/></div>}
        <div className="field"><label>تاریخ</label><JalaliDatePicker ariaLabel="تاریخ تراکنش" value={date} onChange={setDate}/></div>
        {err && <p className="form-err" id="form-err" role="alert">{err}</p>}
        <button className="btn-primary" type="submit">{editing?"ذخیره ویرایش":"ثبت تراکنش"}</button>
      </form>
    </div></div>;
}
