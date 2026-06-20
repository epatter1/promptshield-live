"use client";

import { useMemo } from "react";
import { EventRow } from "../../types/EventRow";

// ---------------------------------------------
// Strong, explicit types for all chart outputs
// ---------------------------------------------

export type RiskLevel = "high" | "medium" | "low";

export interface RiskCounts {
  high: number;
  medium: number;
  low: number;
}

export interface InjectionPoint {
  timestamp: string;
  value: number;
}

export interface LatencyBucket {
  label: string;
  count: number;
}

export interface ActivityPoint {
  value: [number, number]; // [timestampMs, count]
}

// ---------------------------------------------
// Hook
// ---------------------------------------------

export default function useChartOptions(filteredEvents: EventRow[]) {
  //
  // 1. RISK DISTRIBUTION
  //
  const riskCounts: RiskCounts = useMemo(() => {
    const counts: RiskCounts = { high: 0, medium: 0, low: 0 };

    for (const e of filteredEvents) {
      const level = e.riskLevel as RiskLevel;
      if (level in counts) counts[level]++;
    }

    return counts;
  }, [filteredEvents]);

  //
  // 2. INJECTION ATTEMPTS
  //
  const injectionPoints: InjectionPoint[] = useMemo(() => {
    return filteredEvents.map((e) => ({
      timestamp: new Date(e.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: e.injectionDetected ? 1 : 0,
    }));
  }, [filteredEvents]);

  //
  // 3. LATENCY HISTOGRAM
  //
  const latencyBuckets: LatencyBucket[] = useMemo(() => {
    const bucketMap: Record<string, number> = {};

    for (const e of filteredEvents) {
      const bucket =
        e.latencyMs < 250
          ? "<250ms"
          : e.latencyMs < 500
          ? "250–500ms"
          : e.latencyMs < 1000
          ? "500ms–1s"
          : ">1s";

      bucketMap[bucket] = (bucketMap[bucket] || 0) + 1;
    }

    return Object.entries(bucketMap).map(([label, count]) => ({
      label,
      count,
    }));
  }, [filteredEvents]);

  //
  // 4. ACTIVITY OVER TIME (minute buckets)
  //
  const activityData: ActivityPoint[] = useMemo(() => {
    const map: Record<string, number> = {};

    for (const e of filteredEvents) {
      const minute = new Date(e.timestamp);
      minute.setSeconds(0, 0);
      const key = minute.toISOString();
      map[key] = (map[key] || 0) + 1;
    }

    return Object.entries(map).map(([time, count]) => ({
      value: [new Date(time).getTime(), count],
    }));
  }, [filteredEvents]);

  return {
    riskCounts,
    injectionPoints,
    latencyBuckets,
    activityData,
  };
}