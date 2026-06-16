"use client";

import ChartWrapper from "./ChartWrapper";

interface InjectionChartProps {
  injectionPoints: { timestamp: string; value: number }[];
  xLabel: string;
  yLabel: string;
  titleTooltip: string;
}

export default function InjectionChart({
  injectionPoints,
  xLabel,
  yLabel,
  titleTooltip,
}: InjectionChartProps) {
  // Convert to ECharts-friendly time-series format
  const data = injectionPoints.map((p) => [
    new Date(p.timestamp).getTime(),
    p.value,
  ]);

  const option = {
    backgroundColor: "transparent",
    animation: false,

    title: {
      text: "Injection Attempts Over Time",
      left: "center",
      textStyle: { color: "#e5e7eb", fontSize: 12 },
      subtext: titleTooltip,
      subtextStyle: { color: "#9ca3af", fontSize: 10 },
      triggerEvent: true,
    },

    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const p = params[0];
        const date = new Date(p.value[0]).toLocaleString();
        return `
          <div>
            <strong>Time:</strong> ${date}<br/>
            <strong>Injection Attempt:</strong> ${p.value[1]}
          </div>
        `;
      },
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

    // ⭐ FIXED: Use time axis to prevent overlapping labels
    xAxis: {
      type: "time",
      axisLabel: {
        color: "#e5e7eb",
        formatter: (value: number) =>
          new Date(value).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
      },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
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
        type: "line",
        data,
        smooth: false,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: "#ef4444", // red-500
        },
        lineStyle: {
          color: "#ef4444",
          width: 2,
        },
      },
    ],
  };

  return <ChartWrapper option={option} />;
}