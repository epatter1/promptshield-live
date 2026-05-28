import { detectInjection } from "@/mcp-servers/injection-detector";
import { scoreRisk } from "@/mcp-servers/risk-scorer";
import { safeRewrite } from "@/mcp-servers/safe-rewrite";
import { classify } from "@/mcp-servers/safety-classifier";

export async function runSafetyPipeline(input: string) {
  const classification = await classify(input);
  const injection = await detectInjection(input);
  const risk = await scoreRisk(classification, injection.injectionDetected);

  return {
    classification,
    injectionDetected: injection.injectionDetected,
    riskLevel: risk.riskLevel,
    rewriteApplied: injection.injectionDetected,
    safeRewrite,
  };
}