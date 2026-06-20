"use client";

import { EventRow } from "../../../../types/EventRow";
import ChartWrapper from "../ChartWrapper";
import { RiskLevel, RiskCounts } from "../../../hooks/useChartOptions";

export default function AnalyticsRiskChart({
  filteredEvents,
}: {
  filteredEvents: EventRow[];
}) {
  // Strongly typed risk counts
  const counts: RiskCounts = {
    high: 0,
    medium: 0,
    low: 0,
  };

  // Narrow riskLevel to RiskLevel
  filteredEvents.forEach((e) => {
    const level = e.riskLevel as RiskLevel;
    if (level in counts) {
      counts[level]++;
    }
  });

  const options = {
    backgroundColor: "transparent",
    tooltip: { trigger: "item" },
    legend: { top: "bottom", textStyle: { color: "#e5e7eb" } },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        label: { color: "#e5e7eb" },
        data: [
          { name: "High", value: counts.high },
          { name: "Medium", value: counts.medium },
          { name: "Low", value: counts.low },
        ],
      },
    ],
  };

  return (
    <ChartWrapper
      title="Risk Distribution"
      description="Shows the distribution of risk classifications across all analyzed events"
      options={options}
    />
  );

}