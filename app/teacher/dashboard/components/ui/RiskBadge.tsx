"use client";

interface Props {
  level: string;
}

const COLORS: Record<string, string> = {
  SAFE: "bg-green-100 text-green-800 border-green-300",
  LOW: "bg-yellow-100 text-yellow-800 border-yellow-300",
  MEDIUM: "bg-orange-100 text-orange-800 border-orange-300",
  HIGH: "bg-red-100 text-red-800 border-red-300",
  CRITICAL: "bg-red-800 text-white border-red-900",
};

export default function RiskBadge({ level }: Props) {
  const style = COLORS[level] ?? "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <span className={`px-2 py-1 text-xs rounded border ${style}`}>
      {level}
    </span>
  );
}