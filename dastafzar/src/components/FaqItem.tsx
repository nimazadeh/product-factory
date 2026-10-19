"use client";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/** Accessible animated FAQ item (button + region, smooth height via grid-rows). */
export default function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="faq-item" data-open={open}>
      <button type="button" className="faq-q" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        <span>{q}</span><ChevronDown size={19} className="faq-chevron" aria-hidden="true" />
      </button>
      <div className="faq-a" id={id} role="region">
        <div><p>{a}</p></div>
      </div>
    </div>
  );
}
