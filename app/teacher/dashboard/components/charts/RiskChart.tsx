"use client";

import ChartWrapper from "./ChartWrapper";
import { CHART_COLORS } from "../../../types/theme";

interface RiskChartProps {
  riskCounts: Record<string, number>;
}

export default function RiskChart({ riskCounts }: RiskChartProps) {
  const VALID_RISKS = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

  const categories = VALID_RISKS.filter((key) => key in riskCounts);
  const values = categories.map((key) => riskCounts[key] ?? 0);

  const option = {
    backgroundColor: "transparent",
    animation: false,
    grid: {
      left: 50,
      right: 30,
      top: 60,
      bottom: 70,
      containLabel: true,
    },
    title: {
      text: "Risk Level Distribution",
      left: "center",
      textStyle: { color: "#e5e7eb", fontSize: 12 },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#1f2937",
      borderColor: "#374151",
      textStyle: { color: "#e5e7eb" },
    },
    xAxis: {
      type: "category",
      data: categories,
      name: "Risk Level",
      nameLocation: "middle",
      nameGap: 40,
      axisLabel: {
        color: "#e5e7eb",
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      name: "Event Count",
      nameLocation: "middle",
      nameGap: 50,
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },
    series: [
      {
        type: "bar",
        data: values,
        itemStyle: { color: CHART_COLORS.riskBars },
        barWidth: "60%",
      },
    ],
  };

  return <ChartWrapper option={option} />;
}