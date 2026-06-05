export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { runSafetyPipeline } from "@/lib/safety/pipeline";
import { logEvent } from "@/lib/telemetry/logEvent";

export async function POST(req: Request) {
  const { prompt, sessionId } = await req.json();

  const start = Date.now();
  const safety = await runSafetyPipeline(prompt);
  console.log("SAFETY RESULT:", safety);
  const latencyMs = Date.now() - start;

  await logEvent({
    sessionId,
    input: prompt,
    rawResponse: safety.rawResponse,
    safeResponse: safety.finalResponse,
    classification: safety.classification,
    riskLevel: safety.riskLevel,
    injectionDetected: safety.injectionDetected,
    rewriteApplied: safety.rewriteApplied,
    modelName: "llama3-8b-8192",
    latencyMs,
    sourceIp: req.headers.get("x-forwarded-for") || "",
    userAgent: req.headers.get("user-agent") || "",
  });

  return NextResponse.json({
    response: safety.finalResponse,
    riskLevel: safety.riskLevel,
    injectionDetected: safety.injectionDetected,
    rewriteApplied: safety.rewriteApplied,
  });
}