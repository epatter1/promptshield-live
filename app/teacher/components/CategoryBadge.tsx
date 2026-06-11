"use client";

interface Props {
  category: string;
}

const COLORS: Record<string, string> = {
  SAFE: "bg-green-100 text-green-800 border-green-300",
  PII: "bg-blue-100 text-blue-800 border-blue-300",
  FRAUD: "bg-yellow-100 text-yellow-800 border-yellow-300",
  VIOLENCE: "bg-red-100 text-red-800 border-red-300",
  SELF_HARM: "bg-purple-100 text-purple-800 border-purple-300",
  JAILBREAK: "bg-orange-100 text-orange-800 border-orange-300",
  MANIPULATION: "bg-pink-100 text-pink-800 border-pink-300",
  CONFIDENTIAL: "bg-gray-100 text-gray-800 border-gray-300",
};

export default function CategoryBadge({ category }: Props) {
  const style = COLORS[category] ?? "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <span className={`px-2 py-1 text-xs rounded border ${style}`}>
      {category}
    </span>
  );
}