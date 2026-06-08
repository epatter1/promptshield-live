"use client";

import EChart from "./EChart";
import type { EChartsOption } from "echarts";

interface EventRecord {
  sessionId: string;
  timestamp: string;
  riskLevel: "low" | "medium" | "high" | string;
}

interface Props {
  events: EventRecord[];
}

export default function SessionActivityChart({ events }: Props) {
  const sessionIds = Array.from(new Set(events.map((e) => e.sessionId)));

  const points = events
    .map((e) => {
      const sessionIndex = sessionIds.indexOf(e.sessionId);

      return {
        name: e.sessionId,
        value: [new Date(e.timestamp).getTime(), sessionIndex],
        risk: e.riskLevel
      };
    })
    .sort((a, b) => a.value[0] - b.value[0]);

  const colorMap: Record<string, string> = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#ef4444"
  };

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const t = new Date(params.value[0]).toLocaleString();
        const sessionIndex = params.value[1];
        const session = sessionIds[sessionIndex];
        const risk = params.data.risk;

        return `
          <strong>Session:</strong> 
          <a href="/teacher/session/${session}" style="color:#3b82f6">
            ${session}
          </a><br/>
          <strong>Time:</strong> ${t}<br/>
          <strong>Risk:</strong> ${risk}
        `;
      }
    },
    xAxis: {
      type: "time",
      name: "Time",
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: "category",
      name: "Session",
      data: sessionIds
    },
    series: [
      {
        type: "scatter",
        symbolSize: 12,
        data: points,
        itemStyle: {
          color: (params: any) => colorMap[params.data.risk] || "#6b7280"
        }
      }
    ]
  };

  return (
    <EChart
      option={option}
      onEvents={{
        click: (params: any) => {
          const sessionIndex = params.value[1];
          const sessionId = sessionIds[sessionIndex];
          window.location.href = `/teacher/session/${sessionId}`;
        }
      }}
    />
  );
}