"use client";

import { useMemo } from "react";
import { EventRow } from "../../types/EventRow";

type ChartOptions = {
  riskCounts: Record<string, number>;
  injectionPoints: { name: string; value: [number, number] }[];
  latencyBuckets: Record<string, number>;
  activityData: { value: [number, number] }[];
};

export default function useChartOptions(events: EventRow[]): ChartOptions {
  const riskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => {
      const key = e.riskLevel || "UNKNOWN";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [events]);

  const injectionPoints = useMemo(() => {
    return events
      .filter((e) => e.injectionDetected === 1)
      .map((e) => ({
        name: e.sessionId,
        value: [
          new Date(e.timestamp).getTime(),
          1,
        ] as [number, number],
      }));
  }, [events]);

  const latencyBuckets = useMemo(() => {
    const buckets: Record<string, number> = {};

    for (const e of events) {
      const bucket =
        e.latencyMs < 250
          ? "<250ms"
          : e.latencyMs < 500
          ? "250–500ms"
          : e.latencyMs < 1000
          ? "500ms–1s"
          : ">1s";

      buckets[bucket] = (buckets[bucket] || 0) + 1;
    }

    return buckets;
  }, [events]);

  const activityData = useMemo(() => {
    const map: Record<string, number> = {};

    for (const e of events) {
      const minute = new Date(e.timestamp);
      minute.setSeconds(0, 0);
      const key = minute.toISOString();
      map[key] = (map[key] || 0) + 1;
    }

    return Object.entries(map).map(([time, count]) => ({
      value: [
        new Date(time).getTime(),
        count,
      ] as [number, number],
    }));
  }, [events]);

  return {
    riskCounts,
    injectionPoints,
    latencyBuckets,
    activityData,
  };
}