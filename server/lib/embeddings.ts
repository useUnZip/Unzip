import { query } from "../db";
import { decrypt } from "./crypto";

// Fixed embedding model + dimension. All stored vectors MUST share this
// dimension (the cache_entries.embedding column is vector(1536)), so the model
// is pinned here and never taken from the request.
export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIM = 1536;

export interface EmbeddingCred {
  apiKey: string;
  baseUrl: string;
}

export interface EmbeddingResult {
  vector: number[];
  tokens: number;
}

// Canonical text used for semantic similarity. We embed the conversation
// content (role + text) so two prompts that mean the same thing land close
// together regardless of exact wording.
export function messagesToText(messages: any[]): string {
  if (!Array.isArray(messages)) return "";
  const parts: string[] = [];
  for (const m of messages) {
    const role = m?.role || "";
    let content = "";
    if (typeof m?.content === "string") {
      content = m.content;
    } else if (Array.isArray(m?.content)) {
      content = m.content.map((p: any) => (typeof p?.text === "string" ? p.text : "")).join(" ");
    }
    parts.push(`${role}: ${content}`.trim());
  }
  return parts.join("\n");
}

// Embeddings require an OpenAI (or OpenAI-compatible) credential. If the
// workspace has not configured one, semantic cache is simply inactive and the
// gateway falls back to exact-match only.
export async function getEmbeddingCred(workspaceId: string): Promise<EmbeddingCred | null> {
  const { rows } = await query(
    `SELECT encrypted_api_key, base_url FROM provider_credentials WHERE workspace_id = $1 AND provider = 'openai'`,
    [workspaceId],
  );
  if (!rows[0]) return null;
  return {
    apiKey: decrypt(rows[0].encrypted_api_key),
    baseUrl: rows[0].base_url || "https://api.openai.com/v1",
  };
}

export async function embedText(cred: EmbeddingCred, text: string): Promise<EmbeddingResult | null> {
  const input = (text || "").slice(0, 16000);
  if (!input.trim()) return null;
  try {
    const resp = await fetch(`${cred.baseUrl.replace(/\/$/, "")}/embeddings`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cred.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: EMBEDDING_MODEL, input }),
    });
    if (!resp.ok) return null;
    const json: any = await resp.json();
    const vector = json?.data?.[0]?.embedding;
    if (!Array.isArray(vector) || vector.length !== EMBEDDING_DIM) return null;
    const tokens = Number(json?.usage?.prompt_tokens) || 0;
    return { vector, tokens };
  } catch {
    return null;
  }
}

// pgvector accepts a bracketed, comma-separated literal cast to ::vector.
export function toVectorLiteral(vec: number[]): string {
  return "[" + vec.join(",") + "]";
}
