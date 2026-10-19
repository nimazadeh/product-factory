export type TxType = "income" | "expense";
export type Period = "day" | "week" | "month";
export interface Transaction { id: string; title: string; amount: number; type: TxType; category: string; date: string; note?: string }
export interface Budget { category: string; limit: number }
export const CATEGORIES = ["خوراک","حمل‌ونقل","خرید","قبوض","تفریح","سلامت","آموزش","سایر"] as const;
export const BUDGETS: Budget[] = [
  { category: "خوراک", limit: 6000000 },
  { category: "خرید", limit: 4000000 },
  { category: "حمل‌ونقل", limit: 2000000 },
  { category: "تفریح", limit: 2500000 },
];
