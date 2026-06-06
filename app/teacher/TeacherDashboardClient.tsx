"use client";

import { useEffect, useState } from "react";
import type { EventRecord } from "@/app/types/EventRecord";

import RiskDistributionChart from "./components/RiskDistributionChart";
import InjectionAttemptsChart from "./components/InjectionAttemptsChart";
import LatencyHistogramChart from "./components/LatencyHistogramChart";
import SessionActivityChart from "./components/SessionActivityChart";

export default function TeacherDashboardClient() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-gray-600">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-8">
      <p className="text-gray-600">Monitoring {events.length} recent events</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Risk Distribution</h2>
          <div className="h-64">
            <RiskDistributionChart events={events} />
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Injection Attempts</h2>
          <div className="h-64">
            <InjectionAttemptsChart events={events} />
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Latency</h2>
          <div className="h-64">
            <LatencyHistogramChart events={events} />
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Session Activity</h2>
          <div className="h-64">
            <SessionActivityChart events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}