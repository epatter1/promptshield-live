import { semanticCategory, semanticRiskScore } from "./semantic";

export async function computeRiskScore(input: string): Promise<number> {
  const category = await semanticCategory(input);
  const base = await semanticRiskScore(input);

  let score = base * 100;

  switch (category) {
    case "MANIPULATION": score += 10; break;
    case "JAILBREAK":
    case "CONFIDENTIAL": score += 20; break;
    case "PII":
    case "FRAUD":
    case "SEXUAL":
    case "HATE": score += 30; break;
    case "VIOLENCE":
    case "EXTREMISM": score += 40; break;
    case "SELF_HARM":
    case "MALWARE": score = 100; break;
  }

  return Math.min(score, 100);
}