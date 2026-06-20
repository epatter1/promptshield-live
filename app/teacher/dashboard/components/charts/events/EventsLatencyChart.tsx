"use client";

import ChartWrapper from "../ChartWrapper";
import { EventRow } from "../../../../types/EventRow";

interface Props {
  filteredEvents: EventRow[];
  xLabel: string;
  yLabel: string;
  titleTooltip: string;
}

export default function EventsLatencyChart({
  filteredEvents,
  xLabel,
  yLabel,
}: Props) {
  const points = filteredEvents.map((e) => [
    new Date(e.timestamp).getTime(),
    e.latencyMs,
  ]);

  const option = {
    animation: false,
    tooltip: { trigger: "axis" },

    grid: { left: 50, right: 20, top: 10, bottom: 60, containLabel: true },

    xAxis: {
      type: "time",
      axisLabel: { color: "#e5e7eb" },
      name: xLabel,
      nameLocation: "end",
      nameGap: 10,
      nameTextStyle: { color: "#e5e7eb" },
    },

    yAxis: {
      type: "value",
      axisLabel: { color: "#e5e7eb" },
      name: yLabel,
      nameLocation: "end",
      nameRotate: 0,
      nameGap: 10,
      nameTextStyle: { color: "#e5e7eb" },
    },

    series: [
      {
        type: "line",
        data: points,
        smooth: true,
        itemStyle: { color: "#34d399" },
        lineStyle: { width: 2 },
      },
    ],
  };

  return (
    <ChartWrapper
      title="Latency Over Time"
      description="Tracks model response latency across events (latency in ms)"
      options={option}
    />
  );
}