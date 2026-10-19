import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import ConverterTool from "./ConverterTool";

export const metadata: Metadata = {
  title: "مبدل تاریخ شمسی به میلادی — دست‌افزار",
  description: "تبدیل آنی و دقیق تاریخ شمسی (جلالی) به میلادی و برعکس، با الگوریتم رسمی تقویم جلالی. رایگان و بدون ثبت‌نام.",
};

export default function Page() {
  return (
    <ToolShell title="مبدل تاریخ شمسی به میلادی" desc="تاریخ شمسی را وارد کنید؛ معادل میلادی‌اش را همان لحظه ببینید.">
      <ConverterTool />
    </ToolShell>
  );
}
