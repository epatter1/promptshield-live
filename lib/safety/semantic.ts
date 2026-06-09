import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function semanticCategory(input: string) {
  const prompt = `
You are a security classifier. Categorize the user's message into EXACTLY one of the following categories:

SAFE
PII
FRAUD
VIOLENCE
SELF_HARM
SEXUAL
HATE
EXTREMISM
MALWARE
CONFIDENTIAL
JAILBREAK
MANIPULATION

Respond with ONLY the category name.
`;

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: input }
    ]
  });

  return completion.choices[0].message.content?.trim() || "SAFE";
}

export async function semanticRiskScore(input: string): Promise<number> {
  const category = await semanticCategory(input);

  switch (category) {
    case "SAFE": return 0.0;
    case "MANIPULATION": return 0.4;
    case "JAILBREAK": return 0.5;
    case "CONFIDENTIAL": return 0.6;
    case "PII": return 0.7;
    case "FRAUD": return 0.75;
    case "SEXUAL": return 0.8;
    case "HATE": return 0.85;
    case "VIOLENCE": return 0.9;
    case "EXTREMISM": return 0.95;
    case "SELF_HARM":
    case "MALWARE": return 1.0;
    default: return 0.0;
  }
}

export async function semanticRiskLevel(input: string) {
  const category = await semanticCategory(input);

  switch (category) {
    case "SAFE": return "SAFE";
    case "MANIPULATION": return "LOW";
    case "JAILBREAK":
    case "CONFIDENTIAL": return "MEDIUM";
    case "PII":
    case "FRAUD":
    case "SEXUAL":
    case "HATE": return "HIGH";
    case "VIOLENCE":
    case "EXTREMISM":
    case "SELF_HARM":
    case "MALWARE": return "CRITICAL";
    default: return "SAFE";
  }
}