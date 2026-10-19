import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import CalendarTool from "./CalendarTool";

export const metadata: Metadata = {
  title: "تقویم شمسی ۱۴۰۵ — تقویم جلالی تعاملی با مناسبت‌ها | دست‌افزار",
  description: "تقویم شمسی (جلالی) کامل و تعاملی: هر ماه را ببینید، روی هر روز بزنید و معادل میلادی، روز هفته و فاصله از امروز را ببینید. با مناسبت‌های نوروز، یلدا و مهرگان.",
};

export default function Page() {
  return (
    <ToolShell title="تقویم شمسی تعاملی" desc="ماه به ماه بگردید، روی هر روز بزنید — معادل میلادی و مناسبتش همان‌جا می‌آید.">
      <CalendarTool />
    </ToolShell>
  );
}
