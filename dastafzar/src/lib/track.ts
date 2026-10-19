/** Fire-and-forget usage event to the NestJS API (anonymous, no personal data). */
export function track(tool: string, action: "view" | "use" | "share" | "copy") {
  try {
    const base = "";
    fetch(`${base}/api-backend/events`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool, action }), keepalive: true,
    }).catch(() => { /* analytics must never break the tool */ });
  } catch { /* ignore */ }
}
