"use server";

import { db } from "./client";
import { randomUUID } from "crypto";
import { EventRow } from "../../types/EventRow";

// -----------------------------
// INSERT EVENT
// -----------------------------
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
      event.latencyMs,
    ],
  });

  return id;
}

// -----------------------------
// FETCH ALL EVENTS (TYPE-SAFE)
// -----------------------------
export async function getEvents(): Promise<EventRow[]> {
  const result = await db.execute({
    sql: `
      SELECT
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
      FROM PromptShieldEvents
      ORDER BY timestamp DESC
    `,
  });

  return result.rows.map((r: any) => ({
    id: r.id,
    sessionId: r.sessionId,
    timestamp: r.timestamp,
    input: r.input,
    safeResponse: r.safeResponse,
    rawResponse: r.rawResponse,
    classification: r.classification,
    riskLevel: r.riskLevel,
    injectionDetected: r.injectionDetected,
    rewriteApplied: r.rewriteApplied,
    evalToxicity: r.evalToxicity,
    modelName: r.modelName,
    latencyMs: r.latencyMs,
  }));
}

// -----------------------------
// FETCH EVENTS BY SESSION
// -----------------------------
export async function getEventsBySession(sessionId: string): Promise<EventRow[]> {
  const result = await db.execute({
    sql: `
      SELECT
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
      FROM PromptShieldEvents
      WHERE sessionId = ?
      ORDER BY timestamp ASC
    `,
    args: [sessionId],
  });

  return result.rows.map((r: any) => ({
    id: r.id,
    sessionId: r.sessionId,
    timestamp: r.timestamp,
    input: r.input,
    safeResponse: r.safeResponse,
    rawResponse: r.rawResponse,
    classification: r.classification,
    riskLevel: r.riskLevel,
    injectionDetected: r.injectionDetected,
    rewriteApplied: r.rewriteApplied,
    evalToxicity: r.evalToxicity,
    modelName: r.modelName,
    latencyMs: r.latencyMs,
  }));
}
