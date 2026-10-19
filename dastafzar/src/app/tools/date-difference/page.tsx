import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import DiffTool from "./DiffTool";

export const metadata: Metadata = {
  title: "محاسبه فاصله بین دو تاریخ شمسی — دست‌افزار",
  description: "فاصله دقیق بین دو تاریخ شمسی به روز و هفته. برای برنامه‌ریزی، ضرب‌الاجل و مناسبت‌ها. رایگان و آنی.",
};

export default function Page() {
  return (
    <ToolShell title="فاصله بین دو تاریخ" desc="دو تاریخ شمسی را وارد کنید؛ فاصله‌شان را به روز و هفته ببینید.">
      <DiffTool />
    </ToolShell>
  );
}
