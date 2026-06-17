"use client";

import { useEffect, useState, useMemo } from "react";
import { EventRow } from "../types/EventRow";

import ChartsPanel from "./components/ChartsPanel";
import EventsTable from "./components/EventsTable";
import SessionDetails from "./components/sessions/SessionDetails";
import FiltersPanel from "./components/filters/FiltersPanel";
import PromptDetailModal from "./components/PromptDetailModal";
import ArchiveManager from "./components/archive/ArchiveManager";
import { CaretUp } from "./components/icons/Carets";

export default function DashboardClient({ events }: { events: EventRow[] }) {
  // Normalize IDs
  const normalize = (rows: EventRow[]) =>
    rows.map((e) => ({
      ...e,
      id: e.id != null ? String(e.id) : `${e.sessionId}-${e.timestamp}`,
      sessionId: String(e.sessionId),
    }));

  const [baseEvents, setBaseEvents] = useState<EventRow[]>(normalize(events));
  const [filteredEvents, setFilteredEvents] = useState<EventRow[]>(normalize(events));
  const [filtersActive, setFiltersActive] = useState(false);

  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  // ⭐ Sorting state moved up
  const [sortKey, setSortKey] = useState<
    "timestamp" | "sessionId" | "input" | "risk" | "category" | "latency"
  >("timestamp");

  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Load archive
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("archivedEvents");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        setArchivedIds(new Set(parsed));
      } catch {}
    }
  }, []);

  // Persist archive
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("archivedEvents", JSON.stringify([...archivedIds]));
  }, [archivedIds]);

  // Visible events = filtered minus archived
  const visibleEvents = filteredEvents.filter(
    (e) => !archivedIds.has(String(e.id))
  );

  // Manual refresh
  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/events");
      const data = await res.json();

      const normalized = normalize(data.events ?? []);

      const sorted = normalized.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setBaseEvents(sorted);

      if (!filtersActive) {
        setFilteredEvents(sorted);
      }
    } catch (err) {
      console.error("Manual refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-select first session
  useEffect(() => {
    if (!selectedSessionId && visibleEvents.length > 0) {
      setSelectedSessionId(visibleEvents[0].sessionId);
    }
  }, [visibleEvents, selectedSessionId]);

  // Individual selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select all / deselect all
  const toggleSelectAll = () => {
    if (selectedIds.size === visibleEvents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleEvents.map((e) => String(e.id))));
    }
  };

  // Archive selected
  const handleArchiveSelected = () => {
    if (selectedIds.size === 0) return;

    setArchivedIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(String(id)));
      return next;
    });

    setSelectedIds(new Set());
  };

  // Archive single event
  const handleArchiveEvent = (id: string) => {
    setArchivedIds((prev) => {
      const next = new Set(prev);
      next.add(String(id));
      return next;
    });

    if (selectedEvent?.id === id) {
      setSelectedEvent(null);
      setSelectedIndex(null);
    }
  };

  // Session events
  const sessionEvents = visibleEvents.filter(
    (e) => String(e.sessionId) === String(selectedSessionId)
  );

  // ⭐ Apply sorting to the final table list
  const tableEvents = useMemo(() => {
    const sorted = [...sessionEvents].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortKey) {
        case "timestamp":
          aVal = new Date(a.timestamp).getTime();
          bVal = new Date(b.timestamp).getTime();
          break;
        case "sessionId":
          aVal = a.sessionId;
          bVal = b.sessionId;
          break;
        case "input":
          aVal = a.input;
          bVal = b.input;
          break;
        case "risk":
          aVal = a.riskLevel;
          bVal = b.riskLevel;
          break;
        case "category":
          aVal = a.classification;
          bVal = b.classification;
          break;
        case "latency":
          aVal = a.latencyMs;
          bVal = b.latencyMs;
          break;
        default:
          aVal = 0;
          bVal = 0;
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [sessionEvents, sortKey, sortDir]);

  // Select event + index
  const handleSelectEvent = (event: EventRow, index: number) => {
    setSelectedEvent(event);
    setSelectedIndex(index);
  };

  // Navigate modal
  const handleNavigate = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= tableEvents.length) return;

    setSelectedEvent(tableEvents[newIndex]);
    setSelectedIndex(newIndex);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-4">
      {/* HEADER */}
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

      {/* MOBILE FILTERS */}
      <div className="lg:hidden mb-4">
        <FiltersPanel
          events={baseEvents}
          onFilterChange={(filtered, isFiltered) => {
            setFilteredEvents(filtered);
            setFiltersActive(isFiltered);
          }}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 max-w-[900px] flex flex-col gap-6">
          <div className="lg:hidden">
            <SessionDetails
              events={visibleEvents}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
            />
          </div>

          <ChartsPanel filteredEvents={visibleEvents} />

          <div id="events-table">
            <EventsTable
              events={tableEvents}
              onSelectEvent={handleSelectEvent}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onArchiveSelected={handleArchiveSelected}
              sortKey={sortKey}
              sortDir={sortDir}
              onSortChange={toggleSort}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
          <div className="hidden lg:block">
            <FiltersPanel
              events={baseEvents}
              onFilterChange={(filtered, isFiltered) => {
                setFilteredEvents(filtered);
                setFiltersActive(isFiltered);
              }}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("events-table")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-blue-400 hover:text-blue-300 text-sm underline font-bold inline-flex items-center gap-1"
            >
              Jump to Events
              <CaretUp className="h-3 w-3 align-middle" />
            </button>
          </div>

          <div className="hidden lg:block">
            <SessionDetails
              events={visibleEvents}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
            />
          </div>

          <div className="hidden lg:block">
            <ArchiveManager
              archivedIds={archivedIds}
              allEvents={baseEvents}
              onRestore={(id) => {
                setArchivedIds((prev) => {
                  const next = new Set(prev);
                  next.delete(String(id));
                  return next;
                });
              }}
              onRestoreAll={() => setArchivedIds(new Set())}
            />
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedEvent !== null && selectedIndex !== null && (
        <PromptDetailModal
          event={selectedEvent}
          index={selectedIndex}
          total={tableEvents.length}
          onClose={() => {
            setSelectedEvent(null);
            setSelectedIndex(null);
          }}
          onNavigate={handleNavigate}
          onArchiveEvent={handleArchiveEvent}
        />
      )}
    </div>
  );
}