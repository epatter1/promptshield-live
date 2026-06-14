"use client";

interface SessionListProps {
  uniqueSessions: string[];
  selectedSession: string | null;
  setSelectedSession: (id: string) => void;
  hasSessionsUnderFilters: boolean;
}

export default function SessionList({
  uniqueSessions,
  selectedSession,
  setSelectedSession,
  hasSessionsUnderFilters,
}: SessionListProps) {
  return (
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
                className={`w-full text-left px-2 py-1 rounded ${
                  selectedSession === sessionId
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
  );
}