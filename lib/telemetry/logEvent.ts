import { turso } from "@/lib/db/turso";
import { v4 as uuid } from "uuid";

export async function logEvent(event: any) {
  await turso.execute({
    sql: `
      INSERT INTO PromptShieldEvents (
        id, sessionId, input, rawResponse, safeResponse,
        classification, riskLevel, injectionDetected, rewriteApplied,
        evalToxicity, modelName, latencyMs, sourceIp, userAgent
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      uuid(),
      event.sessionId,
      event.input,
      event.rawResponse,
      event.safeResponse,
      JSON.stringify(event.classification),
      event.riskLevel,
      event.injectionDetected,
      event.rewriteApplied,
      event.evalToxicity,
      event.modelName,
      event.latencyMs,
      event.sourceIp,
      event.userAgent,
    ],
  });
}