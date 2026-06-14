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

      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
        <RiskChart riskCounts={riskCounts} />
      </div>

      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
        <InjectionChart injectionPoints={injectionPoints} />
      </div>

      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
        <LatencyChart latencyBuckets={latencyBuckets} />
      </div>

      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
        <ActivityChart activityData={activityData} />
      </div>

    </div>
  );
}