"use client";

import type { EventRecord } from "@/app/types/EventRecord";

export default function EventIndicators({ event }: { event: EventRecord }) {
  const riskColor =
    event.riskLevel === "high"
      ? "bg-red-100 text-red-700 border-red-300"
      : event.riskLevel === "medium"
      ? "bg-yellow-100 text-yellow-700 border-yellow-300"
      : "bg-green-100 text-green-700 border-green-300";

  return (
    <div className="flex items-center gap-2">

      {/* Risk Badge */}
      <span
        className={`px-2 py-0.5 text-xs font-semibold border rounded ${riskColor}`}
      >
        {event.riskLevel.toUpperCase()}
      </span>

      {/* Injection Icon */}
      {event.injectionDetected ? (
        <span title="Injection Detected" className="text-red-600 text-lg">
          ⚠️
        </span>
      ) : null}

      {/* Rewrite Icon */}
      {event.rewriteApplied ? (
        <span title="Rewrite Applied" className="text-blue-600 text-lg">
          ✏️
        </span>
      ) : null}
    </div>
  );
}