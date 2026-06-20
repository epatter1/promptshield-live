"use client";

import ChartWrapper from "../ChartWrapper";
import { EventRow } from "../../../../types/EventRow";

interface Props {
  riskCounts: Record<string, number>;
  xLabel: string;
  yLabel: string;
  titleTooltip: string;
}

export default function EventsRiskChart({
  riskCounts,
  xLabel,
  yLabel,
  titleTooltip,
}: Props) {
  // Match Analytics risk categories
  const VALID_RISKS = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

  const categories = VALID_RISKS.filter((key) => key in riskCounts);
  const values = categories.map((key) => riskCounts[key] ?? 0);

  // Tailwind → hex colors (same as Analytics)
  const riskHexColors: Record<string, string> = {
    SAFE: "#166534",     // green-800
    LOW: "#854d0e",      // yellow-800
    MEDIUM: "#9a3412",   // orange-800
    HIGH: "#b91c1c",     // red-700
    CRITICAL: "#7f1d1d", // red-900
  };

  const option = {
    backgroundColor: "transparent",
    animation: false,

    title: {
      text: "",
      left: "center",
      textStyle: { color: "#e5e7eb", fontSize: 12 },
      subtext: titleTooltip,
      subtextStyle: { color: "#9ca3af", fontSize: 12 },
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
      nameTextStyle: { color: "#e5e7eb", fontSize: 11 },
    },

    yAxis: {
      type: "value",
      min: 0,
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
      name: yLabel,
      nameLocation: "middle",
      nameGap: 45,
      nameTextStyle: { color: "#e5e7eb", fontSize: 11 },
    },

    series: [
      {
        type: "bar",
        data: values,
        barWidth: "60%",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#ffffffaa" },   // bright highlight
              { offset: 0.15, color: "#e5e7eb88" }, // soft silver
              { offset: 0.35, color: "#9ca3afcc" }, // strong reflection
              { offset: 0.55, color: "#6b7280ff" }, // metallic mid-tone
              { offset: 0.75, color: "#374151ff" }, // deep shadow
              { offset: 1, color: "#111827ff" },    // darkest base
            ],
          },
          borderColor: "#f3f4f6aa",
          borderWidth: 1.2,
          shadowBlur: 12,
          shadowColor: "rgba(255,255,255,0.25)",
          shadowOffsetY: 3,
        },
      },
    ],

  };

  return (
    <ChartWrapper
      title="Risk Level Distribution"
      description="Shows event counts by risk severity"
      options={option}
    />
  );
}