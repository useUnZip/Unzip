import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { authRouter } from "./routes/auth";
import { providersRouter } from "./routes/providers";
import { apiKeysRouter } from "./routes/apikeys";
import { analyticsRouter } from "./routes/analytics";
import { cacheRouter } from "./routes/cache";
import { gatewayRouter } from "./gateway/chat";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 5000;

async function main() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "10mb" }));
  app.use(cookieParser());

  // Health check
  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // CSRF guard for cookie-authenticated API: reject state-changing requests whose
  // Origin host does not match this server. The /v1 gateway is exempt (Bearer-token
  // auth, not cookies, so it is not CSRF-exposed).
  app.use("/api", (req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return next();
    const origin = req.headers.origin;
    if (origin) {
      let originHost: string;
      try {
        originHost = new URL(origin).host;
      } catch {
        res.status(403).json({ error: "invalid origin" });
        return;
      }
      if (originHost !== req.headers.host) {
        res.status(403).json({ error: "cross-origin request blocked" });
        return;
      }
    }
    next();
  });

  // OpenAI-compatible gateway
  app.use("/v1", gatewayRouter);

  // Dashboard API
  app.use("/api/auth", authRouter);
  app.use("/api/providers", providersRouter);
  app.use("/api/keys", apiKeysRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/cache", cacheRouter);

  const httpServer = createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      configFile: path.resolve(__dirname, "../vite.config.ts"),
      server: { middlewareMode: true, hmr: { server: httpServer } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const dist = path.resolve(__dirname, "../dist");
    app.use(express.static(dist));
    // SPA fallback: serve index.html for any non-API GET. Declared as plain
    // middleware to avoid Express 5 / path-to-regexp wildcard parsing.
    app.use((req, res, next) => {
      if (req.method !== "GET") return next();
      if (req.path.startsWith("/api") || req.path.startsWith("/v1")) return next();
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`UnZip server listening on http://0.0.0.0:${PORT} (${isProd ? "production" : "development"})`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
