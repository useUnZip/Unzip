import { Router } from "express";
import { query } from "../db";
import { requireAuth } from "../middleware/auth";
import { generateApiKey } from "../lib/apikey";

export const apiKeysRouter = Router();

apiKeysRouter.use(requireAuth);

apiKeysRouter.get("/", async (req, res) => {
  const { rows } = await query(
    `SELECT id, name, prefix, scopes, created_at, last_used_at, revoked_at
       FROM api_keys WHERE workspace_id = $1 ORDER BY created_at DESC`,
    [req.user!.workspaceId],
  );
  res.json(rows);
});

apiKeysRouter.post("/", async (req, res) => {
  const name = (req.body?.name && String(req.body.name).trim()) || "default";
  const { key, hash, prefix } = generateApiKey();
  const { rows } = await query(
    `INSERT INTO api_keys (workspace_id, key_hash, prefix, name) VALUES ($1, $2, $3, $4) RETURNING id, name, prefix, created_at`,
    [req.user!.workspaceId, hash, prefix, name],
  );
  // The full key is returned exactly once and never stored in plaintext.
  res.json({ ...rows[0], key });
});

apiKeysRouter.post("/:id/revoke", async (req, res) => {
  await query(`UPDATE api_keys SET revoked_at = now() WHERE id = $1 AND workspace_id = $2`, [
    String(req.params.id),
    req.user!.workspaceId,
  ]);
  res.json({ ok: true });
});
