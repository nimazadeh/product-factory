"use client";
import { ChevronDown } from "lucide-react";

export default function FaqItem({ q, a, open, onToggle, id }: {
  q: string; a: string; open: boolean; onToggle: () => void; id: string;
}) {
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <h3 className="faq-q">
        <button type="button" id={`${id}-btn`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={onToggle}>
          <span>{q}</span>
          <ChevronDown size={18} className="faq-chev" aria-hidden />
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className="faq-panel" hidden={!open}>
        <div className="faq-panel-inner"><p>{a}</p></div>
      </div>
    </div>
  );
}
