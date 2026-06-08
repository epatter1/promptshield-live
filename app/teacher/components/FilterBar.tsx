"use client";

import { useFilters } from "../context/FilterContext";
import { useMemo } from "react";

export default function FilterBar({ events }: { events: any[] }) {
  const {
    filters,
    setRiskLevels,
    setInjectionOnly,
    setRewriteOnly,
    setModelNames,
    setDateRange,
  } = useFilters();

  // Extract unique model names from events
  const modelOptions = useMemo(() => {
    const set = new Set(events.map((e) => e.modelName));
    return Array.from(set);
  }, [events]);

  return (
    <div className="w-full flex flex-wrap gap-3 items-center bg-white border border-gray-200 rounded-md p-3 shadow-sm">
      {/* Risk Filter */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-500">Risk Level</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filters.riskLevels[0] ?? ""}
          onChange={(e) =>
            setRiskLevels(e.target.value ? [e.target.value] : [])
          }
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Injection Only */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.injectionOnly}
          onChange={(e) => setInjectionOnly(e.target.checked)}
        />
        <label className="text-sm text-gray-700">Injection Only</label>
      </div>

      {/* Rewrite Only */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.rewriteOnly}
          onChange={(e) => setRewriteOnly(e.target.checked)}
        />
        <label className="text-sm text-gray-700">Rewrite Only</label>
      </div>

      {/* Model Filter */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-500">Model</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filters.modelNames[0] ?? ""}
          onChange={(e) =>
            setModelNames(e.target.value ? [e.target.value] : [])
          }
        >
          <option value="">All</option>
          {modelOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-500">Date Range</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filters.dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="24h">Last 24h</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>
    </div>
  );
}