"use client";

import { useRouter, useSearchParams } from "next/navigation";

// Selected-state colors (from your RiskBadge)
const RISK_SELECTED: Record<string, string> = {
  SAFE: "bg-green-100 text-green-800 border-green-300",
  LOW: "bg-yellow-100 text-yellow-800 border-yellow-300",
  MEDIUM: "bg-orange-100 text-orange-800 border-orange-300",
  HIGH: "bg-red-100 text-red-800 border-red-300",
  CRITICAL: "bg-red-800 text-white border-red-900",
};

// Unselected-state dark versions (for mirror theme)
const RISK_UNSELECTED: Record<string, string> = {
  SAFE: "bg-green-700 text-white border-green-900",
  LOW: "bg-yellow-600 text-white border-yellow-800",
  MEDIUM: "bg-orange-600 text-white border-orange-800",
  HIGH: "bg-red-600 text-white border-red-800",
  CRITICAL: "bg-red-900 text-white border-red-950",
};

// Hover → selected-state colors
const RISK_HOVER: Record<string, string> = {
  SAFE: "hover:bg-green-100 hover:text-green-800 hover:border-green-300",
  LOW: "hover:bg-yellow-100 hover:text-yellow-800 hover:border-yellow-300",
  MEDIUM: "hover:bg-orange-100 hover:text-orange-800 hover:border-orange-300",
  HIGH: "hover:bg-red-100 hover:text-red-800 hover:border-red-300",
  CRITICAL: "hover:bg-red-800 hover:text-white hover:border-red-900",
};

export default function RiskFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = searchParams.get("risk");

  // Highest → lowest severity
  const risks = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"];

  function update(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) params.delete("risk");
    else params.set("risk", value);

    const query = params.toString();
    router.push(`/teacher${query ? `?${query}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {/* ALL button */}
      <button
        onClick={() => update(null)}
        className={`
          px-3 py-1 rounded border text-sm transition-all duration-200
          whitespace-nowrap
          ${
            active === null
              ? "bg-gray-100 text-gray-900 border-gray-300"
              : "bg-gray-900 text-gray-100 border-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
      >
        All
      </button>

      {/* Risk buttons */}
      {risks.map((risk) => {
        const isActive = active === risk;

        return (
          <button
            key={risk}
            onClick={() => update(isActive ? null : risk)}
            className={`
              px-3 py-1 rounded border text-sm transition-all duration-200
              whitespace-nowrap
              ${
                isActive
                  ? RISK_SELECTED[risk]
                  : `${RISK_UNSELECTED[risk]} ${RISK_HOVER[risk]}`
              }
            `}
          >
            {risk}
          </button>
        );
      })}
    </div>
  );
}