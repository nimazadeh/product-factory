import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import AgeTool from "./AgeTool";

export const metadata: Metadata = {
  title: "محاسبه سن دقیق به شمسی — دست‌افزار",
  description: "سن دقیق شما به سال، ماه و روز از روی تاریخ تولد شمسی. رایگان، آنی و بدون ثبت‌نام.",
};

export default function Page() {
  return (
    <ToolShell title="محاسبه سن دقیق" desc="تاریخ تولد شمسی‌تان را وارد کنید؛ سن دقیق‌تان را به سال، ماه و روز ببینید.">
      <AgeTool />
    </ToolShell>
  );
}
