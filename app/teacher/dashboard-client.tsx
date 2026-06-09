"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

type EventRow = {
  timestamp: string; // SQLite timestamp string
  riskLevel: string;
  injectionDetected: number;
  latencyMs: number;
  sessionId: string;
};

export default function DashboardClient() {
  const [events, setEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events));
  }, []);

  // ---- Risk distribution ----
  const riskCounts = events.reduce(
    (acc: Record<string, number>, e) => {
      acc[e.riskLevel] = (acc[e.riskLevel] || 0) + 1;
      return acc;
    },
    {}
  );

  const riskChart = {
    title: { text: "Risk Distribution" },
    xAxis: { type: "category", data: Object.keys(riskCounts) },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: Object.values(riskCounts),
        itemStyle: { color: "#3b82f6" },
      },
    ],
  };

  // ---- Injection timeline ----
  const injectionPoints = events
    .filter((e) => e.injectionDetected === 1)
    .map((e) => {
      const jsTime = new Date(e.timestamp).getTime(); // FIXED
      return {
        name: e.sessionId,
        value: [jsTime, 1],
      };
    });

  const injectionChart = {
    title: { text: "Injection Attempts Over Time" },
    xAxis: { type: "time" },
    yAxis: { type: "value", show: false },
    series: [
      {
        type: "scatter",
        data: injectionPoints,
        symbolSize: 12,
        itemStyle: { color: "#ef4444" },
      },
    ],
  };

  // ---- Latency histogram ----
  const latencyBuckets: Record<string, number> = {};
  for (const e of events) {
    const bucket =
      e.latencyMs < 250
        ? "<250ms"
        : e.latencyMs < 500
        ? "250-500ms"
        : e.latencyMs < 1000
        ? "500ms-1s"
        : ">1s";
    latencyBuckets[bucket] = (latencyBuckets[bucket] || 0) + 1;
  }

  const latencyChart = {
    title: { text: "Latency Histogram" },
    xAxis: { type: "category", data: Object.keys(latencyBuckets) },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: Object.values(latencyBuckets),
        itemStyle: { color: "#10b981" },
      },
    ],
  };

  return (
    <div className="space-y-8">
      <ReactECharts option={riskChart} style={{ height: 300 }} />
      <ReactECharts option={injectionChart} style={{ height: 300 }} />
      <ReactECharts option={latencyChart} style={{ height: 300 }} />
    </div>
  );
}