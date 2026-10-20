"use client";
import { useState } from "react";
import FaqItem from "./FaqItem";

const FAQS = [
  { q: "مبدل تاریخ دست‌افزار چقدر دقیق است؟", a: "بر پایه الگوریتم رسمی جلالی (jalaali) — همان مبنای تقویم رسمی کشور، با تست روی مرز نوروز و سال‌های کبیسه." },
  { q: "ابزارها رایگان‌اند؟", a: "ابزارهای پایه همیشه رایگان‌اند. خروجی‌های تخصصی (مثل فاکتور بدون واترمارک) نسخه حرفه‌ای دارند." },
  { q: "نیاز به ثبت‌نام دارم؟", a: "نه. همه ابزارهای پایه بدون حساب کار می‌کنند و داده‌ای از شما ذخیره نمی‌شود." },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {FAQS.map((f, i) => (
        <FaqItem key={f.q} id={`faq-${i}`} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
      ))}
    </div>
  );
}
