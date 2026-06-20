"use client";

import { EventRow } from "../../../../types/EventRow";

import AnalyticsRiskChart from "./AnalyticsRiskChart";
import AnalyticsInjectionChart from "./AnalyticsInjectionChart";
import AnalyticsLatencyChart from "./AnalyticsLatencyChart";
import AnalyticsActivityChart from "./AnalyticsActivityChart";

import useChartOptions from "../../../hooks/useChartOptions";

interface AnalyticsPanelProps {
  filteredEvents: EventRow[];
}

export default function AnalyticsPanel({ filteredEvents }: AnalyticsPanelProps) {
  const {
    riskCounts,
    injectionPoints,
    latencyBuckets,
    activityData,
  } = useChartOptions(filteredEvents);

  return (
    <div className="space-y-6 w-full">

      {/* Risk Distribution */}
      <AnalyticsRiskChart filteredEvents={filteredEvents} />

      {/* Injection Attempts */}
      <AnalyticsInjectionChart filteredEvents={filteredEvents} />

      {/* Latency Histogram */}
      <AnalyticsLatencyChart
        filteredEvents={filteredEvents}
        latencyBuckets={latencyBuckets}
      />

      {/* Activity Over Time */}
      <AnalyticsActivityChart filteredEvents={filteredEvents} />

    </div>
  );
}