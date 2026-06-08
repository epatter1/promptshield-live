import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { runSafetyPipeline } from "@/lib/safety/pipeline";
import { turso } from "@/lib/db/turso";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt field" },
        { status: 400 }
      );
    }

    const id = randomUUID();

    const result = await runSafetyPipeline(prompt);

    await turso.execute({
      sql: `
        INSERT INTO PromptShieldEvents (
          id,
          timestamp,
          sessionId,
          input,
          safeResponse,
          rawResponse,
          classification,
          riskLevel,
          injectionDetected,
          rewriteApplied,
          modelName,
          latencyMs
        ) VALUES (
          ?,
          datetime('now'),
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
      `,
      args: [
        id,
        sessionId,
        result.input,
        result.finalResponse,
        result.rawResponse,
        result.classification,
        result.riskLevel,
        result.injectionDetected ? 1 : 0,
        result.rewriteApplied ? 1 : 0,
        result.modelName,
        result.latencyMs,
      ],
    });

    return NextResponse.json({
      response: result.finalResponse,
      riskLevel: result.riskLevel,
      injectionDetected: result.injectionDetected,
      rewriteApplied: result.rewriteApplied,
    });
  } catch (err) {
    console.error("❌ Chat route error:", err);
    return NextResponse.json({ error: "Chat route failed" }, { status: 500 });
  }
}