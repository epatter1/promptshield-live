export function classifyContent(input: string): string {
  if (input.includes("violence")) return "violence";
  if (input.includes("harm")) return "self-harm";
  return "safe";
}

