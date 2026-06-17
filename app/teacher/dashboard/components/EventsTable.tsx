"use client";

import { useEffect, useRef } from "react";
import { EventRow } from "../../types/EventRow";
import { RISK_COLORS, CATEGORY_COLORS, BADGE_BASE } from "../../types/theme";
import { CaretUp, CaretDown } from "./icons/Carets";

interface EventsTableProps {
  events: EventRow[];
  onSelectEvent: (event: EventRow, index: number) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onArchiveSelected: () => void;

  sortKey: "timestamp" | "sessionId" | "input" | "risk" | "category" | "latency";
  sortDir: "asc" | "desc";
  onSortChange: (key: "timestamp" | "sessionId" | "input" | "risk" | "category" | "latency") => void;
}

export default function EventsTable({
  events,
  onSelectEvent,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onArchiveSelected,
  sortKey,
  sortDir,
  onSortChange,
}: EventsTableProps) {
  const allSelected = selectedIds.size === events.length && events.length > 0;
  const someSelected =
    selectedIds.size > 0 && selectedIds.size < events.length;

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const renderSortCaret = (key: typeof sortKey) => {
    if (sortKey !== key) return null;
    return sortDir === "asc" ? (
      <CaretUp className="h-3 w-3 inline-block ml-1" />
    ) : (
      <CaretDown className="h-3 w-3 inline-block ml-1" />
    );
  };

  return (
    <div className="w-full rounded-lg bg-gray-900 border border-gray-800">
      <div id="events-table-top"></div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-100">
          All Filtered Events
        </h2>

        <div className="flex items-center gap-4">
          <div
            className={`transition-opacity duration-200 ${
              selectedIds.size > 0
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              onClick={onArchiveSelected}
              className="px-3 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded border border-red-900 font-bold"
            >
              Archive Selected ({selectedIds.size})
            </button>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-blue-400 hover:text-blue-300 text-sm underline font-bold inline-flex items-center gap-1"
          >
            Back to Top
            <CaretUp className="h-3 w-3 align-middle" />
          </button>
        </div>
      </div>

      <div>
        <table className="table-fixed min-w-full w-full text-xs text-gray-200">
          <thead className="bg-gray-800 sticky top-[40px] z-10">
            <tr>
              <th className="px-4 py-2 text-left w-8">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                />
              </th>

              <th
                className="px-4 py-2 text-left cursor-pointer select-none w-40"
                onClick={() => onSortChange("timestamp")}
              >
                Time {renderSortCaret("timestamp")}
              </th>

              <th
                className="px-4 py-2 text-left cursor-pointer select-none w-32"
                onClick={() => onSortChange("sessionId")}
              >
                Session {renderSortCaret("sessionId")}
              </th>

              <th
                className="px-4 py-2 text-left cursor-pointer select-none"
                onClick={() => onSortChange("input")}
              >
                Input {renderSortCaret("input")}
              </th>

              <th
                className="px-4 py-2 text-left cursor-pointer select-none w-24"
                onClick={() => onSortChange("risk")}
              >
                Risk {renderSortCaret("risk")}
              </th>

              <th
                className="px-4 py-2 text-left cursor-pointer select-none w-32"
                onClick={() => onSortChange("category")}
              >
                Category {renderSortCaret("category")}
              </th>

              <th
                className="px-4 py-2 text-left cursor-pointer select-none w-24"
                onClick={() => onSortChange("latency")}
              >
                Latency {renderSortCaret("latency")}
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((event, index) => {
              const id = String(event.id);
              const checked = selectedIds.has(id);

              return (
                <tr
                  key={id}
                  onClick={() => onSelectEvent(event, index)}
                  className={`border-t border-gray-800 cursor-pointer transition-colors duration-150 ${
                    checked
                      ? "bg-gray-800/70 hover:bg-gray-800/80"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <td
                    className="px-4 py-2 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleSelect(id)}
                    />
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap max-w-0 overflow-hidden text-ellipsis w-40">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap max-w-0 overflow-hidden text-ellipsis w-32">
                    {event.sessionId}
                  </td>

                  <td
                    className="px-4 py-2 max-w-[300px] truncate overflow-hidden"
                    title={event.input}
                  >
                    {event.input}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap max-w-0 overflow-hidden w-24">
                    <span
                      className={`${BADGE_BASE} ${RISK_COLORS[event.riskLevel]}`}
                    >
                      {event.riskLevel}
                    </span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap max-w-0 overflow-hidden w-32">
                    <span
                      className={`${BADGE_BASE} ${
                        CATEGORY_COLORS[event.classification] ??
                        "bg-gray-700 text-gray-200 border border-gray-600"
                      }`}
                    >
                      {event.classification}
                    </span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap max-w-0 overflow-hidden w-24">
                    {event.latencyMs} ms
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-gray-800 bg-gray-900 flex justify-end">
          <button
            onClick={() => {
              const tableTop = document.querySelector("#events-table-top");
              tableTop?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-blue-400 hover:text-blue-300 text-sm underline font-bold inline-flex items-center gap-1"
          >
            Back to Top
            <CaretUp className="h-3 w-3 align-middle" />
          </button>
        </div>
      </div>
    </div>
  );
}