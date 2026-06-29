import crypto from "crypto";

// Deterministic JSON stringify (sorted keys) so logically-identical requests
// produce the same cache key regardless of property order.
function stableStringify(obj: any): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return "[" + obj.map(stableStringify).join(",") + "]";
  const keys = Object.keys(obj).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") + "}";
}

// Non-semantic fields excluded from the cache key. `model` is excluded from the
// raw body because the *resolved* model is pinned separately (a client may send
// "auto"); `stream` and `metadata` do not affect the generated content.
const EXCLUDED_FIELDS = new Set(["model", "stream", "metadata"]);

// Exact-match cache key. Canonicalizes the FULL request payload (every
// output-affecting parameter) plus the resolved provider+model, so two requests
// produce the same key only when they are byte-for-byte equivalent generations.
export function buildCacheKey(provider: string, model: string, body: Record<string, any>): string {
  const subset: Record<string, any> = { __provider: provider, __model: model };
  for (const k of Object.keys(body)) {
    if (EXCLUDED_FIELDS.has(k)) continue;
    if (body[k] === undefined) continue;
    subset[k] = body[k];
  }
  return crypto.createHash("sha256").update(stableStringify(subset)).digest("hex");
}
