export async function callLLM(prompt: string) {
  const start = Date.now();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }]
    })
  }).then(r => r.json());

  // 🔥 NEW: Error handling
  if (!response.choices) {
    console.error("Groq API Error:", response);
    return {
      output: "The AI model could not generate a response.",
      latencyMs: Date.now() - start,
      modelName: "llama3-8b",
    };
  }

  return {
    output: response.choices[0].message.content,
    latencyMs: Date.now() - start,
    modelName: "llama3-8b",
  };
}