import { detectInjection } from "@/mcp-servers/injection-detector";
import { scoreRisk } from "@/mcp-servers/risk-scorer";
import { safeRewrite } from "@/mcp-servers/safe-rewrite";
import { classify } from "@/mcp-servers/safety-classifier";
import { callLLM } from "@/lib/llm/callLLM";

export async function runSafetyPipeline(input: string) {
  // classification is an OBJECT — extract the string category
  const classificationObj = await classify(input);
  const classification = classificationObj.category; // <-- FIXED

  const injection = await detectInjection(input);
  const risk = await scoreRisk(classification, injection.injectionDetected);

  let rawResponse = "";
  let finalResponse = "";
  let rewriteApplied = false;
  let latencyMs = 0;
  let modelName = "";

  if (injection.injectionDetected || risk.riskLevel === "high") {
    finalResponse = await safeRewrite(input);
    rewriteApplied = true;
  } else {
    const llm = await callLLM(input);

    rawResponse = llm.output;
    finalResponse = llm.output;
    latencyMs = llm.latencyMs;
    modelName = llm.modelName;
  }

  return {
    input,
    classification,              // now a STRING
    riskLevel: risk.riskLevel,
    injectionDetected: injection.injectionDetected,
    rewriteApplied,
    rawResponse,
    finalResponse,
    latencyMs,
    modelName,
  };
}