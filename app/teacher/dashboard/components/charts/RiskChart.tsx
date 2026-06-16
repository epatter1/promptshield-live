"use client";

import ChartWrapper from "./ChartWrapper";
import { RISK_COLORS, CHART_COLORS } from "../../../types/theme";

interface RiskChartProps {
  riskCounts: Record<string, number>;
  xLabel: string;
  yLabel: string;
  titleTooltip: string;
}

export default function RiskChart({
  riskCounts,
  xLabel,
  yLabel,
  titleTooltip,
}: RiskChartProps) {
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

    title: {
      text: "Risk Level Distribution",
      left: "center",
      textStyle: { color: "#e5e7eb", fontSize: 12 },
      subtext: titleTooltip,
      subtextStyle: {
        color: "#9ca3af",
        fontSize: 10,
      },
      triggerEvent: true,
    },

    tooltip: {
      trigger: "axis",
      backgroundColor: "#1f2937",
      borderColor: "#374151",
      textStyle: { color: "#e5e7eb" },
    },

    grid: {
      left: 50,
      right: 30,
      top: 70,
      bottom: 60,
      containLabel: true,
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
      name: xLabel,
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        color: "#e5e7eb",
        fontSize: 11,
      },
    },

    yAxis: {
      type: "value",
      min: 0,
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
      name: yLabel,
      nameLocation: "middle",
      nameGap: 45,
      nameTextStyle: {
        color: "#e5e7eb",
        fontSize: 11,
      },
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