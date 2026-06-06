import { NextResponse } from "next/server";
import { turso } from "@/lib/db/turso";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    const where = sessionId ? "WHERE sessionId = ?" : "";
    const args = sessionId ? [sessionId] : [];

    const result = await turso.execute({
      sql: `
        SELECT
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
          evalToxicity,
          modelName,
          latencyMs
        FROM PromptShieldEvents
        ${where}
        ORDER BY timestamp ASC
        LIMIT 500
      `,
      args
    });

    return NextResponse.json({
      events: result.rows
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}