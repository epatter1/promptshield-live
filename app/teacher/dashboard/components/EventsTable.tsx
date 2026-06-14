"use client";

import { EventRow } from "../../types/EventRow";
import { RISK_COLORS, CATEGORY_COLORS, BADGE_BASE } from "../../types/theme";

export default function EventsTable({
  events,
  onSelectEvent,
}: {
  events: EventRow[];
  onSelectEvent: (event: EventRow) => void;
}) {
  // Sort newest → oldest
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="w-full overflow-x-auto rounded-lg bg-gray-900 border border-gray-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-100">All Filtered Events</h2>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-blue-400 hover:text-blue-300 text-xs underline font-bold"
        >
          Back to Top ↑
        </button>
      </div>

      <table className="min-w-max w-full text-xs text-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Session</th>
            <th className="px-4 py-2 text-left">Input</th>
            <th className="px-4 py-2 text-left">Risk</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Latency</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((event) => (
            <tr
              key={event.id ?? `${event.sessionId}-${event.timestamp}`}
              className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer"
              onClick={() => onSelectEvent(event)}
            >
              <td className="px-4 py-2 whitespace-nowrap">
                {new Date(event.timestamp).toLocaleString()}
              </td>

              <td className="px-4 py-2 whitespace-nowrap">{event.sessionId}</td>

              <td
                className="px-4 py-2 max-w-[300px] truncate"
                title={event.input}
              >
                {event.input}
              </td>

              <td className="px-4 py-2 whitespace-nowrap">
                <span className={`${BADGE_BASE} ${RISK_COLORS[event.riskLevel]}`}>
                  {event.riskLevel}
                </span>
              </td>

              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`${BADGE_BASE} ${
                    CATEGORY_COLORS[event.classification] ??
                    "bg-gray-700 text-gray-200 border border-gray-600"
                  }`}
                >
                  {event.classification}
                </span>
              </td>

              <td className="px-4 py-2 whitespace-nowrap">{event.latencyMs} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}