"use client";

import ChartWrapper from "./ChartWrapper";
import { RISK_COLORS, BADGE_BASE, CHART_COLORS } from "../../../types/theme";

interface RiskChartProps {
  riskCounts: Record<string, number>;
}

export default function RiskChart({ riskCounts }: RiskChartProps) {
  const VALID_RISKS = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

  const categories = VALID_RISKS.filter((key) => key in riskCounts);
  const values = categories.map((key) => riskCounts[key] ?? 0);

  // Convert Tailwind classes → actual hex colors for ECharts
  const riskHexColors: Record<string, string> = {
    SAFE: "#166534", // green-800
    LOW: "#854d0e", // yellow-800
    MEDIUM: "#9a3412", // orange-800
    HIGH: "#b91c1c", // red-700
    CRITICAL: "#7f1d1d", // red-900
  };

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
      axisLabel: {
        color: "#e5e7eb",
        rotate: 30,
        formatter: (value: string) => `{${value}|${value}}`,
        rich: Object.fromEntries(
          categories.map((risk) => [
            risk,
            {
              color: "#fff",
              padding: [2, 6],
              borderRadius: 4,
              backgroundColor: riskHexColors[risk],
            },
          ])
        ),
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
        barWidth: "60%",
        itemStyle: {
          color: CHART_COLORS.riskBars,
        },
      },
    ],
  };

  return <ChartWrapper option={option} />;
}