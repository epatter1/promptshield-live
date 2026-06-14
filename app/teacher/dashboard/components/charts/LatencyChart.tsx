"use client";

import ChartWrapper from "./ChartWrapper";

interface LatencyChartProps {
  latencyBuckets: Record<string, number>;
}

export default function LatencyChart({ latencyBuckets }: LatencyChartProps) {
  const categories = Object.keys(latencyBuckets);
  const values = Object.values(latencyBuckets);

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
      text: "Latency Distribution",
      left: "center",
      textStyle: { color: "#e5e7eb", fontSize: 12 },
    },

    tooltip: { trigger: "axis" },

    xAxis: {
      type: "category",
      data: categories,
      axisLabel: { color: "#e5e7eb" },
    },

    yAxis: {
      type: "value",
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },

    series: [
      {
        type: "bar",
        data: values,
        itemStyle: { color: "#34d399" },
        barWidth: "60%",
      },
    ],
  };

  return <ChartWrapper option={option} />;
}