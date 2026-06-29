// Rough token estimate used only when the provider does not return usage.
// Real cost always prefers provider-reported usage.
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function estimateMessagesTokens(messages: Array<{ role: string; content: unknown }>): number {
  let total = 0;
  for (const m of messages || []) {
    if (typeof m.content === "string") {
      total += estimateTokens(m.content);
    } else if (Array.isArray(m.content)) {
      for (const part of m.content) {
        if (part && typeof part.text === "string") total += estimateTokens(part.text);
      }
    }
    total += 4; // per-message overhead
  }
  return total;
}
