import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import NowruzTool from "./NowruzTool";

export const metadata: Metadata = {
  title: "چند روز مانده تا نوروز؟ — شمارش معکوس نوروز | دست‌افزار",
  description: "شمارش معکوس زنده تا نوروز و تحویل سال نو شمسی، با تاریخ دقیق میلادی تحویل سال. به اشتراک بگذارید!",
};

export default function Page() {
  return (
    <ToolShell title="شمارش معکوس نوروز" desc="تا بهار و تحویل سال نو چقدر مانده؟">
      <NowruzTool />
    </ToolShell>
  );
}
