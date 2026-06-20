"use client";

import { EventRow } from "../../../../types/EventRow";
import ChartWrapper from "../ChartWrapper";

export default function AnalyticsInjectionChart({ filteredEvents }: { filteredEvents: EventRow[] }) {
  const points = filteredEvents.map((e) => ({
    timestamp: new Date(e.timestamp),
    value: e.injectionDetected ? 1 : 0,
  }));

  const options = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "time",
      axisLabel: { color: "#e5e7eb" },
      name: "Time",
      nameTextStyle: { color: "#e5e7eb" },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#e5e7eb" },
      name: "Injection Attempts",
      nameTextStyle: { color: "#e5e7eb" },
    },
    series: [
      {
        type: "line",
        data: points.map((p) => [p.timestamp, p.value]),
        smooth: true,
      },
    ],
  };

  return (
  <ChartWrapper
    title="Injection Timeline"
    description="Visualizes prompt injection attempts over time to reveal spikes or patterns (attempts per day)"
    options={options}
  />
);

}