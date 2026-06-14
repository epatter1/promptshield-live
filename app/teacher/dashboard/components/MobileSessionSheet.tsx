"use client";

interface MobileSessionSheetProps {
  uniqueSessions: string[];
  selectedSession: string | null;
  setSelectedSession: (id: string) => void;
  mobileSessionsOpen: boolean;
  setMobileSessionsOpen: (open: boolean) => void;
  hasSessionsUnderFilters: boolean;
}

export default function MobileSessionSheet({
  uniqueSessions,
  selectedSession,
  setSelectedSession,
  mobileSessionsOpen,
  setMobileSessionsOpen,
  hasSessionsUnderFilters,
}: MobileSessionSheetProps) {
  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setMobileSessionsOpen(true)}
        className="md:hidden fixed bottom-4 right-4 px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-sm font-semibold shadow-lg flex items-center gap-2 z-40"
      >
        <span>Sessions</span>
        <span className="text-xs bg-gray-900 px-2 py-0.5 rounded-full border border-gray-600">
          {uniqueSessions.length}
        </span>
      </button>

      {/* Bottom sheet */}
      {mobileSessionsOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileSessionsOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 bg-gray-900 border-t border-gray-700 rounded-t-xl p-4 max-h-[70vh] overflow-y-auto shadow-2xl">
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
        </div>
      )}
    </>
  );
}