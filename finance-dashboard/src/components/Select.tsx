import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface Props {
  value: string;
  onChange(value: string): void;
  options: string[];
  ariaLabel: string;
  id?: string;
}

/** Custom accessible Select — replaces raw <select>: inset chevron (14px) that rotates
    180deg on open, animated listbox, full keyboard model (arrows/Enter/Esc/typeahead). */
export default function Select({ value, onChange, options, ariaLabel, id }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listId = `${id ?? ariaLabel}-listbox`;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open ]);

  const choose = (i: number) => { onChange(options[i]); setOpen(false); btnRef.current?.focus(); };
  const openList = () => { setActive(Math.max(0, options.indexOf(value))); setOpen(true); };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openList(); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); btnRef.current?.focus(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(options.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(active); }
    else if (e.key === "Tab") setOpen(false);
    else if (e.key.length === 1) {
      const i = options.findIndex(o => o.startsWith(e.key));
      if (i >= 0) setActive(i);
    }
  };

  return (
    <div className="select" ref={rootRef}>
      <button type="button" id={id} ref={btnRef} className="select-btn" aria-haspopup="listbox"
        aria-expanded={open} aria-label={ariaLabel} aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openList())} onKeyDown={onKey}>
        <span>{value}</span>
        <ChevronDown size={20} className={`select-chevron${open ? " open" : ""}`} aria-hidden />
      </button>
      {open && (
        <ul className="select-list" role="listbox" id={listId} aria-label={ariaLabel}>
          {options.map((o, i) => (
            <li key={o} role="option" aria-selected={o === value}
              className={`select-item${i === active ? " active" : ""}${o === value ? " selected" : ""}`}
              onMouseEnter={() => setActive(i)} onClick={() => choose(i)}>
              <span>{o}</span>{o === value && <Check size={18} aria-hidden />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
