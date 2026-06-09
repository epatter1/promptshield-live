export function detectInjection(input: string): boolean {
  const patterns = [
    "ignore previous",
    "bypass",
    "jailbreak",
    "system override",
  ];

  return patterns.some((p) =>
    input.toLowerCase().includes(p.toLowerCase())
  );
}