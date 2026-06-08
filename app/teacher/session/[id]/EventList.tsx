"use client";

import type { EventRecord } from "@/app/types/EventRecord";
import EventIndicators from "../../components/EventIndicators";

export default function EventList({ events }: { events: EventRecord[] }) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="border rounded-lg p-4 bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-gray-800">
              {new Date(event.timestamp).toLocaleTimeString()}
            </div>
            <EventIndicators event={event} />
          </div>

          <div className="text-gray-700">
            <strong>Input:</strong> {event.input}
          </div>

          <div className="text-gray-700 mt-2">
            <strong>Safe Response:</strong> {event.safeResponse}
          </div>

          {event.rawResponse && (
            <div className="text-gray-500 mt-2 text-sm">
              <strong>Raw Model Output:</strong> {event.rawResponse}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}