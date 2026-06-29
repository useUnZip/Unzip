// USD price per 1,000,000 tokens. Source: public OpenAI pricing (approximate).
// Used to compute real cost from real token usage returned by the provider.
type Price = { input: number; output: number };

export const MODEL_PRICING: Record<string, Price> = {
  // OpenAI
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4.1": { input: 2, output: 8 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4.1-nano": { input: 0.1, output: 0.4 },
  "o3-mini": { input: 1.1, output: 4.4 },
  "o1-mini": { input: 1.1, output: 4.4 },
  "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
  // Anthropic
  "claude-3-5-sonnet": { input: 3, output: 15 },
  "claude-3-5-haiku": { input: 0.8, output: 4 },
  "claude-3-opus": { input: 15, output: 75 },
  "claude-3-haiku": { input: 0.25, output: 1.25 },
  "claude-sonnet-4": { input: 3, output: 15 },
  "claude-opus-4": { input: 15, output: 75 },
  // Groq (OpenAI-compatible)
  "llama-3.1-8b-instant": { input: 0.05, output: 0.08 },
  "llama-3.3-70b-versatile": { input: 0.59, output: 0.79 },
  "llama-3.1-70b": { input: 0.59, output: 0.79 },
  "mixtral-8x7b": { input: 0.24, output: 0.24 },
  "gemma2-9b-it": { input: 0.2, output: 0.2 },
};

// USD price per 1,000,000 tokens for embedding models (semantic cache).
export const EMBEDDING_PRICING: Record<string, number> = {
  "text-embedding-3-small": 0.02,
  "text-embedding-3-large": 0.13,
  "text-embedding-ada-002": 0.1,
};

export function embeddingCostUsd(model: string, tokens: number): number {
  const rate = EMBEDDING_PRICING[model] ?? 0.02;
  return Math.round((tokens / 1_000_000) * rate * 1_000_000) / 1_000_000;
}

const DEFAULT_PRICE: Price = { input: 0.5, output: 1.5 };

export function priceFor(model: string): Price {
  if (MODEL_PRICING[model]) return MODEL_PRICING[model];
  // Match by family prefix (e.g. "gpt-4o-2024-08-06").
  const key = Object.keys(MODEL_PRICING).find((m) => model.startsWith(m));
  return key ? MODEL_PRICING[key] : DEFAULT_PRICE;
}

export function computeCostUsd(model: string, promptTokens: number, completionTokens: number): number {
  const p = priceFor(model);
  const cost = (promptTokens / 1_000_000) * p.input + (completionTokens / 1_000_000) * p.output;
  return Math.round(cost * 1_000_000) / 1_000_000; // round to 6 decimals
}
