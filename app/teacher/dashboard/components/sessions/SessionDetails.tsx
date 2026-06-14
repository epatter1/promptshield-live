"use client";

import { useMemo, useState } from "react";
import { EventRow } from "../../../types/EventRow";

interface SessionDetailsProps {
  events: EventRow[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
}

export default function SessionDetails({
  events,
  selectedSessionId,
  onSelectSession,
}: SessionDetailsProps) {
  const [collapsed, setCollapsed] = useState(false);

  const sessions = useMemo(() => {
    const map = new Map<string, EventRow[]>();
    events.forEach((e) => {
      if (!map.has(e.sessionId)) map.set(e.sessionId, []);
      map.get(e.sessionId)!.push(e);
    });
    return Array.from(map.entries()).map(([id, evts]) => ({ id, events: evts }));
  }, [events]);

  const selected =
    sessions.find((s) => s.id === selectedSessionId) ?? sessions[0];

  return (
    <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-100">Session Details</h2>
        <button
          className="lg:hidden text-xs text-gray-400 underline"
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>

      {!collapsed && (
        <>
          {selected && (
            <div className="mb-3 text-xs text-gray-200">
              <div className="font-medium mb-1">Selected Session</div>
              <div className="text-gray-300 break-all">{selected.id}</div>
              <div className="text-gray-400 mt-1">
                Events: {selected.events.length}
              </div>
            </div>
          )}

          <div className="mt-2 max-h-64 overflow-y-auto space-y-1 text-xs">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left px-2 py-1 rounded ${
                  session.id === selected?.id
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-900 hover:bg-gray-800 text-gray-300"
                }`}
              >
                <div className="truncate">{session.id}</div>
                <div className="text-[10px] text-gray-400">
                  {session.events.length} events
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}