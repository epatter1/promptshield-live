import { turso } from "../db/turso"; // adjust import if needed
import crypto from "crypto";

export async function logEvent(event: any) {
  const id = crypto.randomUUID();

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
      id,
      String(event.sessionId ?? ""),
      String(event.input ?? ""),
      String(event.rawResponse ?? ""),
      String(event.safeResponse ?? ""),
      String(event.classification ?? ""),
      String(event.riskLevel ?? ""),
      event.injectionDetected ? 1 : 0,
      event.rewriteApplied ? 1 : 0,
      Number(event.evalToxicity ?? 0),
      String(event.modelName ?? "unknown"),
      Number(event.latencyMs ?? 0),
      String(event.sourceIp ?? ""),
      String(event.userAgent ?? "")
    ],
  });
}