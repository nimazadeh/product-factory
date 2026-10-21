import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import InvoiceTool from "./InvoiceTool";

export const metadata: Metadata = {
  title: "فاکتورساز حرفه‌ای — فاکتور فارسی با چاپ و PDF | دست‌افزار",
  description: "فاکتور فروش فارسی حرفه‌ای: ردیف کالا، تخفیف، ارزش افزوده، مبلغ به حروف، لوگو، چاپ و خروجی PDF تمیز — رایگان و بدون ثبت‌نام، ذخیره روی دستگاه خودتان.",
};

export default function Page() {
  return (
    <ToolShell title="فاکتورساز حرفه‌ای" desc="فاکتور فروش کامل و تمیز بسازید — با مبلغ به حروف و خروجی چاپ/PDF آماده ارسال برای مشتری." navActive="tools">
      <InvoiceTool />
    </ToolShell>
  );
}
