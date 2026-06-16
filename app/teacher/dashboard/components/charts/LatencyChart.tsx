"use client";

import ChartWrapper from "./ChartWrapper";

interface LatencyChartProps {
  latencyBuckets: Record<string, number>;
  xLabel: string;
  yLabel: string;
  titleTooltip: string;
}

export default function LatencyChart({
  latencyBuckets,
  xLabel,
  yLabel,
  titleTooltip,
}: LatencyChartProps) {
  const categories = Object.keys(latencyBuckets);
  const values = Object.values(latencyBuckets);

  const option = {
    backgroundColor: "transparent",
    animation: false,

    title: {
      text: "Latency Distribution",
      left: "center",
      textStyle: { color: "#e5e7eb", fontSize: 12 },
      subtext: titleTooltip,
      subtextStyle: { color: "#9ca3af", fontSize: 10 },
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
      axisLabel: { color: "#e5e7eb" },
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
          color: "#34d399", // green-400
        },
      },
    ],
  };

  return <ChartWrapper option={option} />;
}