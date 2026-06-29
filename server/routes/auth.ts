import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db";
import { randomToken } from "../lib/apikey";
import { getSessionUser } from "../middleware/auth";

export const authRouter = Router();

const SESSION_DAYS = 30;
const isProd = process.env.NODE_ENV === "production";

function setSessionCookie(res: any, token: string) {
  res.cookie("unzip_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

async function createSession(userId: string): Promise<string> {
  const token = randomToken(32);
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await query(`INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)`, [
    token,
    userId,
    expires.toISOString(),
  ]);
  return token;
}

authRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  if (String(password).length < 8) {
    res.status(400).json({ error: "password must be at least 8 characters" });
    return;
  }
  const existing = await query(`SELECT id FROM users WHERE email = $1`, [String(email).toLowerCase()]);
  if (existing.rows[0]) {
    res.status(409).json({ error: "an account with this email already exists" });
    return;
  }
  const wsName = name ? `${name}'s workspace` : "My workspace";
  const ws = await query(`INSERT INTO workspaces (name) VALUES ($1) RETURNING id`, [wsName]);
  const workspaceId = ws.rows[0].id;
  const hash = await bcrypt.hash(String(password), 10);
  const user = await query(
    `INSERT INTO users (workspace_id, email, password_hash, name) VALUES ($1, $2, $3, $4) RETURNING id`,
    [workspaceId, String(email).toLowerCase(), hash, name || null],
  );
  const token = await createSession(user.rows[0].id);
  setSessionCookie(res, token);
  res.json({
    id: user.rows[0].id,
    workspaceId,
    email: String(email).toLowerCase(),
    name: name || null,
  });
});

authRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  const { rows } = await query(
    `SELECT id, workspace_id, password_hash, name, email FROM users WHERE email = $1`,
    [String(email).toLowerCase()],
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(String(password), user.password_hash))) {
    res.status(401).json({ error: "invalid email or password" });
    return;
  }
  const token = await createSession(user.id);
  setSessionCookie(res, token);
  res.json({ id: user.id, workspaceId: user.workspace_id, email: user.email, name: user.name });
});

authRouter.post("/signout", async (req, res) => {
  const token = req.cookies?.unzip_session;
  if (token) await query(`DELETE FROM sessions WHERE token = $1`, [token]);
  res.clearCookie("unzip_session", { path: "/" });
  res.json({ ok: true });
});

authRouter.get("/me", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  res.json(user);
});
