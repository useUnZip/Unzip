import type { Request, Response, NextFunction } from "express";
import { query } from "../db";

export interface SessionUser {
  id: string;
  workspaceId: string;
  email: string;
  name: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export async function getSessionUser(req: Request): Promise<SessionUser | null> {
  const token = req.cookies?.unzip_session;
  if (!token) return null;
  const { rows } = await query(
    `SELECT u.id, u.workspace_id, u.email, u.name
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token = $1 AND s.expires_at > now()`,
    [token],
  );
  if (!rows[0]) return null;
  return {
    id: rows[0].id,
    workspaceId: rows[0].workspace_id,
    email: rows[0].email,
    name: rows[0].name,
  };
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  req.user = user;
  next();
}
