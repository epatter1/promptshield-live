"use client";

import { useEffect, useState, useMemo } from "react";
import type { EventRecord } from "@/app/types/EventRecord";

import RiskDistributionChart from "./components/RiskDistributionChart";
import InjectionAttemptsChart from "./components/InjectionAttemptsChart";
import LatencyHistogramChart from "./components/LatencyHistogramChart";
import SessionActivityChart from "./components/SessionActivityChart";

export default function TeacherDashboardClient() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FILTER STATE
  // -----------------------------
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [injectionFilter, setInjectionFilter] = useState<"all" | "yes" | "no">("all");
  const [rewriteFilter, setRewriteFilter] = useState<"all" | "yes" | "no">("all");
  const [dateRange, setDateRange] = useState<"all" | "1h" | "24h" | "7d">("all");

  // -----------------------------
  // FETCH EVENTS
  // -----------------------------
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events || []);
      setLoading(false);
    }
    load();
  }, []);

  // -----------------------------
  // FILTERING LOGIC
  // -----------------------------
  const filteredEvents = useMemo(() => {
    const now = Date.now();

    return events.filter((e) => {
      // Risk filter
      if (riskFilter !== "all" && e.riskLevel !== riskFilter) return false;

      // Injection filter
      if (injectionFilter === "yes" && !e.injectionDetected) return false;
      if (injectionFilter === "no" && e.injectionDetected) return false;

      // Rewrite filter
      if (rewriteFilter === "yes" && !e.rewriteApplied) return false;
      if (rewriteFilter === "no" && e.rewriteApplied) return false;

      // Date range filter
      const ts = new Date(e.timestamp).getTime();
      if (dateRange === "1h" && now - ts > 3600_000) return false;
      if (dateRange === "24h" && now - ts > 86_400_000) return false;
      if (dateRange === "7d" && now - ts > 7 * 86_400_000) return false;

      return true;
    });
  }, [events, riskFilter, injectionFilter, rewriteFilter, dateRange]);

  if (loading) {
    return <div className="text-gray-600">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-8">

      {/* -----------------------------
          FILTER BAR
      ------------------------------ */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 border rounded-lg">
        
        {/* Risk Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Risk</label>
          <select
            className="border rounded px-2 py-1"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Injection Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Injection</label>
          <select
            className="border rounded px-2 py-1"
            value={injectionFilter}
            onChange={(e) => setInjectionFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="yes">Detected</option>
            <option value="no">None</option>
          </select>
        </div>

        {/* Rewrite Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Rewrite</label>
          <select
            className="border rounded px-2 py-1"
            value={rewriteFilter}
            onChange={(e) => setRewriteFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="yes">Applied</option>
            <option value="no">None</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <select
            className="border rounded px-2 py-1"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
          >
            <option value="all">All Time</option>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      <p className="text-gray-600">
        Showing {filteredEvents.length} of {events.length} events
      </p>

      {/* -----------------------------
          CHART GRID
      ------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Risk Distribution</h2>
          <div className="h-64">
            <RiskDistributionChart events={filteredEvents} />
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Injection Attempts</h2>
          <div className="h-64">
            <InjectionAttemptsChart events={filteredEvents} />
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Latency</h2>
          <div className="h-64">
            <LatencyHistogramChart events={filteredEvents} />
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Session Activity</h2>
          <div className="h-64">
            <SessionActivityChart events={filteredEvents} />
          </div>
        </div>

      </div>
    </div>
  );
}