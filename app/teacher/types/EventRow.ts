export type EventRow = {
  id: number | null;
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