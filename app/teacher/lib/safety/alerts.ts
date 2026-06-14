import { semanticCategory } from "./semantic";

interface AlertInput {
  input: string;
  riskScore: number;
  rewriteApplied: boolean;
}

export async function evaluateAlert({
  input,
  riskScore,
  rewriteApplied
}: AlertInput): Promise<{ shouldAlert: boolean; reason: string }> {
  const category = await semanticCategory(input);

  if (["SELF_HARM", "MALWARE", "EXTREMISM", "VIOLENCE"].includes(category)) {
    return { shouldAlert: true, reason: `Critical category: ${category}` };
  }

  if (["PII", "FRAUD", "SEXUAL", "HATE"].includes(category)) {
    return { shouldAlert: true, reason: `High-risk category: ${category}` };
  }

  if (riskScore >= 80) {
    return { shouldAlert: true, reason: "High multi-signal risk score" };
  }

  if (rewriteApplied) {
    return { shouldAlert: true, reason: "Unsafe content rewritten" };
  }

  return { shouldAlert: false, reason: "" }; // FIX: no nulls
}