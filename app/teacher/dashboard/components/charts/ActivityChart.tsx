"use client";

import ChartWrapper from "./ChartWrapper";

interface ActivityChartProps {
  activityData: { value: [number, number] }[];
}

export default function ActivityChart({ activityData }: ActivityChartProps) {
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
      text: "Activity Over Time",
      left: "center",
      textStyle: { color: "#e5e7eb", fontSize: 12 },
    },

    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const p = params[0];
        const date = new Date(p.value[0]).toLocaleString();
        return `
          <div>
            <strong>Time:</strong> ${date}<br/>
            <strong>Events:</strong> ${p.value[1]}
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
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },

    series: [
      {
        type: "line",
        data: activityData,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#a78bfa" },
        lineStyle: { color: "#a78bfa", width: 2 },
        areaStyle: { color: "rgba(167, 139, 250, 0.15)" },
      },
    ],
  };

  return <ChartWrapper option={option} />;
}
