export type ToolEntry = { slug: string; title: string; short: string; category: string; badge?: string; glyph: string };
export const TOOLS: ToolEntry[] = [
  { slug: "date-converter", title: "مبدل تاریخ", short: "شمسی، میلادی و قمری", category: "تاریخ", glyph: "ArrowsLeftRight" },
  { slug: "age-calculator", title: "محاسبه سن", short: "سن دقیق تا روز", category: "تاریخ", badge: "محبوب", glyph: "Cake" },
  { slug: "date-difference", title: "اختلاف دو تاریخ", short: "روز، هفته و ماه", category: "تاریخ", glyph: "CalendarRange" },
  { slug: "nowruz-countdown", title: "شمارش معکوس نوروز", short: "تا لحظه تحویل سال", category: "رویداد", badge: "فصلی", glyph: "Sparkles" },
  { slug: "jalali-calendar", title: "تقویم شمسی", short: "همه مناسبت‌ها و تعطیلات", category: "تاریخ", badge: "کامل", glyph: "CalendarDays" },
  { slug: "invoice-maker", title: "فاکتورساز حرفه‌ای", short: "فاکتور فروش با چاپ و PDF", category: "مالی", badge: "جدید", glyph: "FileText" },
];
export const TOOL_CATEGORIES = ["همه", "تاریخ", "رویداد", "مالی"] as const;
