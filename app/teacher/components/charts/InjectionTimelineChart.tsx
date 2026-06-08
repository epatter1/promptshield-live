"use client";

import EChart from "./EChart";
import type { EChartsOption } from "echarts";

interface EventRecord {
  timestamp: string;
  injectionDetected: number | boolean;
}

interface Props {
  events: EventRecord[];
}

export default function InjectionTimelineChart({ events }: Props) {
  // Convert timestamps + filter only injection events
  const points = events
    .filter((e) => e.injectionDetected === 1 || e.injectionDetected === true)
    .map((e) => ({
      name: e.timestamp,
      value: [new Date(e.timestamp).getTime(), 1]
    }))
    .sort((a, b) => a.value[0] - b.value[0]); // sort by time ascending

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const p = params[0];
        return `
          <strong>Injection Attempt</strong><br/>
          Time: ${new Date(p.value[0]).toLocaleString()}
        `;
      }
    },
    xAxis: {
      type: "time",
      name: "Time",
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 1,
      show: false // we only care about spikes
    },
    series: [
      {
        name: "Injection Attempts",
        type: "line",
        smooth: true,
        showSymbol: true,
        symbolSize: 10,
        data: points,
        lineStyle: {
          color: "#e11d48",
          width: 2
        },
        itemStyle: {
          color: "#e11d48"
        },
        areaStyle: {
          opacity: 0.1,
          color: "#e11d48"
        }
      }
    ]
  };

  return <EChart option={option} />;
}