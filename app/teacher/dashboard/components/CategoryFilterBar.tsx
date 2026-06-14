"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
};

export default function CategoryFilterBar({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = searchParams.get("category");

  // ⭐ Push SAFE to the end, keep all other categories in original order
  const ordered = [...categories].sort((a, b) => {
    if (a === "SAFE") return 1;
    if (b === "SAFE") return -1;
    return 0;
  });

  function update(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) params.delete("category");
    else params.set("category", value);

    const query = params.toString();
    router.push(`/teacher${query ? `?${query}` : ""}`);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {/* ALL button */}
      <button
        onClick={() => update(null)}
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
      {ordered.map((cat) => {
        const isActive = active === cat;
        const color = CATEGORY_COLORS[cat] || "bg-gray-500";

        return (
          <button
            key={cat}
            onClick={() => update(isActive ? null : cat)}
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