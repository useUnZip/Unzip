import { Router } from "express";
import { query } from "../db";
import { hashApiKey } from "../lib/apikey";
import { openaiChatCompletion } from "../providers/openai";
import { anthropicChatCompletion } from "../providers/anthropic";
import { computeCostUsd, embeddingCostUsd } from "../lib/pricing";
import { estimateMessagesTokens, estimateTokens } from "../lib/tokens";
import { buildCacheKey } from "../lib/cache";
import { compressMessages } from "../lib/compress";
import {
  EMBEDDING_MODEL,
  embedText,
  getEmbeddingCred,
  messagesToText,
  toVectorLiteral,
  type EmbeddingResult,
} from "../lib/embeddings";
import { resolveRoute, ResolvedTarget } from "./router";
import type { ProviderCallResult } from "../providers/openai";

export const gatewayRouter = Router();

interface AuthedKey {
  apiKeyId: string;
  workspaceId: string;
}

async function authenticate(req: any): Promise<AuthedKey | null> {
  const header = req.headers["authorization"] || "";
  const match = /^Bearer\s+(.+)$/i.exec(String(header));
  if (!match) return null;
  const hash = hashApiKey(match[1].trim());
  const { rows } = await query(
    `SELECT id, workspace_id FROM api_keys WHERE key_hash = $1 AND revoked_at IS NULL`,
    [hash],
  );
  if (!rows[0]) return null;
  return { apiKeyId: rows[0].id, workspaceId: rows[0].workspace_id };
}

function callProvider(target: ResolvedTarget, body: Record<string, any>): Promise<ProviderCallResult> {
  const providerBody = { ...body, model: target.model };
  if (target.provider === "anthropic") {
    return anthropicChatCompletion(target.apiKey, providerBody, target.baseUrl);
  }
  // openai / groq / local are all OpenAI-compatible.
  return openaiChatCompletion(target.apiKey, providerBody, target.baseUrl);
}

