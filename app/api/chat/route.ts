import { NextResponse } from "next/server";
import { runSafetyPipeline } from "@/lib/safety/pipeline";
import { logEvent } from "@/lib/telemetry/logEvent";

export async function POST(req: Request) {
  const start = Date.now();
  const { input, sessionId } = await req.json();

  const safety = await runSafetyPipeline(input);

  const latencyMs = Date.now() - start;

  await logEvent({
    sessionId,
    input,
    rawResponse: safety.safe ? undefined : input,
    safeResponse: safety.safe ? input : safety.response,
    classification: safety.classification,
    riskLevel: safety.riskLevel,
    injectionDetected: safety.injectionDetected,
    rewriteApplied: !safety.safe,
    modelName: "placeholder-llm",
    latencyMs,
    sourceIp: req.headers.get("x-forwarded-for") ?? "unknown",
    userAgent: req.headers.get("user-agent") ?? "unknown",
  });

  return NextResponse.json({ safety });
}