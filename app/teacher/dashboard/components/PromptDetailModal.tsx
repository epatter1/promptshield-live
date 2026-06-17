"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EventRow } from "../../types/EventRow";
import {
  RISK_COLORS,
  CATEGORY_COLORS,
  BADGE_BASE,
} from "../../types/theme";

interface PromptDetailModalProps {
  event: EventRow | null;
  index: number | null;
  total: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onArchiveEvent: (id: string) => void;
}

export default function PromptDetailModal({
  event,
  index,
  total,
  onClose,
  onNavigate,
  onArchiveEvent,
}: PromptDetailModalProps) {
  // ⭐ Hooks ALWAYS run
  const [mounted, setMounted] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  // ⭐ Safe DOM access
  useEffect(() => {
    setMounted(true);
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < total - 1;

  // ⭐ Arrow key navigation (index-based)
  useEffect(() => {
    if (!mounted) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault();
        onNavigate(index! - 1);
      }
      if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        onNavigate(index! + 1);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mounted, hasPrev, hasNext, index, onNavigate, onClose]);

  // ⭐ Conditional rendering happens AFTER all hooks
  const ready = mounted && modalRoot && event;
  if (!ready) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">Event Details</h2>

        <div className="text-sm text-gray-400 mb-1">
          {new Date(event.timestamp).toLocaleString()}
        </div>

        <div className="text-xs text-gray-400 mb-2">
          {index !== null ? `${index + 1} of ${total}` : ""}
        </div>

        <div className="text-sm text-gray-300 mb-4">
          <strong className="text-gray-200">Session:</strong> {event.sessionId}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className={`${BADGE_BASE} ${RISK_COLORS[event.riskLevel]}`}>
            {event.riskLevel}
          </span>

          <span
            className={`${BADGE_BASE} ${
              CATEGORY_COLORS[event.classification] ??
              "bg-gray-700 text-gray-200 border border-gray-600"
            }`}
          >
            {event.classification}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-1">User Input</h3>
          <pre className="whitespace-pre-wrap bg-gray-800 p-3 rounded border border-gray-700 text-gray-300 text-sm">
            {event.input}
          </pre>
        </div>

        {event.rawResponse && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              Raw Model Response
            </h3>
            <pre className="whitespace-pre-wrap bg-gray-800 p-3 rounded border border-gray-700 text-gray-300 text-sm">
              {event.rawResponse}
            </pre>
          </div>
        )}

        {event.safeResponse && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              Safe Response (Post‑Rewrite)
            </h3>
            <pre className="whitespace-pre-wrap bg-gray-800 p-3 rounded border border-gray-700 text-gray-300 text-sm">
              {event.safeResponse}
            </pre>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mt-4">
          <div>
            <strong className="text-gray-200">Model:</strong> {event.modelName}
          </div>
          <div>
            <strong className="text-gray-200">Latency:</strong> {event.latencyMs} ms
          </div>
          <div>
            <strong className="text-gray-200">Toxicity Score:</strong>{" "}
            {event.evalToxicity}
          </div>
          <div>
            <strong className="text-gray-200">Rewrite Applied:</strong>{" "}
            {event.rewriteApplied ? "Yes" : "No"}
          </div>
          <div>
            <strong className="text-gray-200">Injection Detected:</strong>{" "}
            {event.injectionDetected ? "Yes" : "No"}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            disabled={!hasPrev}
            onClick={() => onNavigate(index! - 1)}
            className={`px-3 py-2 rounded bg-gray-700 border border-gray-600 text-sm ${
              hasPrev ? "hover:bg-gray-600" : "opacity-40 cursor-not-allowed"
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={() => onArchiveEvent(String(event.id))}
            className="px-3 py-2 rounded bg-red-700 border border-red-900 text-sm text-white hover:bg-red-600"
          >
            Archive Event
          </button>

          <button
            disabled={!hasNext}
            onClick={() => onNavigate(index! + 1)}
            className={`px-3 py-2 rounded bg-gray-700 border border-gray-600 text-sm ${
              hasNext ? "hover:bg-gray-600" : "opacity-40 cursor-not-allowed"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}