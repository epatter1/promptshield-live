// /types/theme.ts

export const RISK_COLORS: Record<string, string> = {
  SAFE: "bg-green-900 text-green-200 border border-green-700",
  LOW: "bg-yellow-900 text-yellow-200 border border-yellow-700",
  MEDIUM: "bg-orange-900 text-orange-200 border border-orange-700",

  // HIGH is lighter than CRITICAL
  HIGH: "bg-red-700 text-red-100 border border-red-600",

  CRITICAL: "bg-red-900 text-red-200 border border-red-700",
};

export const CATEGORY_COLORS: Record<string, string> = {
  SAFE: "bg-green-900 text-green-200 border border-green-700",
  PII: "bg-blue-900 text-blue-200 border border-blue-700",
  CONFIDENTIAL: "bg-purple-900 text-purple-200 border border-purple-700",
  FRAUD: "bg-yellow-900 text-yellow-200 border border-yellow-700",
  VIOLENCE: "bg-red-900 text-red-200 border border-red-700",
  SELF_HARM: "bg-pink-900 text-pink-200 border border-pink-700",
  EXTREMISM: "bg-orange-900 text-orange-200 border border-orange-700",
  HATE: "bg-rose-900 text-rose-200 border border-rose-700",
  MALWARE: "bg-teal-900 text-teal-200 border border-teal-700",
  JAILBREAK: "bg-indigo-900 text-indigo-200 border border-indigo-700",
  MANIPULATION: "bg-amber-900 text-amber-200 border border-amber-700",
};

export const BADGE_BASE =
  "px-2 py-1 rounded text-xs font-medium inline-block";

export const FILTER_BUTTON_BASE =
  "px-2 py-1 rounded text-xs border transition-opacity";

export const CHART_COLORS = {
  riskBars: "#60a5fa",
  injectionPoints: "#f87171",
  latencyBars: "#34d399",
  activityLine: "#a78bfa",
};