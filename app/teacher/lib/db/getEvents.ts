import { db } from "./client";
import { EventRow } from "../../types/EventRow";

export async function getEvents(): Promise<EventRow[]> {
  const result = await db.execute(`
    SELECT
      id,
      timestamp,
      sessionId,
      input,
      rawResponse,
      safeResponse,
      classification,
      riskLevel,
      evalToxicity,
      rewriteApplied,
      injectionDetected,
      latencyMs,
      modelName
    FROM PromptShieldEvents
    ORDER BY timestamp DESC
  `);

  return result.rows.map((r: any) => ({
    id: r.id,
    timestamp: r.timestamp,
    sessionId: r.sessionId,
    input: r.input,
    rawResponse: r.rawResponse,
    safeResponse: r.safeResponse,
    classification: r.classification,
    riskLevel: r.riskLevel,
    evalToxicity: r.evalToxicity,
    rewriteApplied: r.rewriteApplied,
    injectionDetected: r.injectionDetected,
    latencyMs: r.latencyMs,
    modelName: r.modelName,
  }));
}