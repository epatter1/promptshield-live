"use client";

import ChartWrapper from "./ChartWrapper";

interface InjectionChartProps {
  injectionPoints: { name: string; value: [number, number] }[];
}

export default function InjectionChart({ injectionPoints }: InjectionChartProps) {
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
      text: "Injection Attempts Over Time",
      left: "center",
      textStyle: { color: "#e5e7eb", fontSize: 12 },
    },

    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const date = new Date(params.value[0]).toLocaleString();
        return `
          <div>
            <strong>Session:</strong> ${params.name}<br/>
            <strong>Time:</strong> ${date}
          </div>
        `;
      },
    },

    xAxis: {
      type: "time",
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },

    yAxis: {
      type: "value",
      min: 0,
      max: 1,
      axisLabel: { show: false },
      splitLine: { show: false },
    },

    series: [
      {
        type: "scatter",
        symbolSize: 12,
        data: injectionPoints,
        itemStyle: {
          color: "#f87171",
          borderColor: "#ffffff",
          borderWidth: 1,
        },
      },
    ],
  };

  return <ChartWrapper option={option} />;
}