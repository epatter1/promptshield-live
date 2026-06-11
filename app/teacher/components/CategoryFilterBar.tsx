"use client";

import CategoryBadge from "./CategoryBadge";

interface Props {
  categories: string[];
  active: string | null;
  onSelect: (cat: string | null) => void;
}

export default function CategoryFilterBar({ categories, active, onSelect }: Props) {
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

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1 rounded border text-sm flex items-center gap-2 ${
            active === cat
              ? "bg-blue-600 text-white border-blue-700"
              : "bg-gray-100 hover:bg-gray-200 border-gray-300"
          }`}
        >
          <CategoryBadge category={cat} />
        </button>
      ))}
    </div>
  );
}