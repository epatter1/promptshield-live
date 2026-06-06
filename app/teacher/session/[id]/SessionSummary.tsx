"use client";

interface EventRecord {
  timestamp: string;
  riskLevel: string;
  injectionDetected: number | boolean;
  rewriteApplied: number | boolean;
  latencyMs?: number;
  modelName?: string;
}

export default function SessionSummary({ events }: { events: EventRecord[] }) {
  if (events.length === 0) return null;

  const total = events.length;
  const highRisk = events.filter(e => e.riskLevel === "high").length;
  const injections = events.filter(e => e.injectionDetected).length;
  const rewrites = events.filter(e => e.rewriteApplied).length;

  const avgLatency = Math.round(
    events.reduce((sum, e) => sum + (e.latencyMs || 0), 0) / total
  );

  const first = new Date(events[0].timestamp).toLocaleString();
  const last = new Date(events[events.length - 1].timestamp).toLocaleString();

  const models = Array.from(new Set(events.map(e => e.modelName)));

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Session Summary</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div><span className="font-semibold">Total Events:</span> {total}</div>
        <div><span className="font-semibold">High Risk:</span> {highRisk}</div>
        <div><span className="font-semibold">Injection Attempts:</span> {injections}</div>
        <div><span className="font-semibold">Rewrites Applied:</span> {rewrites}</div>
        <div><span className="font-semibold">Avg Latency:</span> {avgLatency}ms</div>
        <div><span className="font-semibold">Models Used:</span> {models.join(", ")}</div>
        <div className="col-span-2">
          <span className="font-semibold">Start → End:</span> {first} → {last}
        </div>
      </div>
    </div>
  );
}