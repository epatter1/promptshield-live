"use client";

import { useEffect } from "react";
import CategoryBadge from "./CategoryBadge";
import RiskBadge from "./RiskBadge";

type EventRow = {
  id: number;
  timestamp: string;
  sessionId: string;
  input: string;
  rawResponse: string | null;
  safeResponse: string | null;
  classification: string;
  riskLevel: string;
  evalToxicity: number;
  rewriteApplied: number;
  injectionDetected: number;
  latencyMs: number;
  modelName: string;
};

type Props = {
  event: EventRow | null;
  sessionEvents: EventRow[] | null;
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (dir: "prev" | "next") => void;
};

export default function PromptDetailModal({
  event,
  sessionEvents,
  currentIndex,
  onClose,
  onNavigate,
}: Props) {
  if (!event) return null;

  const total = sessionEvents?.length ?? 0;

  // ESC to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate("prev");
      if (e.key === "ArrowRight") onNavigate("next");
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Session Navigation */}
        {sessionEvents && currentIndex !== null && (
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => onNavigate("prev")}
              disabled={currentIndex === 0}
              className={`px-3 py-1 rounded border ${
                currentIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-700"
              }`}
            >
              ← Prev
            </button>

            <div className="text-gray-300">
              Event <strong>{currentIndex + 1}</strong> of{" "}
              <strong>{total}</strong> in this session
            </div>

            <button
              onClick={() => onNavigate("next")}
              disabled={currentIndex === total - 1}
              className={`px-3 py-1 rounded border ${
                currentIndex === total - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-700"
              }`}
            >
              Next →
            </button>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div>
            <strong>Timestamp:</strong> {event.timestamp}
          </div>

          <div className="flex items-center gap-2">
            <strong>Category:</strong>
            <CategoryBadge category={event.classification} />
          </div>

          <div className="flex items-center gap-2">
            <strong>Risk:</strong>
            <RiskBadge level={event.riskLevel} />
          </div>

          <div>
            <strong>Risk Score:</strong> {event.evalToxicity}
          </div>

          <div>
            <strong>Injection Detected:</strong>{" "}
            {event.injectionDetected ? "Yes" : "No"}
          </div>

          <div>
            <strong>Rewrite Applied:</strong>{" "}
            {event.rewriteApplied ? "Yes" : "No"}
          </div>

          <div>
            <strong>Latency:</strong> {event.latencyMs}ms
          </div>

          <div>
            <strong>Model:</strong> {event.modelName}
          </div>
        </div>

        {/* Input */}
        <div className="mb-4">
          <strong>Input:</strong>
          <pre className="bg-gray-800 p-3 rounded border border-gray-700 whitespace-pre-wrap mt-1">
            {event.input}
          </pre>
        </div>

        {/* Safe Response */}
        {event.safeResponse && (
          <div className="mb-4">
            <strong>Safe Response:</strong>
            <pre className="bg-gray-800 p-3 rounded border border-gray-700 whitespace-pre-wrap mt-1">
              {event.safeResponse}
            </pre>
          </div>
        )}

        {/* Raw Response */}
        {event.rawResponse && (
          <div className="mb-4">
            <strong>Raw Response:</strong>
            <pre className="bg-gray-800 p-3 rounded border border-gray-700 whitespace-pre-wrap mt-1">
              {event.rawResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}