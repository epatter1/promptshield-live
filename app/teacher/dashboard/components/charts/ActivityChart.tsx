"use client";

import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

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
  const timeUnit = "minutes"; // your data is aggregated per minute

  // ⭐ Memoize the option object so ECharts does NOT re-run setOption during render
  const option = useMemo(() => {
    return {
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
          const count = p.value[1];

          return `
            <div>
              <strong>Time (${timeUnit}):</strong> ${date}<br/>
              <strong>Events:</strong> ${count} event${count === 1 ? "" : "s"}/min
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
        name: `Time (${timeUnit})`,
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
            color: "#a78bfa",
          },
          lineStyle: {
            color: "#a78bfa",
            width: 2,
          },
          areaStyle: {
            color: "rgba(167, 139, 250, 0.15)",
          },
          label: { show: false },
        },
      ],
    };
  }, [activityData, yLabel, titleTooltip]);

  return (
    <ReactECharts
      option={option}
      style={{ height: "220px" }}
      className="md:!h-[260px]"
    />
  );
}