"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

import CategoryBadge from "./components/CategoryBadge";
import RiskBadge from "./components/RiskBadge";
import CategoryFilterBar from "./components/CategoryFilterBar";
import RiskFilterBar from "./components/RiskFilterBar";

type EventRow = {
  id: number;
  timestamp: string;
  sessionId: string;
  input: string;
  rawResponse: string | null;
  safeResponse: string | null;
  classification: string;
  riskLevel: string;
  evalToxicity: number;
  rewriteApplied: number;
  injectionDetected: number;
  latencyMs: number;
  modelName: string;
};

// ⭐ OFFICIAL CATEGORY WHITELIST
const VALID_CATEGORIES = [
  "GENERAL",
  "SAFE",
  "PII",
  "CONFIDENTIAL",
  "FRAUD",
  "VIOLENCE",
  "SELF_HARM",
  "EXTREMISM",
  "HATE",
  "MALWARE",
  "JAILBREAK",
  "MANIPULATION"
];

export default function DashboardClient() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionEvents, setSessionEvents] = useState<EventRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string | null>(null);

  async function loadEvents() {
    const res = await fetch("/api/events", { cache: "no-store" });
    const data = await res.json();
    setEvents(data.events);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function refreshDashboard() {
    setRefreshing(true);
    await loadEvents();

    if (selectedSession) {
      const res = await fetch(`/api/session/${selectedSession}`, { cache: "no-store" });
      const data = await res.json();
      setSessionEvents(data.events);
    }

    setRefreshing(false);
  }

  useEffect(() => {
    if (!selectedSession) return;

    fetch(`/api/session/${selectedSession}`)
      .then((res) => res.json())
      .then((data) => setSessionEvents(data.events));
  }, [selectedSession]);

  // ⭐ CLEAN CATEGORY FILTERING
  const filteredEvents = events.filter((e) => {
    const categoryMatch = categoryFilter ? e.classification === categoryFilter : true;
    const riskMatch = riskFilter ? e.riskLevel === riskFilter : true;
    return categoryMatch && riskMatch;
  });

  // ⭐ ONLY SHOW VALID CATEGORIES THAT ACTUALLY APPEAR
  const uniqueCategories = VALID_CATEGORIES.filter((cat) =>
    events.some((e) => e.classification === cat)
  );

  // ---- Risk distribution ----
  const riskCounts = filteredEvents.reduce(
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
  const injectionPoints = filteredEvents
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
  for (const e of filteredEvents) {
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

  for (const e of filteredEvents) {
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

  const uniqueSessions = Array.from(
    new Set(filteredEvents.map((e) => e.sessionId))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>

        <button
          onClick={refreshDashboard}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium flex items-center gap-2"
        >
          {refreshing && (
            <svg
              className="animate-spin h-4 w-4 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          )}
          <strong>Refresh</strong>
        </button>
      </div>

      {/* CATEGORY FILTER BAR */}
      <CategoryFilterBar
        categories={uniqueCategories}
        active={categoryFilter}
        onSelect={setCategoryFilter}
      />

      {/* RISK FILTER BAR */}
      <RiskFilterBar
        active={riskFilter}
        onSelect={setRiskFilter}
      />

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
                    <li key={i} className="border p-2 rounded bg-gray-50">
                      <div><strong>Time:</strong> {e.timestamp}</div>

                      <div className="flex items-center gap-2">
                        <strong>Category:</strong>
                        <CategoryBadge category={e.classification} />
                      </div>

                      <div className="flex items-center gap-2">
                        <strong>Risk:</strong>
                        <RiskBadge level={e.riskLevel} />
                      </div>

                      <div><strong>Risk Score:</strong> {e.evalToxicity}</div>
                      <div><strong>Injection:</strong> {e.injectionDetected}</div>
                      <div><strong>Latency:</strong> {e.latencyMs}ms</div>

                      <div><strong>Input:</strong></div>
                      <pre className="bg-white p-2 rounded border whitespace-pre-wrap">
                        {e.input}
                      </pre>

                      {e.safeResponse && (
                        <>
                          <div><strong>Safe Response:</strong></div>
                          <pre className="bg-white p-2 rounded border whitespace-pre-wrap">
                            {e.safeResponse}
                          </pre>
                        </>
                      )}

                      {e.rawResponse && (
                        <>
                          <div><strong>Raw Response:</strong></div>
                          <pre className="bg-white p-2 rounded border whitespace-pre-wrap">
                            {e.rawResponse}
                          </pre>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}