import { db } from "./client";
import { randomUUID } from "crypto";

export type EventInsert = {
  sessionId: string;
  timestamp: string;
  input: string;
  safeResponse: string | null;
  rawResponse: string | null;
  classification: string;
  riskLevel: string;
  injectionDetected: number;
  rewriteApplied: number;
  evalToxicity: number;
  modelName: string;
  latencyMs: number;
};

export async function logEvent(event: EventInsert) {
  const id = randomUUID();

  await db.execute({
    sql: `
      INSERT INTO PromptShieldEvents
      (
        id,
        sessionId,
        timestamp,
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
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      event.sessionId,
      event.timestamp,
      event.input,
      event.safeResponse,
      event.rawResponse,
      event.classification,
      event.riskLevel,
      event.injectionDetected,
      event.rewriteApplied,
      event.evalToxicity,
      event.modelName,
      event.latencyMs
    ]
  });

  return id;
}