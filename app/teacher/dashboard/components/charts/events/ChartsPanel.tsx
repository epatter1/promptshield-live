"use client";

import { EventRow } from "../../../../types/EventRow";

import EventsRiskChart from "./EventsRiskChart";
import EventsInjectionChart from "./EventsInjectionChart";
import EventsLatencyChart from "./EventsLatencyChart";
import EventsActivityChart from "./EventsActivityChart";

interface ChartsPanelProps {
  filteredEvents: EventRow[];
  riskCounts: Record<string, number>;
}


export default function ChartsPanel({
  filteredEvents,
  riskCounts,
}: ChartsPanelProps) {
  return (
    <div className="space-y-6 w-full">

      <EventsRiskChart
        riskCounts={riskCounts}
        xLabel="Risk Level"
        yLabel="Count"
        titleTooltip=""
      />

      <EventsInjectionChart
        filteredEvents={filteredEvents}
        xLabel=""
        yLabel="Injection Attempts"
        titleTooltip="Injection attempts detected over time."
      />

      <EventsLatencyChart
        filteredEvents={filteredEvents}
        xLabel=""
        yLabel="Latency (ms)"
        titleTooltip="Latency trend over time."
      />

      <EventsActivityChart
        filteredEvents={filteredEvents}
        xLabel=""
        yLabel="Event Count"
        titleTooltip="Event activity over time."
      />

    </div>
  );
}