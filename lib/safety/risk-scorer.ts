export function scoreRisk(classification: string, injected: boolean): string {
  if (injected) return "high";
  if (classification !== "safe") return "medium";
  return "low";
}