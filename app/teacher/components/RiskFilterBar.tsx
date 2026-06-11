"use client";

import RiskBadge from "./RiskBadge";

interface Props {
  active: string | null;
  onSelect: (risk: string | null) => void;
}

const LEVELS = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function RiskFilterBar({ active, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1 rounded border text-sm ${
          active === null
            ? "bg-blue-600 text-white border-blue-700"
            : "bg-gray-100 hover:bg-gray-200 border-gray-300"
        }`}
      >
        All
      </button>

      {LEVELS.map((level) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
          className={`px-3 py-1 rounded border text-sm flex items-center gap-2 ${
            active === level
              ? "bg-blue-600 text-white border-blue-700"
              : "bg-gray-100 hover:bg-gray-200 border-gray-300"
          }`}
        >
          <RiskBadge level={level} />
        </button>
      ))}
    </div>
  );
}