import { query } from "../db";
import { decrypt } from "../lib/crypto";

export type ProviderId = "openai" | "anthropic" | "groq" | "local";

export interface ResolvedTarget {
  provider: ProviderId;
  model: string;
  apiKey: string;
  baseUrl: string;
}

export interface RouteResolution {
  targets: ResolvedTarget[]; // primary first, then fallbacks
  routingReason: string;
}

// Default model per provider when the client sends "auto" or only a provider hint.
const DEFAULT_MODEL: Record<ProviderId, string> = {
  openai: "gpt-4o-mini",
  anthropic: "claude-3-5-haiku-latest",
  groq: "llama-3.1-8b-instant",
  local: "llama3",
};

const FALLBACK_ORDER: ProviderId[] = ["openai", "anthropic", "groq", "local"];

export function providerForModel(model: string): ProviderId | null {
  const m = model.toLowerCase();
  if (m.startsWith("claude") || m.startsWith("anthropic/")) return "anthropic";
  if (m.startsWith("gpt") || m.startsWith("o1") || m.startsWith("o3") || m.startsWith("chatgpt") || m.startsWith("text-"))
    return "openai";
  if (
    m.startsWith("llama") ||
    m.startsWith("mixtral") ||
    m.startsWith("gemma") ||
    m.startsWith("groq/") ||
    m.includes("-versatile") ||
    m.includes("-instant")
  )
    return "groq";
  return null;
}

export async function resolveRoute(
  workspaceId: string,
  requestedModel: string,
  metadata: Record<string, any>,
): Promise<RouteResolution> {
  const { rows } = await query(
    `SELECT provider, encrypted_api_key, base_url FROM provider_credentials WHERE workspace_id = $1`,
    [workspaceId],
  );
  const creds = new Map<ProviderId, { apiKey: string; baseUrl: string }>();
  for (const r of rows) {
    creds.set(r.provider as ProviderId, { apiKey: decrypt(r.encrypted_api_key), baseUrl: r.base_url });
  }
  if (creds.size === 0) return { targets: [], routingReason: "no provider configured" };

  const override = (metadata?.provider as ProviderId) || null;
  const requested = requestedModel && requestedModel !== "auto" ? requestedModel : null;

  let primaryProvider: ProviderId | null = null;
  let primaryModel = "";
  let reason = "";

  if (override && creds.has(override)) {
    primaryProvider = override;
    primaryModel = requested || DEFAULT_MODEL[override];
    reason = `provider override → ${override} (${primaryModel})`;
  } else if (requested) {
    const p = providerForModel(requested);
    if (p && creds.has(p)) {
      primaryProvider = p;
      primaryModel = requested;
      reason = `model ${requested} → ${p}`;
    }
  }

  // Auto, or requested model maps to an unconfigured/unknown provider.
  if (!primaryProvider) {
    if (creds.has("openai")) {
      primaryProvider = "openai";
      primaryModel = DEFAULT_MODEL.openai;
    } else {
      const first = FALLBACK_ORDER.find((p) => creds.has(p))!;
      primaryProvider = first;
      primaryModel = DEFAULT_MODEL[first];
    }
    reason = requested
      ? `${requested} not available → default ${primaryProvider} (${primaryModel})`
      : `auto → ${primaryProvider} (${primaryModel})`;
  }

  const targets: ResolvedTarget[] = [];
  const primaryCred = creds.get(primaryProvider)!;
  targets.push({ provider: primaryProvider, model: primaryModel, apiKey: primaryCred.apiKey, baseUrl: primaryCred.baseUrl });

  // Fallback chain: remaining configured providers, each on their default model.
  for (const p of FALLBACK_ORDER) {
    if (p === primaryProvider || !creds.has(p)) continue;
    const c = creds.get(p)!;
    targets.push({ provider: p, model: DEFAULT_MODEL[p], apiKey: c.apiKey, baseUrl: c.baseUrl });
  }

  return { targets, routingReason: reason };
}
