import { useEffect, useRef } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

export type ToastKind = "success" | "error" | "info";
export interface ToastData { id: number; kind: ToastKind; text: string }

/** Custom toast system (no library — see note in App): token-based, RTL-native,
    top-inline-start (visual top-right in RTL), role=status, auto-dismiss with pause-on-hover. */
export function Toasts({ items, dismiss }: { items: ToastData[]; dismiss(id: number): void }) {
  return (
    <div className="toasts" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast-item ${t.kind}`} role="status">
          {t.kind === "success" ? <CheckCircle2 size={20} aria-hidden /> : t.kind === "error" ? <TriangleAlert size={20} aria-hidden /> : <Info size={20} aria-hidden />}
          <span>{t.text}</span>
          <button className="toast-x" onClick={() => dismiss(t.id)} aria-label="بستن اعلان"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}

interface ConfirmProps {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm(): void;
  onCancel(): void;
}

/** Destructive-action confirmation (baseline-ui: AlertDialog pattern).
    Focus lands on Cancel (safe default), Esc cancels, focus returns handled by caller trigger. */
export function ConfirmDialog({ title, body, confirmLabel, onConfirm, onCancel }: ConfirmProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className="overlay confirm-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-body">
        <span className="confirm-ic"><TriangleAlert size={24} aria-hidden /></span>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-body">{body}</p>
        <div className="confirm-actions">
          <button ref={cancelRef} className="btn-ghost-lg" onClick={onCancel}>انصراف</button>
          <button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
