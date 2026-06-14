"use client";

import { useEffect, useState } from "react";
import { EventRow } from "../types/EventRow";

import ChartsPanel from "./components/ChartsPanel";
import EventsTable from "./components/EventsTable";
import SessionDetails from "./components/sessions/SessionDetails";
import FiltersPanel from "./components/filters/FiltersPanel";
import PromptDetailModal from "./components/PromptDetailModal";

export default function DashboardClient({ events }: { events: EventRow[] }) {
  const [filteredEvents, setFilteredEvents] = useState<EventRow[]>(events);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Always compute newest timestamp safely
  const newestTimestamp = filteredEvents.length
    ? new Date(filteredEvents[0].timestamp).getTime()
    : 0;

  // Manual refresh handler
  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/events");
      const data = await res.json();

      const sorted = (data.events ?? []).sort(
        (a: EventRow, b: EventRow) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setFilteredEvents(sorted);
    } catch (err) {
      console.error("Manual refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-select most recent session
  useEffect(() => {
    if (!selectedSessionId && filteredEvents.length > 0) {
      setSelectedSessionId(filteredEvents[0].sessionId);
    }
  }, [filteredEvents, selectedSessionId]);

  // AUTO-REFRESH ONLY WHEN A NEW PROMPT ARRIVES
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();

        const incomingEvents: EventRow[] = (data.events ?? []).sort(
          (a: EventRow, b: EventRow) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        if (incomingEvents.length === 0) return;

        const incomingNewest = new Date(incomingEvents[0].timestamp).getTime();

        if (incomingNewest > newestTimestamp) {
          setFilteredEvents(incomingEvents);
        }
      } catch (err) {
        console.error("Auto-refresh failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [newestTimestamp]);

  // All events in the selected session
  const sessionEvents = filteredEvents.filter(
    (e) => e.sessionId === selectedSessionId
  );

  // Index of selected event
  const currentIndex =
    selectedEvent && sessionEvents.length > 0
      ? sessionEvents.findIndex((e) => e.id === selectedEvent.id)
      : null;

  // Prev/Next navigation
  const handleNavigate = (dir: "prev" | "next") => {
    if (currentIndex === null) return;

    const nextIndex =
      dir === "next"
        ? Math.min(currentIndex + 1, sessionEvents.length - 1)
        : Math.max(currentIndex - 1, 0);

    setSelectedEvent(sessionEvents[nextIndex]);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-4">

      {/* DASHBOARD TITLE + MANUAL REFRESH */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">
          Teacher Dashboard
        </h1>

        <button
          onClick={handleManualRefresh}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-bold text-gray-100 flex items-center gap-2"
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
          Refresh
        </button>
      </div>

      {/* MOBILE FILTERS ABOVE EVERYTHING */}
      <div className="lg:hidden mb-4">
        <FiltersPanel
          events={events}
          onFilterChange={setFilteredEvents}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT COLUMN — Charts + Table */}
        <div className="flex-1 max-w-[900px] flex flex-col gap-6">

          {/* Mobile: Session Details above charts */}
          <div className="lg:hidden">
            <SessionDetails
              events={filteredEvents}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
            />
          </div>

          <ChartsPanel filteredEvents={filteredEvents} />

          <div id="events-table">
            <EventsTable
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
            />
          </div>
        </div>

        {/* RIGHT COLUMN — Filters + Sessions (DESKTOP ONLY) */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">

          <div className="hidden lg:block">
            <FiltersPanel
              events={events}
              onFilterChange={setFilteredEvents}
            />
          </div>

          <button
            onClick={() =>
              document.getElementById("events-table")?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-blue-400 hover:text-blue-300 text-sm underline font-bold"
          >
            Jump to Events ↓
          </button>

          <div className="hidden lg:block">
            <SessionDetails
              events={filteredEvents}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
            />
          </div>
        </div>
      </div>

      {/* MODAL */}
      <PromptDetailModal
        event={selectedEvent}
        sessionEvents={sessionEvents}
        currentIndex={currentIndex}
        onClose={() => setSelectedEvent(null)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}