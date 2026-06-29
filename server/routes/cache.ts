import { Router } from "express";
import { query } from "../db";
import { requireAuth } from "../middleware/auth";

export const cacheRouter = Router();

cacheRouter.use(requireAuth);

cacheRouter.get("/stats", async (req, res) => {
  const ws = req.user!.workspaceId;
  const { rows } = await query(
    `SELECT
        COUNT(*)::int AS entries,
        COALESCE(SUM(hit_count), 0)::int AS total_hits,
        COALESCE(SUM(hit_count * cost_usd), 0) AS total_saved_usd,
        MAX(last_hit_at) AS last_hit_at
       FROM cache_entries WHERE workspace_id = $1`,
    [ws],
  );
  const r = rows[0];
  res.json({
    entries: r.entries,
    totalHits: r.total_hits,
    totalSavedUsd: Number(r.total_saved_usd),
    lastHitAt: r.last_hit_at,
  });
});

cacheRouter.delete("/", async (req, res) => {
  const ws = req.user!.workspaceId;
  const { rows } = await query(
    `WITH deleted AS (DELETE FROM cache_entries WHERE workspace_id = $1 RETURNING 1)
       SELECT COUNT(*)::int AS cleared FROM deleted`,
    [ws],
  );
  res.json({ cleared: rows[0].cleared });
});
