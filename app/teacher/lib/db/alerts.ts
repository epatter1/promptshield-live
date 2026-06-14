import { db } from "./client";
import { randomUUID } from "crypto";

export type AlertInsert = {
  sessionId: string;
  timestamp: string;
  input: string;
  riskLevel: string;
  riskScore: number;
  reason: string;
};

export async function logAlert(data: AlertInsert) {
  const id = randomUUID();

  await db.execute({
    sql: `
      INSERT INTO PromptShieldAlerts
      (id, sessionId, timestamp, input, riskLevel, riskScore, reason)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      data.sessionId,
      data.timestamp,
      data.input,
      data.riskLevel,
      data.riskScore,
      data.reason
    ]
  });

  return id;
}