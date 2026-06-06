"use client";

interface EventRecord {
  id: string;
  timestamp: string;
  input: string;
  safeResponse: string;
  rawResponse?: string;
  classification: string;
  riskLevel: string;
  injectionDetected: number | boolean;
  rewriteApplied: number | boolean;
  modelName?: string;
  latencyMs?: number;
}

export default function EventList({ events }: { events: EventRecord[] }) {
  return (
    <div className="space-y-6">
      {events.map(e => (
        <div
          key={e.id}
          className="border rounded-lg p-4 shadow-sm bg-white space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {new Date(e.timestamp).toLocaleString()}
            </span>

            <span
              className={`
                px-2 py-1 text-xs rounded-full font-semibold capitalize
                ${
                  e.riskLevel === "high"
                    ? "bg-red-100 text-red-700"
                    : e.riskLevel === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }
              `}
            >
              {e.riskLevel} risk
            </span>
          </div>

          <div className="flex gap-3 text-sm">
            {e.injectionDetected ? (
              <span className="text-red-600 font-medium flex items-center gap-1">
                ⚠️ Injection Detected
              </span>
            ) : null}

            {e.rewriteApplied ? (
              <span className="text-blue-600 font-medium flex items-center gap-1">
                🛡️ Rewrite Applied
              </span>
            ) : null}
          </div>

          <div>
            <h3 className="font-semibold">User Input</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{e.input}</p>
          </div>

          <div>
            <h3 className="font-semibold">Model Response (Safe)</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{e.safeResponse}</p>
          </div>

          {e.rawResponse && (
            <div>
              <h3 className="font-semibold">Raw Response</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{e.rawResponse}</p>
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-1">
            <p>Classification: {e.classification}</p>
            <p>Latency: {e.latencyMs}ms</p>
            <p>Model: {e.modelName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}