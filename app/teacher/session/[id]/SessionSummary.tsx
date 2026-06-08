"use client";

import type { EventRecord } from "@/app/types/EventRecord";
import EventIndicators from "../../components/charts/EventIndicators";

export default function SessionSummary({ events }: { events: EventRecord[] }) {
  if (events.length === 0) {
    return (
      <div className="p-4 border rounded bg-white shadow-sm text-gray-600">
        No events recorded for this session.
      </div>
    );
  }

  const lastEvent = events[events.length - 1];

  return (
    <div className="p-4 border rounded bg-white shadow-sm space-y-3">
      <h2 className="text-xl font-semibold">Session Summary</h2>

      <div className="flex items-center justify-between">
        <div className="text-gray-700">
          <strong>Total Events:</strong> {events.length}
        </div>

        <EventIndicators event={lastEvent} />
      </div>

      <div className="text-gray-700">
        <strong>Last Input:</strong> {lastEvent.input}
      </div>

      <div className="text-gray-700">
        <strong>Last Safe Response:</strong> {lastEvent.safeResponse}
      </div>
    </div>
  );
}