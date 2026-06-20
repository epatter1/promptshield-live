"use client";

import { EventRow } from "../../../../types/EventRow";
import ChartWrapper from "../ChartWrapper";

export default function AnalyticsActivityChart({
  filteredEvents,
}: {
  filteredEvents: EventRow[];
}) {
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

  // Convert to arrays
  let labels = [...counts.keys()];
  let values = [...counts.values()];

  // ⭐ Flip order so newest is on the right
  labels = labels.reverse();
  values = values.reverse();

  const options = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },

    xAxis: {
      type: "category",
      data: labels,
      axisLabel: {
        color: "#e5e7eb",
        rotate: 45,
      },
      name: "Date & Time",
      nameTextStyle: { color: "#e5e7eb" },
    },

    yAxis: {
      type: "value",
      axisLabel: { color: "#e5e7eb" },
      name: "Event Count",
      nameTextStyle: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },

    series: [
      {
        type: "line",
        data: values,
        smooth: true,
        itemStyle: { color: "#a78bfa" },
        lineStyle: { width: 2 },
      },
    ],
  };

  return (
    <ChartWrapper
      title="Activity Over Time"
      description="Shows how user activity is distributed across sessions within the selected range (events per session)"
      options={options}
    />
  );

}