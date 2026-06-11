"use client";

const CATEGORY_COLORS: Record<string, string> = {
  GENERAL: "bg-gray-500",
  SAFE: "bg-green-500",
  PII: "bg-blue-500",
  CONFIDENTIAL: "bg-purple-500",
  FRAUD: "bg-yellow-500",
  VIOLENCE: "bg-red-600",
  SELF_HARM: "bg-pink-600",
  EXTREMISM: "bg-orange-600",
  HATE: "bg-rose-600",
  MALWARE: "bg-teal-600",
  JAILBREAK: "bg-indigo-600",
  MANIPULATION: "bg-amber-600",
};

type Props = {
  categories: string[];
  active: string | null;
  onSelect: (value: string | null) => void;
};

export default function CategoryFilterBar({ categories, active, onSelect }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {/* ALL button */}
      <button
        onClick={() => onSelect(null)}
        className={`
          px-3 py-1 rounded border transition-all duration-200
          ${
            active === null
              ? "bg-gray-100 text-gray-900 border-gray-300" 
              : "bg-gray-900 text-gray-100 border-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
      >
        All
      </button>

      {/* Category buttons */}
      {categories.map((cat) => {
        const isActive = active === cat;
        const color = CATEGORY_COLORS[cat] || "bg-gray-500";

        return (
          <button
            key={cat}
            onClick={() => onSelect(isActive ? null : cat)}
            className={`
              px-3 py-1 rounded border transition-all duration-200
              ${
                isActive
                  ? "bg-gray-100 text-gray-900 border-gray-300" 
                  : `${color} text-white border-gray-700 hover:bg-gray-100 hover:text-gray-900`
              }
            `}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}