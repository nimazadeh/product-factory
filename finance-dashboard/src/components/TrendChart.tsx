import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale, Chart as ChartJS, Filler, LineElement, LinearScale, PointElement, Tooltip,
  type ChartData, type ChartOptions, type ScriptableContext,
} from "chart.js";
import { fmtShort, fmtToman } from "../lib/money";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export interface Point { label: string; expense: number; income: number }

/** Trend chart on Chart.js 4 via react-chartjs-2 (adopted 2026-10-19 — mature library
    over hand-rolled SVG: tested interactions, resize, animation and tooltips).
    Persian setup: Vazirmatn forced, fa-IR number callbacks, RTL tooltips.
    A11y: canvas sits inside role="img" with a spoken summary and the parent keeps
    a real data-table fallback (canvas itself is not screen-reader friendly). */
export default function TrendChart({ data }: { data: Point[] }) {
  const total = data.reduce((a, d) => a + d.expense, 0);
  const peak = data.reduce((a, d) => (d.expense > a.expense ? d : a), data[0] ?? { label: "", expense: 0, income: 0 });
  const peakIdx = data.indexOf(peak);

  const chartData: ChartData<"line"> = useMemo(() => ({
    labels: data.map((d) => d.label),
    datasets: [{
      label: "هزینه",
      data: data.map((d) => d.expense),
      borderColor: "#0B6B4F",
      borderWidth: 2,
      tension: 0.35,
      cubicInterpolationMode: "monotone" as const,
      fill: true,
      pointRadius: (c: ScriptableContext<"line">) => (c.dataIndex === peakIdx ? 4.5 : 0),
      pointHoverRadius: 5,
      pointBackgroundColor: (c: ScriptableContext<"line">) => (c.dataIndex === peakIdx ? "#C2410C" : "#0B6B4F"),
      pointBorderColor: "#fff",
      pointBorderWidth: 1.5,
      backgroundColor: (c: ScriptableContext<"line">) => {
        const { ctx, chartArea } = c.chart;
        if (!chartArea) return "rgba(11,107,79,0.08)";
        const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, "rgba(11,107,79,0.16)"); g.addColorStop(1, "rgba(11,107,79,0.01)");
        return g;
      },
    }],
  }), [data, peakIdx]);

  const options: ChartOptions<"line"> = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 600, easing: "easeOutQuart" },
    interaction: { mode: "index", intersect: false },
    layout: { padding: { top: 8 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true, textDirection: "rtl",
        backgroundColor: "#16211C", titleColor: "#fff", bodyColor: "#E7EDE9",
        padding: 12, cornerRadius: 10, boxPadding: 4,
        titleFont: { family: "Vazirmatn, Tahoma, sans-serif", weight: "bold", size: 13 },
        bodyFont: { family: "Vazirmatn, Tahoma, sans-serif", size: 13 },
        callbacks: {
          label: (item) => ` هزینه: ${fmtToman(item.parsed.y ?? 0)}`,
          afterLabel: (item) => {
            const inc = data[item.dataIndex]?.income ?? 0;
            return inc ? ` درآمد: ${fmtToman(inc)}` : "";
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false }, border: { color: "#DFE5DF" },
        ticks: {
          maxTicksLimit: 4, maxRotation: 0, autoSkip: true,
          font: { family: "Vazirmatn, Tahoma, sans-serif", size: 11 }, color: "#63736A",
        },
      },
      y: {
        beginAtZero: true, suggestedMax: peak.expense * 1.1 || undefined,
        grid: { color: "#EDF1ED" }, border: { display: false },
        ticks: {
          maxTicksLimit: 4,
          callback: (v) => fmtShort(Number(v)),
          font: { family: "Vazirmatn, Tahoma, sans-serif", size: 11 }, color: "#63736A",
        },
      },
    },
  };

  return (
    <div className="cjs-wrap" role="img"
      aria-label={`نمودار روند هزینه (Chart.js). مجموع این بازه ${fmtToman(total)}. بیشترین هزینه ${fmtToman(peak.expense)} در ${peak.label}. جدول داده در ادامه صفحه موجود است.`}>
      <div className="cjs-box"><Line data={chartData} options={options} aria-hidden="true" /></div>
      <p className="tc-readout">اوج: <strong className="num">{fmtShort(peak.expense)}</strong> در {peak.label} · مجموع بازه <strong className="num">{fmtShort(total)}</strong></p>
    </div>
  );
}
