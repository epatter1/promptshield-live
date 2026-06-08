"use client";

import { useMemo } from "react";
import FilterBar from "./components/FilterBar";
import { useFilters } from "./context/FilterContext";

import ChartCard from "./components/charts/ChartCard";
import RiskDistributionChart from "./components/charts/RiskDistributionChart";
import InjectionTimelineChart from "./components/charts/InjectionTimelineChart";
import LatencyHistogramChart from "./components/charts/LatencyHistogramChart";
import SessionActivityChart from "./components/charts/SessionActivityChart";

export default function TeacherDashboardClient({ events }: { events: any[] }) {
  const { filters } = useFilters();

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((e) => {
      if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(e.riskLevel)) return false;
      if (filters.injectionOnly && !e.injectionDetected) return false;
      if (filters.rewriteOnly && !e.rewriteApplied) return false;
      if (filters.modelNames.length > 0 && !filters.modelNames.includes(e.modelName)) return false;
      if (filters.sessionId && e.sessionId !== filters.sessionId) return false;

      const ts = new Date(e.timestamp).getTime();
      const now = Date.now();

      if (filters.dateRange === "24h" && ts < now - 24 * 60 * 60 * 1000) return false;
      if (filters.dateRange === "7d" && ts < now - 7 * 24 * 60 * 60 * 1000) return false;
      if (filters.dateRange === "30d" && ts < now - 30 * 24 * 60 * 60 * 1000) return false;

      return true;
    });
  }, [events, filters]);

  return (
    <div className="space-y-10">
      <FilterBar events={events} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        <ChartCard title="Risk Distribution">
          <RiskDistributionChart events={filteredEvents} />
        </ChartCard>

        <ChartCard title="Injection Timeline">
          <InjectionTimelineChart events={filteredEvents} />
        </ChartCard>

        <ChartCard title="Latency Histogram">
          <LatencyHistogramChart events={filteredEvents} />
        </ChartCard>

        <ChartCard title="Session Activity">
          <SessionActivityChart events={filteredEvents} />
        </ChartCard>
      </div>
    </div>
  );
}