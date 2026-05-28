export async function detectInjection(input: string) {
  const patterns = [
    "ignore previous",
    "disregard instructions",
    "system override",
    "jailbreak",
    "developer mode",
  ];

  const hit = patterns.some(p =>
    input.toLowerCase().includes(p)
  );

  return {
    injectionDetected: hit,
    signals: hit ? ["pattern-match"] : [],
  };
}