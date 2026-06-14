import { semanticCategory, semanticRiskLevel } from "./semantic";

/**
 * Semantic-driven categorical risk classifier.
 * Uses the semantic model to determine SAFE → CRITICAL.
 */
export async function classifyRisk(
  input: string
): Promise<"SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"> {
  // semanticRiskLevel() already maps categories → risk levels
  return await semanticRiskLevel(input);
}

/**
 * Optional: expose semantic category directly for dashboards.
 */
export async function classifySemanticCategory(input: string) {
  return await semanticCategory(input);
}