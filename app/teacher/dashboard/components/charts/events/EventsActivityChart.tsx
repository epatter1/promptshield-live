"use client";

import ChartWrapper from "../ChartWrapper";
import { EventRow } from "../../../../types/EventRow";

interface Props {
  filteredEvents: EventRow[];
  xLabel: string;
  yLabel: string;
  titleTooltip: string;
}

export default function EventsActivityChart({
  filteredEvents,
  xLabel,
  yLabel,
}: Props) {
  const counts = new Map<string, number>();

  filteredEvents.forEach((e) => {
    const d = new Date(e.timestamp);
    const label = d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  const labels = [...counts.keys()];
  const values = [...counts.values()];

  const option = {
    animation: false,
    tooltip: { trigger: "axis" },

    grid: { left: 50, right: 20, top: 10, bottom: 60, containLabel: true },

    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { color: "#e5e7eb", rotate: 45 },
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
        data: values,
        smooth: true,
        itemStyle: { color: "#60a5fa" },
        lineStyle: { width: 2 },
      },
    ],
  };

  return (
    <ChartWrapper
      title="Activity Over Time"
      description="Shows the volume of events across time"
      options={option}
    />
  );
}