gatewayRouter.post("/chat/completions", async (req, res) => {
  const auth = await authenticate(req);
  if (!auth) {
    res.status(401).json({ error: { message: "Invalid UnZip API key", type: "authentication_error" } });
    return;
  }

  const body = { ...(req.body || {}) };
  const metadata = body.metadata && typeof body.metadata === "object" ? body.metadata : {};
  const route: string | null = metadata.route || null;
  const userRef: string | null = metadata.user_id || metadata.user || null;
  const noCache = metadata.no_cache === true || metadata.cache === false;
  const semanticEnabled = metadata.semantic_cache !== false; // on by default
  const semanticThreshold = clampThreshold(metadata.semantic_threshold);
  const compressEnabled = metadata.compress === true; // opt-in
  delete body.metadata;

  const requestedModel: string = body.model || "auto";
  const { targets, routingReason } = await resolveRoute(auth.workspaceId, requestedModel, metadata);

  if (targets.length === 0) {
    res.status(400).json({
      error: {
        message: "No provider credential configured. Add one in the UnZip dashboard under Providers.",
        type: "configuration_error",
      },
    });
    return;
  }

  // ---- Optional prompt compression (meaning-preserving, opt-in) ----
  const originalMessages = Array.isArray(body.messages) ? body.messages : [];
  let compressionApplied = false;
  if (compressEnabled && originalMessages.length > 0) {
    const compressed = compressMessages(originalMessages);
    if (compressed.applied) {
      body.messages = compressed.messages;
      compressionApplied = true;
    }
  }

  // Non-streaming in this fase so token usage is available for accurate cost + caching.
  const providerBody = { ...body, stream: false };

  const primary = targets[0];

  // ---- 1) Exact cache lookup (keyed on the primary target) ----
  const cacheKey = noCache ? null : buildCacheKey(primary.provider, primary.model, providerBody);
  if (cacheKey) {
    const cached = await query(
      `SELECT response_json, provider, model, prompt_tokens, completion_tokens, cost_usd FROM cache_entries
        WHERE workspace_id = $1 AND cache_key = $2`,
      [auth.workspaceId, cacheKey],
    );
    if (cached.rows[0]) {
      const c = cached.rows[0];
      await query(
        `UPDATE cache_entries SET hit_count = hit_count + 1, last_hit_at = now()
          WHERE workspace_id = $1 AND cache_key = $2`,
        [auth.workspaceId, cacheKey],
      );
      await logCacheHit(auth, route, requestedModel, c, "hit", `cache hit (${c.provider}/${c.model})`, userRef, 0);
      res.json(buildHitResponse(c, requestedModel, "hit", `cache hit (${c.provider}/${c.model})`, 0));
      return;
    }
  }

  // ---- 2) Semantic cache lookup (vector similarity) ----
  // Compute the query embedding once; reuse it to store the entry on a full miss.
  let embedding: EmbeddingResult | null = null;
  let embeddingCost = 0;
  if (!noCache && semanticEnabled) {
    const cred = await getEmbeddingCred(auth.workspaceId);
    if (cred) {
      embedding = await embedText(cred, messagesToText(body.messages || []));
      if (embedding) {
        embeddingCost = embeddingCostUsd(EMBEDDING_MODEL, embedding.tokens);
        const lit = toVectorLiteral(embedding.vector);
        const sim = await query(
          `SELECT id, response_json, provider, model, prompt_tokens, completion_tokens, cost_usd,
                  1 - (embedding <=> $2::vector) AS similarity
             FROM cache_entries
            WHERE workspace_id = $1 AND embedding IS NOT NULL
            ORDER BY embedding <=> $2::vector
            LIMIT 1`,
          [auth.workspaceId, lit],
        );
        const top = sim.rows[0];
        if (top && Number(top.similarity) >= semanticThreshold) {
          const reason = `semantic cache hit (${top.provider}/${top.model}, sim ${Number(top.similarity).toFixed(3)})`;
          await query(
            `UPDATE cache_entries SET hit_count = hit_count + 1, last_hit_at = now() WHERE id = $1`,
            [top.id],
          );
          await logCacheHit(auth, route, requestedModel, top, "semantic_hit", reason, userRef, embeddingCost);
          res.json(buildHitResponse(top, requestedModel, "semantic_hit", reason, embeddingCost, Number(top.similarity)));
          return;
        }
      }
    }
  }

  // ---- 3) Cache miss: call providers with fallback ----
  let result: ProviderCallResult | null = null;
  let used: ResolvedTarget = primary;
  let usedIndex = 0;
  let attemptReason = routingReason;
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const r = await callProvider(target, providerBody);
    if (r.ok && r.json && !r.json.error) {
      result = r;
      used = target;
      usedIndex = i;
      if (i > 0) attemptReason = `${routingReason} → fallback to ${target.provider} after ${primary.provider} failed`;
      break;
    }
    // keep the last failure to return if every provider fails
    result = r;
    used = target;
    usedIndex = i;
  }

  const ok = !!result && result.ok && result.json && !result.json.error;

  const usage = result?.json?.usage || {};
  const promptTokens = Number(usage.prompt_tokens) || estimateMessagesTokens(body.messages || []);
  const completionTokens =
    Number(usage.completion_tokens) || estimateTokens(result?.json?.choices?.[0]?.message?.content || "");
  const totalTokens = Number(usage.total_tokens) || promptTokens + completionTokens;
  // Self-hosted local compute is treated as zero marginal cost.
  const costUsd = used.provider === "local" ? 0 : computeCostUsd(used.model, promptTokens, completionTokens);

  // Compression savings: input-token cost we avoided by sending the trimmed prompt.
  let compressionSaved = 0;
  let inputTokensSaved = 0;
  if (ok && compressionApplied && used.provider !== "local") {
    const originalPromptTokens = estimateMessagesTokens(originalMessages);
    inputTokensSaved = Math.max(0, originalPromptTokens - estimateMessagesTokens(body.messages || []));
    compressionSaved = computeCostUsd(used.model, inputTokensSaved, 0);
  } else if (ok && compressionApplied) {
    inputTokensSaved = Math.max(0, estimateMessagesTokens(originalMessages) - estimateMessagesTokens(body.messages || []));
  }

  // Only cache responses served by the PRIMARY target. The cache key is derived
  // from the primary provider/model, so storing a fallback response under it would
  // poison the cache (later hits would return fallback output as if it were primary).
  if (ok && cacheKey && usedIndex === 0) {
    const embLit = embedding ? toVectorLiteral(embedding.vector) : null;
    await query(
      `INSERT INTO cache_entries
         (workspace_id, cache_key, provider, model, response_json, prompt_tokens, completion_tokens, cost_usd, embedding)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::vector)
       ON CONFLICT (workspace_id, cache_key)
       DO UPDATE SET response_json = EXCLUDED.response_json, cost_usd = EXCLUDED.cost_usd,
                     prompt_tokens = EXCLUDED.prompt_tokens, completion_tokens = EXCLUDED.completion_tokens,
                     embedding = COALESCE(EXCLUDED.embedding, cache_entries.embedding)`,
      [auth.workspaceId, cacheKey, used.provider, used.model, result!.json, promptTokens, completionTokens, costUsd, embLit],
    );
  }

  // Embedding cost was incurred regardless of whether the provider call
  // succeeded, so always include it; completion cost only counts on success.
  const missCost = embeddingCost + (ok ? costUsd : 0);
  const compressionStatus = compressionApplied ? "on" : "off";
  const totalSaved = compressionSaved;

  await query(
    `INSERT INTO request_logs
       (workspace_id, api_key_id, route, provider, model, requested_model,
        prompt_tokens, completion_tokens, total_tokens, estimated_cost_usd, estimated_saved_usd,
        latency_ms, cache_status, compression_status, routing_reason, status, status_code, user_ref)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'miss',$13,$14,$15,$16,$17)`,
    [
      auth.workspaceId,
      auth.apiKeyId,
      route,
      used.provider,
      used.model,
      requestedModel,
      promptTokens,
      completionTokens,
      totalTokens,
      missCost,
      totalSaved,
      result?.latencyMs || 0,
      compressionStatus,
      compressionApplied ? `${attemptReason}; compressed −${inputTokensSaved} input tokens` : attemptReason,
      ok ? "success" : "error",
      result?.status || 502,
      userRef,
    ],
  );
  await query(`UPDATE api_keys SET last_used_at = now() WHERE id = $1`, [auth.apiKeyId]);

  if (!ok) {
    res.status(result?.status || 502).json(
      result?.json || { error: { message: result?.error || "provider request failed", type: "provider_error" } },
    );
    return;
  }

  res.json({
    ...result!.json,
    unzip: {
      cache_status: "miss",
      selected_provider: used.provider,
      selected_model: used.model,
      requested_model: requestedModel,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      estimated_cost_usd: missCost,
      estimated_cost_saved_usd: totalSaved,
      embedding_cost_usd: embeddingCost,
      compression_status: compressionStatus,
      input_tokens_saved: inputTokensSaved,
      latency_ms: result!.latencyMs,
      routing_reason: attemptReason,
    },
  });
});

