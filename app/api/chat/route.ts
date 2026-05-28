import { NextResponse } from "next/server";
import { runSafetyPipeline } from "@/lib/safety/pipeline";
import { callLLM } from "@/lib/llm/callLLM";
import { logEvent } from "@/lib/telemetry/logEvent";

export async function POST(req: Request) {
  const { input, sessionId } = await req.json();

  const safety = await runSafetyPipeline(input);

  let rawResponse = "";
  let safeResponse = "";
  let modelName = "";
  let latencyMs = 0;

  if (safety.injectionDetected) {
    safeResponse = await safety.safeRewrite(input);
  } else {
    const llm = await callLLM(input);
    rawResponse = llm.output;
    safeResponse = rawResponse;
    modelName = llm.modelName;
    latencyMs = llm.latencyMs;
  }

  await logEvent({
    sessionId,
    input,
    rawResponse,
    safeResponse,
    classification: safety.classification,
    riskLevel: safety.riskLevel,
    injectionDetected: safety.injectionDetected,
    rewriteApplied: safety.rewriteApplied,
    evalToxicity: null,
    modelName,
    latencyMs,
    sourceIp: req.headers.get("x-forwarded-for") || "",
    userAgent: req.headers.get("user-agent") || "",
  });

  return NextResponse.json({
    safeResponse,
    riskLevel: safety.riskLevel,
    injectionDetected: safety.injectionDetected,
  });
}