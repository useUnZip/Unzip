import { Router } from "express";
import { query } from "../db";
import { requireAuth } from "../middleware/auth";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

const RANGE_DAYS: Record<string, number> = { "24h": 1, "7d": 7, "30d": 30, "90d": 90 };

analyticsRouter.get("/overview", async (req, res) => {
  const ws = req.user!.workspaceId;
  const range = String(req.query.range || "7d");
  const days = RANGE_DAYS[range] ?? 7;

  const totals = await query(
    `SELECT
        COUNT(*)::int AS requests,
        COALESCE(SUM(estimated_cost_usd), 0) AS spend,
        COALESCE(SUM(estimated_saved_usd), 0) AS saved,
        COALESCE(SUM(prompt_tokens + completion_tokens), 0)::bigint AS tokens,
        COALESCE(AVG(latency_ms), 0) AS avg_latency,
        COALESCE(SUM(CASE WHEN cache_status IN ('hit','semantic_hit') THEN 1 ELSE 0 END), 0)::int AS cache_hits,
        COALESCE(SUM(CASE WHEN cache_status = 'hit' THEN 1 ELSE 0 END), 0)::int AS exact_hits,
        COALESCE(SUM(CASE WHEN cache_status = 'semantic_hit' THEN 1 ELSE 0 END), 0)::int AS semantic_hits,
        COALESCE(SUM(CASE WHEN compression_status = 'on' THEN 1 ELSE 0 END), 0)::int AS compressed,
        COALESCE(SUM(CASE WHEN status <> 'success' THEN 1 ELSE 0 END), 0)::int AS errors
       FROM request_logs
      WHERE workspace_id = $1 AND created_at > now() - ($2 || ' days')::interval`,
    [ws, String(days)],
  );

  const byModel = await query(
    `SELECT COALESCE(model, 'unknown') AS model, COUNT(*)::int AS requests,
            COALESCE(SUM(estimated_cost_usd), 0) AS spend
       FROM request_logs
      WHERE workspace_id = $1 AND created_at > now() - ($2 || ' days')::interval
      GROUP BY model ORDER BY spend DESC LIMIT 8`,
    [ws, String(days)],
  );

  const daily = await query(
    `SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
            COUNT(*)::int AS requests,
            COALESCE(SUM(estimated_cost_usd), 0) AS spend,
            COALESCE(SUM(estimated_saved_usd), 0) AS saved
       FROM request_logs
      WHERE workspace_id = $1 AND created_at > now() - ($2 || ' days')::interval
      GROUP BY 1 ORDER BY 1`,
    [ws, String(days)],
  );

  const t = totals.rows[0];
  const requests = t.requests || 0;
  const hitRate = requests > 0 ? (t.cache_hits / requests) * 100 : 0;

  res.json({
    range,
    requests,
    spendUsd: Number(t.spend),
    savedUsd: Number(t.saved),
    tokens: Number(t.tokens),
    avgLatencyMs: Math.round(Number(t.avg_latency)),
    cacheHitRate: Math.round(hitRate * 10) / 10,
    exactHits: t.exact_hits || 0,
    semanticHits: t.semantic_hits || 0,
    compressedRequests: t.compressed || 0,
    errors: t.errors || 0,
    byModel: byModel.rows.map((r) => ({ model: r.model, requests: r.requests, spendUsd: Number(r.spend) })),
    daily: daily.rows.map((r) => ({
      day: r.day,
      requests: r.requests,
      spendUsd: Number(r.spend),
      savedUsd: Number(r.saved),
    })),
  });
});

analyticsRouter.get("/requests", async (req, res) => {
  const ws = req.user!.workspaceId;
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const { rows } = await query(
    `SELECT id, route, provider, model, requested_model, prompt_tokens, completion_tokens,
            estimated_cost_usd, estimated_saved_usd, latency_ms, cache_status, compression_status,
            routing_reason, status, status_code, user_ref, created_at
       FROM request_logs
      WHERE workspace_id = $1
      ORDER BY created_at DESC LIMIT $2`,
    [ws, limit],
  );
  res.json(
    rows.map((r) => ({
      id: r.id,
      route: r.route,
      provider: r.provider,
      model: r.model,
      requestedModel: r.requested_model,
      promptTokens: r.prompt_tokens,
      completionTokens: r.completion_tokens,
      costUsd: Number(r.estimated_cost_usd),
      savedUsd: Number(r.estimated_saved_usd),
      latencyMs: r.latency_ms,
      cacheStatus: r.cache_status,
      compressionStatus: r.compression_status,
      routingReason: r.routing_reason,
      status: r.status,
      statusCode: r.status_code,
      userRef: r.user_ref,
      createdAt: r.created_at,
    })),
  );
});
