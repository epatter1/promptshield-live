// ——— SAME IMPORTS ———
"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

import CategoryBadge from "./components/CategoryBadge";
import RiskBadge from "./components/RiskBadge";
import CategoryFilterBar from "./components/CategoryFilterBar";
import RiskFilterBar from "./components/RiskFilterBar";

// ——— SAME TYPES ———
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
  // ——— SAME STATE ———
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionEvents, setSessionEvents] = useState<EventRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string | null>(null);

  // ——— SAME FETCH LOGIC ———
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

  // ——— FILTERING ———
  const filteredEvents = events.filter((e) => {
    const categoryMatch = categoryFilter ? e.classification === categoryFilter : true;
    const riskMatch = riskFilter ? e.riskLevel === riskFilter : true;
    return categoryMatch && riskMatch;
  });

  const uniqueCategories = VALID_CATEGORIES.filter((cat) =>
    events.some((e) => e.classification === cat)
  );

  // ——— MIRROR THEME COLORS ———
  const chromeGradient = {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: "#ffffff" },
      { offset: 0.25, color: "#d1d5db" },
      { offset: 0.5, color: "#9ca3af" },
      { offset: 0.75, color: "#6b7280" },
      { offset: 1, color: "#111827" }
    ]
  };

  const mirrorBackground = {
    type: "radial",
    x: 0.5,
    y: 0.4,
    r: 0.9,
    colorStops: [
      { offset: 0, color: "#1f2937" },
      { offset: 1, color: "#111827" }
    ]
  };

  // ——— RISK CHART ———
  const riskCounts = filteredEvents.reduce(
    (acc: Record<string, number>, e) => {
      acc[e.riskLevel] = (acc[e.riskLevel] || 0) + 1;
      return acc;
    },
    {}
  );

  const riskChart = {
    backgroundColor: mirrorBackground,
    title: { text: "Risk Distribution", textStyle: { color: "#e5e7eb" } },
    xAxis: {
      type: "category",
      data: Object.keys(riskCounts),
      axisLine: { lineStyle: { color: "#9ca3af" } },
      axisLabel: { color: "#e5e7eb" }
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#9ca3af" } },
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } }
    },
    series: [
      {
        type: "bar",
        data: Object.values(riskCounts),
        itemStyle: { color: chromeGradient },
      },
    ],
  };

  // ——— INJECTION CHART ———
  const injectionPoints = filteredEvents
    .filter((e) => e.injectionDetected === 1)
    .map((e) => ({
      name: e.sessionId,
      value: [new Date(e.timestamp).getTime(), 1],
    }));

  const injectionChart = {
    backgroundColor: mirrorBackground,
    title: { text: "Injection Attempts Over Time", textStyle: { color: "#e5e7eb" } },
    xAxis: { type: "time", axisLabel: { color: "#e5e7eb" } },
    yAxis: { type: "value", show: false },
    series: [
      {
        type: "scatter",
        data: injectionPoints,
        symbolSize: 14,
        itemStyle: {
          color: chromeGradient,
          shadowBlur: 20,
          shadowColor: "rgba(255,255,255,0.4)"
        },
      },
    ],
  };

  // ——— LATENCY CHART ———
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
    backgroundColor: mirrorBackground,
    title: { text: "Latency Histogram", textStyle: { color: "#e5e7eb" } },
    xAxis: {
      type: "category",
      data: Object.keys(latencyBuckets),
      axisLabel: { color: "#e5e7eb" }
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } }
    },
    series: [
      {
        type: "bar",
        data: Object.values(latencyBuckets),
        itemStyle: { color: chromeGradient },
      },
    ],
  };

  // ——— ACTIVITY CHART ———
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
    backgroundColor: mirrorBackground,
    title: { text: "Session Activity Over Time", textStyle: { color: "#e5e7eb" } },
    xAxis: { type: "time", axisLabel: { color: "#e5e7eb" } },
    yAxis: {
      type: "value",
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } }
    },
    series: [
      {
        type: "line",
        data: activityData,
        smooth: true,
        lineStyle: { color: "#f3f4f6", width: 3 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(255,255,255,0.4)" },
              { offset: 1, color: "rgba(255,255,255,0)" }
            ]
          }
        },
      },
    ],
  };

  // ——— UNIQUE SESSIONS ———
  const uniqueSessions = Array.from(
    new Set(filteredEvents.map((e) => e.sessionId))
  );

  // ——— RENDER ———
  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6 text-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>

        <button
          onClick={refreshDashboard}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium flex items-center gap-2"
        >
          {refreshing && (
            <svg
              className="animate-spin h-4 w-4 text-gray-300"
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

      <CategoryFilterBar
        categories={uniqueCategories}
        active={categoryFilter}
        onSelect={setCategoryFilter}
      />

      <RiskFilterBar
        active={riskFilter}
        onSelect={setRiskFilter}
      />

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 border-r border-gray-700 pr-4">
          <h3 className="text-lg font-semibold mb-3">Sessions</h3>

          <div className="space-y-2">
            {uniqueSessions.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedSession(id)}
                className={`block w-full text-left p-2 rounded ${
                  selectedSession === id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-3 space-y-8">
          <ReactECharts option={riskChart} style={{ height: 300 }} />
          <ReactECharts option={injectionChart} style={{ height: 300 }} />
          <ReactECharts option={latencyChart} style={{ height: 300 }} />
          <ReactECharts option={activityChart} style={{ height: 300 }} />

          {selectedSession && (
            <div className="border border-gray-700 rounded p-4 bg-gray-800 shadow">
              <h3 className="text-lg font-semibold mb-3">
                Session Details — {selectedSession}
              </h3>

              {sessionEvents.length === 0 ? (
                <p className="text-gray-400">No events recorded for this session.</p>
              ) : (
                <ul className="space-y-2">
                  {sessionEvents.map((e, i) => (
                    <li key={i} className="border border-gray-700 p-2 rounded bg-gray-900">
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
                      <pre className="bg-gray-800 p-2 rounded border border-gray-700 whitespace-pre-wrap">
                        {e.input}
                      </pre>

                      {e.safeResponse && (
                        <>
                          <div><strong>Safe Response:</strong></div>
                          <pre className="bg-gray-800 p-2 rounded border border-gray-700 whitespace-pre-wrap">
                            {e.safeResponse}
                          </pre>
                        </>
                      )}

                      {e.rawResponse && (
                        <>
                          <div><strong>Raw Response:</strong></div>
                          <pre className="bg-gray-800 p-2 rounded border border-gray-700 whitespace-pre-wrap">
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