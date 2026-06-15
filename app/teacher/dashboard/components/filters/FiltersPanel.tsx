"use client";

import { useState, useMemo, useEffect } from "react";
import { EventRow } from "../../../types/EventRow";
import {
  RISK_COLORS,
  CATEGORY_COLORS,
  FILTER_BUTTON_BASE,
} from "../../../types/theme";

type FiltersPanelProps = {
  events: EventRow[];
  onFilterChange: (filtered: EventRow[], isFiltered: boolean) => void;
};

const RISK_LEVELS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"];

const VALID_CATEGORIES = [
  "SAFE",
  "PII",
  "CONFIDENTIAL",
  "FRAUD",
  "VIOLENCE",
  "SELF_HARM",
  "EXTREMISM",
  "HATE",
  "MALWARE",
  "JAILBREAK",
  "MANIPULATION",
];

export default function FiltersPanel({ events, onFilterChange }: FiltersPanelProps) {
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const classifications = useMemo(() => {
    return Array.from(
      new Set(
        events
          .map((e) => e.classification)
          .filter((c) => c && VALID_CATEGORIES.includes(c))
      )
    ).sort((a, b) => {
      if (a === "SAFE") return 1;
      if (b === "SAFE") return -1;
      return 0;
    });
  }, [events]);

  const toggle = (
    value: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(
      list.includes(value)
        ? list.filter((x) => x !== value)
        : [...list, value]
    );
  };

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const riskMatch =
        selectedRisks.length === 0 || selectedRisks.includes(e.riskLevel);

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(e.classification);

      return riskMatch && categoryMatch;
    });
  }, [events, selectedRisks, selectedCategories]);

  useEffect(() => {
    const isFiltered =
      selectedRisks.length > 0 || selectedCategories.length > 0;
    onFilterChange(filtered, isFiltered);
  }, [filtered]);

  const clearFilters = () => {
    setSelectedRisks([]);
    setSelectedCategories([]);
  };

  return (
    <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-100">Filters</h2>

        {(selectedRisks.length > 0 || selectedCategories.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-400 hover:text-blue-300 underline font-bold"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">Risk Level</div>
        <div className="flex flex-wrap gap-2 text-xs">
          {RISK_LEVELS.map((risk) => (
            <button
              key={risk}
              onClick={() => toggle(risk, selectedRisks, setSelectedRisks)}
              className={`${FILTER_BUTTON_BASE} ${RISK_COLORS[risk]} ${
                selectedRisks.includes(risk) ? "opacity-100" : "opacity-40"
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-400 mb-1">Category</div>
        <div className="flex flex-wrap gap-2 text-xs">
          {classifications.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                toggle(cat, selectedCategories, setSelectedCategories)
              }
              className={`${FILTER_BUTTON_BASE} ${CATEGORY_COLORS[cat]} ${
                selectedCategories.includes(cat) ? "opacity-100" : "opacity-40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}