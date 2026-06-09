import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function classifyRisk(input: string) {
  const prompt = `
You are a security classifier. Rate the risk level of the user's input.

Risk categories:
SAFE, LOW, MEDIUM, HIGH, CRITICAL

Respond with ONLY one of those.
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