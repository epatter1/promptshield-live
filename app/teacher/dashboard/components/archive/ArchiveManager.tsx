"use client";

import { EventRow } from "../../../types/EventRow";
import { BADGE_BASE, RISK_COLORS, CATEGORY_COLORS } from "../../../types/theme";

interface ArchiveManagerProps {
  archivedIds: Set<string>;
  allEvents: EventRow[];
  onRestore: (id: string) => void;
  onRestoreAll: () => void;

  longPressEnabled: boolean;
  setLongPressEnabled: (v: boolean) => void;
}

export default function ArchiveManager({
  archivedIds,
  allEvents,
  onRestore,
  onRestoreAll,
  longPressEnabled,
  setLongPressEnabled,
}: ArchiveManagerProps) {
  const archivedEvents = allEvents.filter((e) =>
    archivedIds.has(String(e.id))
  );

  return (
    <div className="w-full rounded-lg bg-gray-900 border border-gray-800 p-4">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">
        Archive Manager
      </h2>

      {/* ⭐ Long‑press toggle */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={longPressEnabled}
          onChange={(e) => setLongPressEnabled(e.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-xs text-gray-300">
          Enable long‑press multi‑select on mobile
        </span>
      </div>

      {archivedEvents.length === 0 ? (
        <p className="text-sm text-gray-400">No archived events.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-300">
              Archived: {archivedEvents.length}
            </p>

            <button
              onClick={onRestoreAll}
              className="text-xs text-blue-400 hover:text-blue-300 underline font-semibold"
            >
              Restore All
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {archivedEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded bg-gray-800 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-gray-400">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>

                  <span
                    className={`${BADGE_BASE} ${RISK_COLORS[event.riskLevel]}`}
                  >
                    {event.riskLevel}
                  </span>
                </div>

                <div className="text-sm text-gray-100 truncate mb-1">
                  {event.input}
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`${BADGE_BASE} ${
                      CATEGORY_COLORS[event.classification] ??
                      "bg-gray-700 text-gray-200 border border-gray-600"
                    }`}
                  >
                    {event.classification}
                  </span>

                  <button
                    onClick={() => onRestore(String(event.id))}
                    className="text-xs text-blue-400 hover:text-blue-300 underline font-semibold"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}