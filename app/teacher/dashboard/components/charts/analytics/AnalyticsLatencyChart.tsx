"use client";

import { EventRow } from "../../../../types/EventRow";
import ChartWrapper from "../ChartWrapper";
import { LatencyBucket } from "../../../hooks/useChartOptions";

export default function AnalyticsLatencyChart({
  filteredEvents,
  latencyBuckets,
}: {
  filteredEvents: EventRow[];
  latencyBuckets: LatencyBucket[];
}) {
  const labels = latencyBuckets.map((b) => b.label);
  const values = latencyBuckets.map((b) => b.count);

  const options = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },

    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { color: "#e5e7eb" },
      name: "Latency Range",
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
        type: "bar",
        data: values,
        itemStyle: { color: "#34d399" },
        barWidth: "50%",
      },
    ],
  };

  return (
    <ChartWrapper
      title="Latency Distribution"
      description="Displays the distribution of model response times to highlight performance trends (latency in ms)"
      options={options}
    />
  );

}