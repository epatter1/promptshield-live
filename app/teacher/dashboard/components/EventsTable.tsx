"use client";

import { EventRow } from "../../types/EventRow";
import { RISK_COLORS, CATEGORY_COLORS, BADGE_BASE } from "../../types/theme";
import { useEffect, useRef } from "react";
import { CaretUp, CaretDown } from "./icons/Carets";

interface EventsTableProps {
  events: EventRow[];
  onSelectEvent: (event: EventRow) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onArchiveSelected: () => void;
}

export default function EventsTable({
  events,
  onSelectEvent,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onArchiveSelected,
}: EventsTableProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const allSelected = selectedIds.size === sorted.length && sorted.length > 0;
  const someSelected =
    selectedIds.size > 0 && selectedIds.size < sorted.length;

  // ⭐ Indeterminate checkbox
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  return (
    <div className="w-full overflow-x-auto rounded-lg bg-gray-900 border border-gray-800">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-100">
          All Filtered Events
        </h2>

        <div className="flex items-center gap-3">
          {/* ⭐ Fade-in/out Archive Selected */}
          <div
            className={`transition-opacity duration-200 ${selectedIds.size > 0
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

          {/* ⭐ Back to Top with caret */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-blue-400 hover:text-blue-300 text-sm underline font-bold inline-flex items-center gap-1"
          >
            Back to Top
            <CaretUp className="h-3 w-3 align-middle" />
          </button>

        </div>
      </div>

      {/* TABLE */}
      <table className="min-w-max w-full text-xs text-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
              />
            </th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Session</th>
            <th className="px-4 py-2 text-left">Input</th>
            <th className="px-4 py-2 text-left">Risk</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Latency</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((event) => {
            const id = String(event.id);
            const checked = selectedIds.has(id);

            return (
              <tr
                key={id}
                className={`border-t border-gray-800 cursor-pointer transition-colors duration-150
                  ${checked
                    ? "bg-gray-800/70 hover:bg-gray-800/80"
                    : "hover:bg-gray-800"
                  }
                `}
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleSelect(id)}
                  />
                </td>

                <td
                  className="px-4 py-2 whitespace-nowrap"
                  onClick={() => onSelectEvent(event)}
                >
                  {new Date(event.timestamp).toLocaleString()}
                </td>

                <td
                  className="px-4 py-2 whitespace-nowrap"
                  onClick={() => onSelectEvent(event)}
                >
                  {event.sessionId}
                </td>

                <td
                  className="px-4 py-2 max-w-[300px] truncate"
                  title={event.input}
                  onClick={() => onSelectEvent(event)}
                >
                  {event.input}
                </td>

                <td
                  className="px-4 py-2 whitespace-nowrap"
                  onClick={() => onSelectEvent(event)}
                >
                  <span className={`${BADGE_BASE} ${RISK_COLORS[event.riskLevel]}`}>
                    {event.riskLevel}
                  </span>
                </td>

                <td
                  className="px-4 py-2 whitespace-nowrap"
                  onClick={() => onSelectEvent(event)}
                >
                  <span
                    className={`${BADGE_BASE} ${CATEGORY_COLORS[event.classification] ??
                      "bg-gray-700 text-gray-200 border border-gray-600"
                      }`}
                  >
                    {event.classification}
                  </span>
                </td>

                <td
                  className="px-4 py-2 whitespace-nowrap"
                  onClick={() => onSelectEvent(event)}
                >
                  {event.latencyMs} ms
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}