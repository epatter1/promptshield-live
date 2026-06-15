"use client";

import { EventRow } from "../../../types/EventRow";
import { BADGE_BASE, RISK_COLORS, CATEGORY_COLORS } from "../../../types/theme";

interface ArchiveManagerProps {
  archivedIds: Set<string>;
  allEvents: EventRow[];
  onRestore: (id: string) => void;
  onRestoreAll: () => void;
}

export default function ArchiveManager({
  archivedIds,
  allEvents,
  onRestore,
  onRestoreAll,
}: ArchiveManagerProps) {
  const archivedEvents = allEvents.filter((e) =>
    archivedIds.has(String(e.id))
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-gray-100 mb-3">
        Archived Events ({archivedEvents.length})
      </h2>

      {archivedEvents.length === 0 && (
        <div className="text-xs text-gray-400 italic">
          No archived events
        </div>
      )}

      {archivedEvents.length > 0 && (
        <button
          onClick={onRestoreAll}
          className="mb-3 px-3 py-1 text-xs bg-blue-700 hover:bg-blue-600 text-white rounded border border-blue-900 font-bold"
        >
          Restore All
        </button>
      )}

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {archivedEvents.map((event) => (
          <div
            key={event.id}
            className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-200">
                {new Date(event.timestamp).toLocaleString()}
              </span>

              <button
                onClick={() => onRestore(String(event.id))}
                className="text-blue-400 hover:text-blue-300 underline font-bold"
              >
                Restore
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className={`${BADGE_BASE} ${RISK_COLORS[event.riskLevel]}`}>
                {event.riskLevel}
              </span>

              <span
                className={`${BADGE_BASE} ${
                  CATEGORY_COLORS[event.classification] ??
                  "bg-gray-700 text-gray-200 border border-gray-600"
                }`}
              >
                {event.classification}
              </span>
            </div>

            <div className="truncate text-gray-400 mb-1">
              <strong className="text-gray-300">Session:</strong>{" "}
              {event.sessionId}
            </div>

            <div className="truncate text-gray-400">
              <strong className="text-gray-300">Input:</strong>{" "}
              {event.input}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}