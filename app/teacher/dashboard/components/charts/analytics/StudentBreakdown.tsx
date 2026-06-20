import { EventRow } from "../../../../types/EventRow";

interface StudentBreakdownProps {
  events: EventRow[];
}

export default function StudentBreakdown({ events }: StudentBreakdownProps) {
  const counts = new Map<string, number>();

  for (const e of events) {
    const student = e.sessionId; // best available identifier
    const risk = e.riskLevel;

    if (risk === "high" || risk === "medium") {
      counts.set(student, (counts.get(student) ?? 0) + 1);
    }
  }

  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <section className="border border-gray-200 rounded-lg p-4 bg-white space-y-2">
      <h2 className="text-sm font-semibold text-gray-800">
        Top Sessions by Risk Events
      </h2>

      {top.length === 0 ? (
        <p className="text-xs text-gray-500">No risk events in this filter.</p>
      ) : (
        <ul className="text-xs text-gray-700 space-y-1">
          {top.map(([sessionId, count]) => (
            <li key={sessionId} className="flex justify-between">
              <span>Session {sessionId}</span>
              <span className="font-medium">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}