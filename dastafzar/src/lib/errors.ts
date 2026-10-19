/** One place that turns any failure into a calm Persian message for users.
    Technical details go to the console only — never into the UI. */
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = "ApiError"; }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  } catch (e) {
    console.error("network error", e);
    throw new ApiError(0, "ارتباط با سرور برقرار نشد — اتصال اینترنت را بررسی کنید");
  }
  if (!res.ok) {
    let msg = "خطایی پیش آمد — دوباره تلاش کنید";
    try { const d = await res.json(); if (typeof d?.message === "string") msg = d.message; } catch { /* keep default */ }
    if (res.status === 401) msg = "نشست شما تمام شده — دوباره وارد شوید";
    if (res.status === 429) msg = "درخواست‌ها زیاد شد — کمی صبر کنید";
    throw new ApiError(res.status, msg);
  }
  return res.json() as Promise<T>;
}

export const userMessage = (e: unknown): string =>
  e instanceof ApiError ? e.message : "خطایی پیش آمد — دوباره تلاش کنید";
