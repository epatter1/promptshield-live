"use client";

import useChartOptions from "../hooks/useChartOptions";
import { EventRow } from "../../types/EventRow";

import RiskChart from "./charts/RiskChart";
import InjectionChart from "./charts/InjectionChart";
import LatencyChart from "./charts/LatencyChart";
import ActivityChart from "./charts/ActivityChart";

interface ChartsPanelProps {
  filteredEvents: EventRow[];
}

export default function ChartsPanel({ filteredEvents }: ChartsPanelProps) {
  const {
    riskCounts,
    injectionPoints,
    latencyBuckets,
    activityData,
  } = useChartOptions(filteredEvents);

  return (
    <div className="space-y-6 w-full">

      {/* Risk Distribution */}
      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
        <RiskChart
          riskCounts={riskCounts}
          xLabel="Risk Level"
          yLabel="Number of Events"
          titleTooltip="Shows how many events fall into each risk category."
        />
      </div>

      {/* Injection Attempts Over Time */}
      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
        <InjectionChart
          injectionPoints={injectionPoints}
          xLabel="Time (Local)"
          yLabel="Injection Attempts"
          titleTooltip="Tracks when injection attempts occurred, using your local timezone."
        />
      </div>

      {/* Latency Histogram */}
      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
        <LatencyChart
          latencyBuckets={latencyBuckets}
          xLabel="Latency (ms)"
          yLabel="Number of Events"
          titleTooltip="Shows how many events fall into each latency range."
        />
      </div>

      {/* Session Activity */}
      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
        <ActivityChart
          activityData={activityData}
          xLabel="Time"
          yLabel="Event Count"
          titleTooltip="Shows how active sessions are over time."
        />
      </div>

    </div>
  );
}