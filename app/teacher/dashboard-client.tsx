"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

type EventRow = {
  timestamp: string;
  riskLevel: string;
  injectionDetected: number;
  latencyMs: number;
  sessionId: string;
  input: string;
};

export default function DashboardClient() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionEvents, setSessionEvents] = useState<EventRow[]>([]);

  // Load all events
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events));
  }, []);

  // Load events for selected session
  useEffect(() => {
    if (!selectedSession) return;

    fetch(`/api/session/${selectedSession}`)
      .then((res) => res.json())
      .then((data) => setSessionEvents(data.events));
  }, [selectedSession]);

  // ---- Risk distribution ----
  const riskCounts = events.reduce(
    (acc: Record<string, number>, e) => {
      acc[e.riskLevel] = (acc[e.riskLevel] || 0) + 1;
      return acc;
    },
    {}
  );

  const riskChart = {
    title: { text: "Risk Distribution" },
    xAxis: { type: "category", data: Object.keys(riskCounts) },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: Object.values(riskCounts),
        itemStyle: { color: "#3b82f6" },
      },
    ],
  };

  // ---- Injection timeline ----
  const injectionPoints = events
    .filter((e) => e.injectionDetected === 1)
    .map((e) => ({
      name: e.sessionId,
      value: [new Date(e.timestamp).getTime(), 1],
    }));

  const injectionChart = {
    title: { text: "Injection Attempts Over Time" },
    xAxis: { type: "time" },
    yAxis: { type: "value", show: false },
    series: [
      {
        type: "scatter",
        data: injectionPoints,
        symbolSize: 12,
        itemStyle: { color: "#ef4444" },
      },
    ],
  };

  // ---- Latency histogram ----
  const latencyBuckets: Record<string, number> = {};
  for (const e of events) {
    const bucket =
      e.latencyMs < 250
        ? "<250ms"
        : e.latencyMs < 500
        ? "250-500ms"
        : e.latencyMs < 1000
        ? "500ms-1s"
        : ">1s";
    latencyBuckets[bucket] = (latencyBuckets[bucket] || 0) + 1;
  }

  const latencyChart = {
    title: { text: "Latency Histogram" },
    xAxis: { type: "category", data: Object.keys(latencyBuckets) },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: Object.values(latencyBuckets),
        itemStyle: { color: "#10b981" },
      },
    ],
  };

  // ---- Session Activity Timeline ----
  const activityMap: Record<string, number> = {};

  for (const e of events) {
    const minute = new Date(e.timestamp);
    minute.setSeconds(0, 0);
    const key = minute.toISOString();
    activityMap[key] = (activityMap[key] || 0) + 1;
  }

  const activityData = Object.entries(activityMap).map(([time, count]) => ({
    value: [new Date(time).getTime(), count],
  }));

  const activityChart = {
    title: { text: "Session Activity Over Time" },
    xAxis: { type: "time" },
    yAxis: { type: "value" },
    series: [
      {
        type: "line",
        data: activityData,
        smooth: true,
        lineStyle: { color: "#6366f1", width: 3 },
        areaStyle: { color: "rgba(99, 102, 241, 0.2)" },
      },
    ],
  };

  // ---- Unique sessions ----
  const uniqueSessions = Array.from(
    new Set(events.map((e) => e.sessionId))
  );

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Session List */}
      <div className="col-span-1 border-r pr-4">
        <h3 className="text-lg font-semibold mb-3">Sessions</h3>

        <div className="space-y-2">
          {uniqueSessions.map((id) => (
            <button
              key={id}
              onClick={() => setSelectedSession(id)}
              className={`block w-full text-left p-2 rounded ${
                selectedSession === id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Charts + Drill Down */}
      <div className="col-span-3 space-y-8">
        <ReactECharts option={riskChart} style={{ height: 300 }} />
        <ReactECharts option={injectionChart} style={{ height: 300 }} />
        <ReactECharts option={latencyChart} style={{ height: 300 }} />
        <ReactECharts option={activityChart} style={{ height: 300 }} />

        {/* Drill-down panel */}
        {selectedSession && (
          <div className="border rounded p-4 bg-white shadow">
            <h3 className="text-lg font-semibold mb-3">
              Session Details — {selectedSession}
            </h3>

            {sessionEvents.length === 0 ? (
              <p className="text-gray-500">No events recorded for this session.</p>
            ) : (
              <ul className="space-y-2">
                {sessionEvents.map((e, i) => (
                  <li
                    key={i}
                    className="border p-2 rounded bg-gray-50"
                  >
                    <div><strong>Time:</strong> {e.timestamp}</div>
                    <div><strong>Risk:</strong> {e.riskLevel}</div>
                    <div><strong>Injection:</strong> {e.injectionDetected}</div>
                    <div><strong>Latency:</strong> {e.latencyMs}ms</div>
                    <div><strong>Input:</strong> {e.input}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}