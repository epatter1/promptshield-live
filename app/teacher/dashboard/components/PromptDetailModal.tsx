"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EventRow } from "../../types/EventRow";
import {
  RISK_COLORS,
  CATEGORY_COLORS,
  BADGE_BASE,
} from "../../types/theme";

// Animated + mobile-safe copy button
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Mobile Safari fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 600);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        absolute top-2 right-2 p-1 rounded border text-xs
        transition-all duration-200
        ${copied
          ? "bg-green-700 border-green-600 scale-110"
          : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:scale-105"
        }
      `}
      title="Copy"
    >
      {copied ? "✔️" : "📋"}
    </button>
  );
};

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
  const [mounted, setMounted] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  // Expand/collapse toggles
  const [showFullInput, setShowFullInput] = useState(false);
  const [showFullRaw, setShowFullRaw] = useState(false);
  const [showFullSafe, setShowFullSafe] = useState(false);

  useEffect(() => {
    setMounted(true);
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < total - 1;

  // Keyboard navigation
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

  const ready = mounted && modalRoot && event;
  if (!ready) return null;

  // Show "See more" if text >= 200 chars
  const shouldClamp = (text: string | null | undefined) =>
    text ? text.length >= 200 : false;

  // Show 500-char notice if text > 500
  const isLongText = (text: string | null | undefined) =>
    text ? text.length > 500 : false;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">

      {/* FIXED MAX HEIGHT MODAL */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col relative">

        {/* HEADER */}
        <div className="p-6 pb-0 relative shrink-0">
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
        </div>

        {/* SCROLL AREA */}
        <div className="overflow-y-auto">
          <div className="px-6 space-y-6">

            {/* USER INPUT */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 mb-1">User Input</h3>

              <div
                className={`
                  relative overflow-hidden
                  transition-[max-height] duration-300 ease-in-out
                  ${showFullInput ? "max-h-[2000px]" : "max-h-20"}
                `}
              >
                <CopyButton text={event.input ?? ""} />

                <pre className="whitespace-pre-wrap bg-gray-800 p-3 rounded border border-gray-700 text-gray-300 text-sm">
                  {showFullInput
                    ? event.input?.slice(0, 500)
                    : event.input?.slice(0, 200)}
                </pre>
              </div>

              {showFullInput && isLongText(event.input) && (
                <div className="text-xs text-gray-400 mt-1">
                  Only the first 500 characters are shown. For the full text, click the Copy icon.
                </div>
              )}

              {shouldClamp(event.input) && (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => setShowFullInput(!showFullInput)}
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    {showFullInput ? "See less" : "See more"}
                  </button>
                </div>
              )}
            </div>

            {/* RAW RESPONSE */}
            {event.rawResponse && (
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Raw Model Response
                </h3>

                <div
                  className={`
                    relative overflow-hidden
                    transition-[max-height] duration-300 ease-in-out
                    ${showFullRaw ? "max-h-[2000px]" : "max-h-20"}
                  `}
                >
                  <CopyButton text={event.rawResponse ?? ""} />

                  <pre className="whitespace-pre-wrap bg-gray-800 p-3 rounded border border-gray-700 text-gray-300 text-sm">
                    {showFullRaw
                      ? event.rawResponse?.slice(0, 500)
                      : event.rawResponse?.slice(0, 200)}
                  </pre>
                </div>

                {showFullRaw && isLongText(event.rawResponse) && (
                  <div className="text-xs text-gray-400 mt-1">
                    Only the first 500 characters are shown. For the full text, click the Copy icon.
                  </div>
                )}

                {shouldClamp(event.rawResponse) && (
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => setShowFullRaw(!showFullRaw)}
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                      {showFullRaw ? "See less" : "See more"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SAFE RESPONSE */}
            {event.safeResponse && (
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Safe Response (Post‑Rewrite)
                </h3>

                <div
                  className={`
                    relative overflow-hidden
                    transition-[max-height] duration-300 ease-in-out
                    ${showFullSafe ? "max-h-[2000px]" : "max-h-20"}
                  `}
                >
                  <CopyButton text={event.safeResponse ?? ""} />

                  <pre className="whitespace-pre-wrap bg-gray-800 p-3 rounded border border-gray-700 text-gray-300 text-sm">
                    {showFullSafe
                      ? event.safeResponse?.slice(0, 500)
                      : event.safeResponse?.slice(0, 200)}
                  </pre>
                </div>

                {showFullSafe && isLongText(event.safeResponse) && (
                  <div className="text-xs text-gray-400 mt-1">
                    Only the first 500 characters are shown. For the full text, click the Copy icon.
                  </div>
                )}

                {shouldClamp(event.safeResponse) && (
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => setShowFullSafe(!showFullSafe)}
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                      {showFullSafe ? "See less" : "See more"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* METADATA GRID */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-6">
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

          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between shrink-0">

          <button
            onClick={() => onArchiveEvent(String(event.id))}
            className="px-3 py-2 rounded bg-red-700 border border-red-900 text-sm text-white hover:bg-red-600"
          >
            Archive Event
          </button>

          <div className="flex items-center gap-3">
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
      </div>
    </div>,
    modalRoot
  );
}