// --- helpers ---

function clampThreshold(raw: any): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0.92; // sensible default
  return Math.min(0.999, Math.max(0.5, n));
}

async function logCacheHit(
  auth: AuthedKey,
  route: string | null,
  requestedModel: string,
  c: any,
  cacheStatus: "hit" | "semantic_hit",
  reason: string,
  userRef: string | null,
  costUsd: number,
) {
  await query(
    `INSERT INTO request_logs
       (workspace_id, api_key_id, route, provider, model, requested_model,
        prompt_tokens, completion_tokens, total_tokens, estimated_cost_usd, estimated_saved_usd,
        latency_ms, cache_status, compression_status, routing_reason, status, status_code, user_ref)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0,$12,'off',$13,'success',200,$14)`,
    [
      auth.workspaceId,
      auth.apiKeyId,
      route,
      c.provider,
      c.model,
      requestedModel,
      c.prompt_tokens,
      c.completion_tokens,
      c.prompt_tokens + c.completion_tokens,
      costUsd,
      Math.max(0, Number(c.cost_usd) - costUsd),
      cacheStatus,
      reason,
      userRef,
    ],
  );
  await query(`UPDATE api_keys SET last_used_at = now() WHERE id = $1`, [auth.apiKeyId]);
}

function buildHitResponse(
  c: any,
  requestedModel: string,
  cacheStatus: "hit" | "semantic_hit",
  reason: string,
  costUsd: number,
  similarity?: number,
) {
  return {
    ...c.response_json,
    unzip: {
      cache_status: cacheStatus,
      selected_provider: c.provider,
      selected_model: c.model,
      requested_model: requestedModel,
      prompt_tokens: c.prompt_tokens,
      completion_tokens: c.completion_tokens,
      estimated_cost_usd: costUsd,
      estimated_cost_saved_usd: Math.max(0, Number(c.cost_usd) - costUsd),
      ...(similarity !== undefined ? { similarity: Number(similarity.toFixed(4)) } : {}),
      latency_ms: 0,
      routing_reason: reason,
    },
  };
}
