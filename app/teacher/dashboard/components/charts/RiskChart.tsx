"use client";

import ChartWrapper from "./ChartWrapper";

interface RiskChartProps {
  riskCounts: Record<string, number>;
}

export default function RiskChart({ riskCounts }: RiskChartProps) {
  const VALID_RISKS = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

  const categories = Object.keys(riskCounts).filter((key) =>
    VALID_RISKS.includes(key.toUpperCase())
  );

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
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        color: "#e5e7eb",
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },
    series: [
      {
        type: "bar",
        data: values,
        itemStyle: { color: "#60a5fa" },
        barWidth: "60%",
      },
    ],
  };

  return <ChartWrapper option={option} />;
}
