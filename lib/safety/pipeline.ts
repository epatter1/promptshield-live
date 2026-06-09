import { detectInjection } from "./injection-detector";
import { classifyContent } from "./safety-classifier";
import { scoreRisk } from "./risk-scorer";
import { safeRewrite } from "./safe-rewrite";

export async function runSafetyPipeline(input: string) {
  const injectionDetected = detectInjection(input);
  const classification = classifyContent(input);
  const riskLevel = scoreRisk(classification, injectionDetected);

  if (injectionDetected) {
    return {
      safe: false,
      injectionDetected,
      classification,
      riskLevel,
      response: safeRewrite(input),
    };
  }

  return {
    safe: true,
    injectionDetected,
    classification,
    riskLevel,
  };
}