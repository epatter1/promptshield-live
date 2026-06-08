import { detectInjection } from "@/mcp-servers/injection-detector";
import { scoreRisk } from "@/mcp-servers/risk-scorer";
import { safeRewrite } from "@/mcp-servers/safe-rewrite";
import { classify } from "@/mcp-servers/safety-classifier";
import { callLLM } from "@/lib/llm/callLLM";

export async function runSafetyPipeline(input: string) {
  // 1. Classification (returns an object)
  const classificationObj = await classify(input);
  const classification = classificationObj.category; // string: "safe" | "suspicious" | "unsafe"

  // 2. Injection detection (returns { injectionDetected: boolean })
  const injection = await detectInjection(input);

  // 3. Risk scoring (returns { riskLevel: "low" | "medium" | "high" })
  const risk = await scoreRisk(classification, injection.injectionDetected);

  // 4. Prepare response fields
  let rawResponse = "";
  let finalResponse = "";
  let rewriteApplied = false;
  let latencyMs = 0;
  let modelName = "";

  // 5. Rewrite if unsafe or injected
  if (injection.injectionDetected || risk.riskLevel === "high") {
    finalResponse = await safeRewrite(input);
    rewriteApplied = true;
  } else {
    // 6. Call LLM normally
    const llm = await callLLM(input);

    rawResponse = llm.output;
    finalResponse = llm.output;
    latencyMs = llm.latencyMs;
    modelName = llm.modelName;
  }

  // 7. Return full telemetry object
  return {
    input,
    classification,              // string
    riskLevel: risk.riskLevel,   // "low" | "medium" | "high"
    injectionDetected: injection.injectionDetected,
    rewriteApplied,
    rawResponse,
    finalResponse,
    latencyMs,
    modelName,
  };
}