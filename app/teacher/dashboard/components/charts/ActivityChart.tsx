"use client";

import ReactECharts from "echarts-for-react";

interface ActivityChartProps {
  activityData: { value: [number, number] }[];
  xLabel: string;
  yLabel: string;
  titleTooltip: string;
}

export default function ActivityChart({
  activityData,
  xLabel,
  yLabel,
  titleTooltip,
}: ActivityChartProps) {
  const option = {
    backgroundColor: "transparent",
    animation: false,

    title: {
      text: "Session Activity Over Time",
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
            <strong>Events:</strong> ${p.value[1]}
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

    xAxis: {
      type: "time",
      axisLabel: { color: "#e5e7eb" },
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
        data: activityData,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: "#a78bfa", // purple
        },
        lineStyle: {
          color: "#a78bfa",
          width: 2,
        },
        areaStyle: {
          color: "rgba(167, 139, 250, 0.15)",
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "220px" }}
      className="md:!h-[260px]"
    />
  );
}