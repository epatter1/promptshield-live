import { semanticCategory } from "./semantic";

export async function safeRewrite(input: string): Promise<string> {
  const category = await semanticCategory(input);

  switch (category) {
    case "PII":
      return "I can't provide personal or sensitive information, but I can explain how to protect your identity.";
    case "FRAUD":
      return "I can't assist with fraudulent activity, but I can explain how to recognize and avoid scams.";
    case "VIOLENCE":
      return "I can't help with violent actions. If you're feeling unsafe, I can offer guidance on staying protected.";
    case "SELF_HARM":
      return "I'm really sorry you're feeling this way. You deserve support. Consider reaching out to someone you trust or a trained professional.";
    case "SEXUAL":
      return "I can't engage in explicit content, but I can help with general relationship or health questions.";
    case "HATE":
      return "I can't assist with hateful or discriminatory content. I can help discuss respectful communication instead.";
    case "EXTREMISM":
      return "I can't support extremist content, but I can provide historical or academic context if helpful.";
    case "MALWARE":
      return "I can't help create or distribute malware, but I can explain cybersecurity best practices.";
    case "CONFIDENTIAL":
      return "I can't provide confidential or internal information, but I can help with general knowledge.";
    case "JAILBREAK":
      return "I can't bypass safety rules, but I can still help answer your question safely.";
    case "MANIPULATION":
      return "I can't participate in manipulation, but I can help with ethical communication strategies.";
    default:
      return "I can help with that, but I need to keep things safe. How else can I assist?";
  }
}