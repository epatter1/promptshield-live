import { db } from "@/lib/db/turso";
import { randomUUID } from "crypto";

export async function logEvent(event: {
  sessionId: string;
  input: string;
  rawResponse?: string | null;
  safeResponse: string;
  classification: string;
  riskLevel: string;
  injectionDetected: boolean;
  rewriteApplied: boolean;
  evalToxicity?: number | null;
  modelName: string;
  latencyMs: number;
  sourceIp: string;
  userAgent: string;
}) {
  await db.execute({
    sql: `
      INSERT INTO PromptShieldEvents (
        id,
        timestamp,
        sessionId,
        input,
        rawResponse,
        safeResponse,
        classification,
        riskLevel,
        injectionDetected,
        rewriteApplied,
        evalToxicity,
        modelName,
        latencyMs,
        sourceIp,
        userAgent
      )
      VALUES (
        ?, 
        CURRENT_TIMESTAMP,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `,
    args: [
      randomUUID(),
      event.sessionId,
      event.input,
      event.rawResponse ?? null,
      event.safeResponse,
      event.classification,
      event.riskLevel,
      event.injectionDetected ? 1 : 0,
      event.rewriteApplied ? 1 : 0,
      event.evalToxicity ?? null,
      event.modelName,
      event.latencyMs,
      event.sourceIp,
      event.userAgent,
    ],
  });
}