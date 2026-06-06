export interface EventRecord {
  id: string;
  timestamp: string;
  sessionId: string;
  input: string;
  safeResponse: string;
  rawResponse?: string;
  classification: string;
  riskLevel: "low" | "medium" | "high" | string;
  injectionDetected: number | boolean;
  rewriteApplied: number | boolean;
  modelName?: string;
  latencyMs: number | null;   // unified type
}