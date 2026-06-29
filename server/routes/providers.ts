import { Router } from "express";
import { query } from "../db";
import { requireAuth } from "../middleware/auth";
import { encrypt, decrypt } from "../lib/crypto";
import { openaiHealth } from "../providers/openai";
import { anthropicHealth } from "../providers/anthropic";

export const providersRouter = Router();

const ALLOWED = ["openai", "anthropic", "groq", "local"] as const;
type Provider = (typeof ALLOWED)[number];

const DEFAULT_BASE_URL: Record<Provider, string> = {
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  groq: "https://api.groq.com/openai/v1",
  local: "http://localhost:11434/v1",
};

// SSRF guard: the hosted SaaS providers are pinned to their official endpoints —
// a user-supplied base URL is never used for them. Only "local" (self-hosted
// Ollama, the user's own infra) may override, and it must be a valid http(s) URL.
function resolveBaseUrl(provider: Provider, userBaseUrl?: string): { baseUrl?: string; error?: string } {
  if (provider !== "local") return { baseUrl: DEFAULT_BASE_URL[provider] };
  const raw = userBaseUrl?.trim();
  if (!raw) return { baseUrl: DEFAULT_BASE_URL.local };
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { error: "base URL must use http or https" };
    }
    return { baseUrl: raw };
  } catch {
    return { error: "invalid base URL" };
  }
}

providersRouter.use(requireAuth);

providersRouter.get("/", async (req, res) => {
  const { rows } = await query(
    `SELECT provider, base_url, updated_at FROM provider_credentials WHERE workspace_id = $1 ORDER BY provider`,
    [req.user!.workspaceId],
  );
  res.json(
    rows.map((r) => ({ provider: r.provider, baseUrl: r.base_url, configured: true, updatedAt: r.updated_at })),
  );
});

providersRouter.put("/:provider", async (req, res) => {
  const provider = String(req.params.provider) as Provider;
  if (!ALLOWED.includes(provider)) {
    res.status(400).json({ error: "unsupported provider" });
    return;
  }
  const { apiKey, baseUrl } = req.body || {};
  if (!apiKey || String(apiKey).trim().length < 8) {
    res.status(400).json({ error: "a valid API key is required" });
    return;
  }
  const resolved = resolveBaseUrl(provider, baseUrl);
  if (resolved.error) {
    res.status(400).json({ error: resolved.error });
    return;
  }
  const encrypted = encrypt(String(apiKey).trim());
  const finalBaseUrl = resolved.baseUrl;
  await query(
    `INSERT INTO provider_credentials (workspace_id, provider, encrypted_api_key, base_url)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (workspace_id, provider)
     DO UPDATE SET encrypted_api_key = EXCLUDED.encrypted_api_key, base_url = EXCLUDED.base_url, updated_at = now()`,
    [req.user!.workspaceId, provider, encrypted, finalBaseUrl],
  );
  res.json({ provider, baseUrl: finalBaseUrl, configured: true });
});

providersRouter.delete("/:provider", async (req, res) => {
  await query(`DELETE FROM provider_credentials WHERE workspace_id = $1 AND provider = $2`, [
    req.user!.workspaceId,
    String(req.params.provider),
  ]);
  res.json({ ok: true });
});

providersRouter.post("/:provider/test", async (req, res) => {
  const provider = String(req.params.provider);
  const { rows } = await query(
    `SELECT encrypted_api_key, base_url FROM provider_credentials WHERE workspace_id = $1 AND provider = $2`,
    [req.user!.workspaceId, provider],
  );
  if (!rows[0]) {
    res.status(404).json({ error: "provider not configured" });
    return;
  }
  const apiKey = decrypt(rows[0].encrypted_api_key);
  const baseUrl = rows[0].base_url || DEFAULT_BASE_URL[provider as Provider] || undefined;
  const health =
    provider === "anthropic"
      ? await anthropicHealth(apiKey, baseUrl)
      : await openaiHealth(apiKey, baseUrl);
  res.json({ ok: health.ok, status: health.status, latencyMs: health.latencyMs, error: health.error });
});
