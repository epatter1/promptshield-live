export async function scoreRisk(classification: any, injection: boolean) {
  if (injection) return { riskLevel: "high" };
  return { riskLevel: "low" };
}