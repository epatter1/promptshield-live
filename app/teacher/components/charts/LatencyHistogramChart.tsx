"use client";

import EChart from "./EChart";
import type { EChartsOption } from "echarts";

interface EventRecord {
  latencyMs: number | null;
}

interface Props {
  events: EventRecord[];
}

export default function LatencyHistogramChart({ events }: Props) {
  // Extract valid latency values
  const latencies = events
    .map((e) => e.latencyMs)
    .filter((v): v is number => typeof v === "number" && v >= 0);

  // Build histogram buckets (0–100, 100–200, etc.)
  const bucketSize = 100;
  const maxLatency = Math.max(...latencies, 0);
  const bucketCount = Math.ceil(maxLatency / bucketSize);

  const buckets = Array(bucketCount).fill(0);

  latencies.forEach((lat) => {
    const index = Math.floor(lat / bucketSize);
    buckets[index] = (buckets[index] || 0) + 1;
  });

  const labels = buckets.map((_, i) => {
    const start = i * bucketSize;
    const end = start + bucketSize;
    return `${start}–${end}ms`;
  });

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis"
    },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: "value",
      name: "Count"
    },
    series: [
      {
        name: "Latency",
        type: "bar",
        data: buckets,
        itemStyle: {
          color: "#3b82f6"
        }
      }
    ]
  };

  return <EChart option={option} />;
}