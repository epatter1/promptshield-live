export async function safeRewrite(input: string) {
  return `User attempted unsafe input. Reformulated: ${input}`;
}