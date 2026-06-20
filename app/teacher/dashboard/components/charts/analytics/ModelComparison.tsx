import { EventRow } from "../../../../types/EventRow";

interface ModelComparisonProps {
  events: EventRow[];
}

export default function ModelComparison({ events }: ModelComparisonProps) {
  const stats = new Map<string, { count: number; totalLatency: number }>();

  for (const e of events) {
    const model = e.modelName || "Unknown";
    const latency = e.latencyMs ?? 0;

    const s = stats.get(model) ?? { count: 0, totalLatency: 0 };
    s.count += 1;
    s.totalLatency += latency;
    stats.set(model, s);
  }

  const rows = [...stats.entries()].map(([model, s]) => ({
    model,
    count: s.count,
    avgLatency: s.count ? Math.round(s.totalLatency / s.count) : 0,
  }));

  return (
    <section className="border border-gray-200 rounded-lg p-4 bg-white space-y-2">
      <h2 className="text-sm font-semibold text-gray-800">
        Model Comparison (Risk & Latency)
      </h2>

      <table className="w-full text-xs text-gray-700">
        <thead>
          <tr className="text-left">
            <th className="py-1 pr-2">Model</th>
            <th className="py-1 pr-2">Events</th>
            <th className="py-1 pr-2">Avg Latency (ms)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.model}>
              <td className="py-1 pr-2">{r.model}</td>
              <td className="py-1 pr-2">{r.count}</td>
              <td className="py-1 pr-2">{r.avgLatency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}