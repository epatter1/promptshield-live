export type EventRow = {
  id: string; // normalized ID
  timestamp: string;
  sessionId: string;
  input: string;
  rawResponse: string | null;
  safeResponse: string | null;
  classification: string;
  riskLevel: string;
  evalToxicity: number;
  rewriteApplied: number;
  injectionDetected: number;
  latencyMs: number;
  modelName: string;
};