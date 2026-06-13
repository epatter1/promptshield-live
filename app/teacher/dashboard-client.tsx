"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});

import CategoryBadge from "./components/CategoryBadge";
import RiskBadge from "./components/RiskBadge";
import CategoryFilterBar from "./components/CategoryFilterBar";
import RiskFilterBar from "./components/RiskFilterBar";
import PromptDetailModal from "./components/PromptDetailModal";
import Tabs from "./components/Tabs";

import { EventRow } from "./types/EventRow";

type TabID = "session" | "all";

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
  "MANIPULATION",
];

export default function DashboardClient() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionEvents, setSessionEvents] = useState<EventRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState<TabID>("all");

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  const [modalSessionEvents, setModalSessionEvents] = useState<EventRow[] | null>(null);
  const [modalCurrentIndex, setModalCurrentIndex] = useState<number | null>(null);

  const [mobileSessionsOpen, setMobileSessionsOpen] = useState(false);

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

    setActiveTab("session");
  }, [selectedSession]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setRiskFilter(params.get("risk"));
    setCategoryFilter(params.get("category"));
  }, [searchParams]);
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const categoryMatch = categoryFilter ? e.classification === categoryFilter : true;
      const riskMatch = riskFilter ? e.riskLevel === riskFilter : true;
      return categoryMatch && riskMatch;
    });
  }, [events, categoryFilter, riskFilter]);

  const uniqueCategories = VALID_CATEGORIES.filter((cat) =>
    events.some((e) => e.classification === cat)
  );

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
      { offset: 1, color: "#111827" },
    ],
  };

  const mirrorBackground = {
    type: "radial",
    x: 0.5,
    y: 0.4,
    r: 0.9,
    colorStops: [
      { offset: 0, color: "#1f2937" },
      { offset: 1, color: "#111827" },
    ],
  };

  const riskCounts = filteredEvents.reduce(
    (acc: Record<string, number>, e) => {
      acc[e.riskLevel] = (acc[e.riskLevel] || 0) + 1;
      return acc;
    },
    {}
  );

  const riskChart = {
    backgroundColor: mirrorBackground,
    title: {
      text: "Risk Distribution",
      textStyle: { color: "#e5e7eb", fontSize: 12, width: "90%", overflow: "break" },
      left: "center",
    },
    xAxis: {
      type: "category",
      data: Object.keys(riskCounts),
      axisLine: { lineStyle: { color: "#9ca3af" } },
      axisLabel: { color: "#e5e7eb" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#9ca3af" } },
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },
    series: [
      {
        type: "bar",
        data: Object.values(riskCounts),
        itemStyle: { color: chromeGradient },
      },
    ],
  };

  const injectionPoints = filteredEvents
    .filter((e) => e.injectionDetected === 1)
    .map((e) => ({
      name: e.sessionId,
      value: [new Date(e.timestamp).getTime(), 1],
    }));

  const injectionChart = {
    backgroundColor: mirrorBackground,
    title: {
      text: "Injection Attempts Over Time",
      textStyle: { color: "#e5e7eb", fontSize: 12, width: "90%", overflow: "break" },
      left: "center",
    },
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
          shadowColor: "rgba(255,255,255,0.4)",
        },
      },
    ],
  };
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
    title: {
      text: "Latency Histogram",
      textStyle: { color: "#e5e7eb", fontSize: 12, width: "90%", overflow: "break" },
      left: "center",
    },
    xAxis: {
      type: "category",
      data: Object.keys(latencyBuckets),
      axisLabel: { color: "#e5e7eb" },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },
    series: [
      {
        type: "bar",
        data: Object.values(latencyBuckets),
        itemStyle: { color: chromeGradient },
      },
    ],
  };

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
    title: {
      text: "Session Activity Over Time",
      textStyle: { color: "#e5e7eb", fontSize: 12, width: "90%", overflow: "break" },
      left: "center",
    },
    xAxis: { type: "time", axisLabel: { color: "#e5e7eb" } },
    yAxis: {
      type: "value",
      axisLabel: { color: "#e5e7eb" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
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
              { offset: 1, color: "rgba(255,255,255,0)" },
            ],
          },
        },
      },
    ],
  };

  const uniqueSessions = Array.from(
    new Set(filteredEvents.map((e) => e.sessionId))
  );

  function openModal(event: EventRow) {
    setSelectedEvent(event);
    setModalSessionEvents(null);
    setModalCurrentIndex(null);

    fetch(`/api/session/${event.sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setModalSessionEvents(data.events);
        const idx = data.events.findIndex((e: EventRow) => e.id === event.id);
        setModalCurrentIndex(idx >= 0 ? idx : 0);
      });
  }

  function closeModal() {
    setSelectedEvent(null);
    setModalSessionEvents(null);
    setModalCurrentIndex(null);
  }

  function navigateModal(dir: "prev" | "next") {
    if (!modalSessionEvents || modalCurrentIndex === null) return;

    const newIndex =
      dir === "prev" ? modalCurrentIndex - 1 : modalCurrentIndex + 1;

    if (newIndex < 0 || newIndex >= modalSessionEvents.length) return;

    setModalCurrentIndex(newIndex);
    setSelectedEvent(modalSessionEvents[newIndex]);
  }

  const hasSessionsUnderFilters = uniqueSessions.length > 0;
  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-6 text-gray-100 overflow-x-hidden w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Teacher Dashboard</h1>

        <button
          onClick={refreshDashboard}
          className="px-3 py-2 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs md:text-sm font-medium flex items-center gap-2"
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

      {/* Filters */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-300">
            Risk Category
          </label>
          <CategoryFilterBar categories={uniqueCategories} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-300">
            Risk Level
          </label>
          <RiskFilterBar />
        </div>
      </div>

      {/* Responsive layout */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* LEFT: Session list (desktop only) */}
        <div className="hidden md:block md:col-span-1 border border-gray-700 rounded p-3 bg-gray-800 shadow">
          <h3 className="text-sm font-semibold mb-2">Sessions</h3>

          {!hasSessionsUnderFilters ? (
            <p className="text-gray-400 text-xs">
              No sessions match your current filters. Try adjusting category or risk.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {uniqueSessions.map((sessionId) => (
                <li key={sessionId}>
                  <button
                    onClick={() => setSelectedSession(sessionId)}
                    className={`w-full text-left px-2 py-1 rounded ${selectedSession === sessionId
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700 text-gray-200"
                      }`}
                  >
                    {sessionId}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: Charts + tabs + content */}
        <div className="md:col-span-3 space-y-6 overflow-x-hidden">
          {/* Charts */}
          <div className="space-y-6 w-full overflow-hidden">
            <ReactECharts option={riskChart} style={{ height: "220px" }} className="md:!h-[260px]" />
            <ReactECharts option={injectionChart} style={{ height: "220px" }} className="md:!h-[260px]" />
            <ReactECharts option={latencyChart} style={{ height: "220px" }} className="md:!h-[260px]" />
            <ReactECharts option={activityChart} style={{ height: "220px" }} className="md:!h-[260px]" />
          </div>

          {/* Tabs */}
          <Tabs
            tabs={[
              { id: "session", label: "Session Details" },
              { id: "all", label: "All Filtered Events" },
            ]}
            active={activeTab}
            onChange={(id) => setActiveTab(id as TabID)}
          />
          {/* Session Details */}
          {activeTab === "session" && (
            <div className="border border-gray-700 rounded p-4 bg-gray-800 shadow overflow-x-hidden">
              <h3 className="text-lg font-semibold mb-3">
                {selectedSession
                  ? `Session Details — ${selectedSession}`
                  : hasSessionsUnderFilters
                    ? "No session selected"
                    : "No sessions under current filters"}
              </h3>

              {!hasSessionsUnderFilters ? (
                <p className="text-gray-400">
                  No sessions match your filters. Try broadening category or risk.
                </p>
              ) : !selectedSession ? (
                <p className="text-gray-400">
                  Select a session from the left (desktop) or from the Sessions button (mobile).
                </p>
              ) : sessionEvents.length === 0 ? (
                <p className="text-gray-400">No events recorded for this session.</p>
              ) : (
                <ul className="space-y-2">
                  {sessionEvents.map((e) => (
                    <li
                      key={e.id ?? `${e.sessionId}-${e.timestamp}`}
                      onClick={() => openModal(e)}
                      className="cursor-pointer border border-gray-700 p-3 rounded bg-gray-900 hover:bg-gray-800 overflow-hidden"
                    >
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

                      <div><strong>Prompt:</strong></div>
                      <div className="max-w-full truncate text-gray-300">
                        {e.input}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* All Filtered Events */}
          {activeTab === "all" && (
            <div className="border border-gray-700 rounded p-4 bg-gray-800 shadow overflow-x-hidden">
              <h3 className="text-lg font-semibold mb-3">All Filtered Events</h3>

              {filteredEvents.length === 0 ? (
                <p className="text-gray-400">
                  No events match your current filters. Try adjusting category or risk.
                </p>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full text-left table-fixed">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 w-24 md:w-40 text-xs md:text-sm">Time</th>
                        <th className="w-24 md:w-32 text-xs md:text-sm">Category</th>
                        <th className="w-20 md:w-24 text-xs md:text-sm">Risk</th>
                        <th className="w-20 md:w-24 text-xs md:text-sm">Latency</th>
                        <th className="w-40 md:w-auto text-xs md:text-sm">Prompt</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEvents.map((event) => (
                        <tr
                          key={event.id ?? `${event.sessionId}-${event.timestamp}`}
                          onClick={() => openModal(event)}
                          className="cursor-pointer hover:bg-gray-800"
                        >
                          <td className="py-2 text-xs md:text-sm truncate">
                            {event.timestamp}
                          </td>
                          <td className="truncate">
                            <CategoryBadge category={event.classification} />
                          </td>
                          <td className="truncate">
                            <RiskBadge level={event.riskLevel} />
                          </td>
                          <td className="truncate">
                            {event.latencyMs}ms
                          </td>
                          <td className="max-w-xs truncate text-gray-300 text-xs md:text-sm">
                            {event.input}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Sessions bottom sheet trigger */}
      <button
        onClick={() => setMobileSessionsOpen(true)}
        className="md:hidden fixed bottom-4 right-4 px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-sm font-semibold shadow-lg flex items-center gap-2"
      >
        <span>Sessions</span>
        <span className="text-xs bg-gray-900 px-2 py-0.5 rounded-full border border-gray-600">
          {uniqueSessions.length}
        </span>
      </button>

      {/* Mobile: Sessions bottom sheet */}
      {mobileSessionsOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileSessionsOpen(false)}
          />

          {/* Bottom sheet */}
          <div className="absolute inset-x-0 bottom-0 bg-gray-900 border-t border-gray-700 rounded-t-xl p-4 max-h-[70vh] overflow-y-auto shadow-2xl max-w-full overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Sessions</h3>
              <button
                onClick={() => setMobileSessionsOpen(false)}
                className="text-gray-300 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>

            {!hasSessionsUnderFilters ? (
              <p className="text-gray-400 text-xs">
                No sessions match your current filters. Try adjusting category or risk.
              </p>
            ) : (
              <ul className="space-y-1 text-sm">
                {uniqueSessions.map((sessionId) => (
                  <li key={sessionId}>
                    <button
                      onClick={() => {
                        setSelectedSession(sessionId);
                        setMobileSessionsOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded ${selectedSession === sessionId
                          ? "bg-gray-700 text-white"
                          : "hover:bg-gray-700 text-gray-200"
                        }`}
                    >
                      {sessionId}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {selectedEvent && (
        <PromptDetailModal
          event={selectedEvent}
          sessionEvents={modalSessionEvents}
          currentIndex={modalCurrentIndex}
          onClose={closeModal}
          onNavigate={navigateModal}
        />
      )}
    </div>
  );
}