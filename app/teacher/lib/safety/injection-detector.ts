export async function detectInjection(input: string): Promise<boolean> {
  const lowered = input.toLowerCase();

  const patterns = [
    "ignore previous",
    "jailbreak",
    "override",
    "system:",
    "developer message",
    "prompt injection",
    "forget your instructions"
  ];

  return patterns.some(p => lowered.includes(p));
}