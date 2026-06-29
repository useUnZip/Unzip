# UnZip

**An OpenAI-compatible gateway that cuts your LLM bill.** Point your existing OpenAI/Anthropic client at UnZip's base URL, keep your code the same, and let the gateway save money automatically through caching, smart routing, prompt compression, and provider fallback.

> Wedge: change one line — your base URL — and start saving.

---

## How it works

```
Your app  ──►  UnZip gateway (/v1/chat/completions)  ──►  OpenAI / Anthropic / Groq / Local
                      │
                      ├─ Exact cache (same prompt → instant, $0)
                      ├─ Semantic cache (similar prompt → pgvector match)
                      ├─ Prompt compression (safe, opt-in)
                      ├─ Routing + provider fallback
                      └─ Cost & savings logging
```

Every request is logged with its cost, what it would have cost, the cache outcome (exact / semantic / miss), and the routing reason — all visible in the dashboard.

---

## Features

- **OpenAI-compatible API** — drop-in `/v1/chat/completions`. Send your normal OpenAI request body; pick the upstream with the `model` field or a `metadata.provider` override.
- **Exact + semantic cache** — identical prompts return instantly for free; similar prompts are matched with pgvector cosine similarity. Cache is scoped per workspace and can be bypassed per request.
- **Prompt compression (Lite)** — opt-in, safe-only trimming to reduce input tokens without changing meaning.
- **Routing & provider fallback** — if the primary provider fails, the request falls back to a configured alternative.
- **Cost profiler** — spend, savings, cache-hit rate, and token usage per request and in aggregate.
- **Admin dashboard** — Overview, Requests, Providers, API Keys, Settings.
- **Docs & Whitepaper** pages explaining the API and the design.

---

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, framer-motion, React Router, TanStack Query |
| Backend  | Express 5 (run with tsx), Node.js |
| Database | PostgreSQL + pgvector (semantic cache) |
| Auth     | Session cookies (bcrypt-hashed passwords) |

---

## Project structure

```
server/
  index.ts            Express app + route registration
  db.ts               Postgres pool
  gateway/
    chat.ts           /v1/chat/completions handler
    router.ts         provider routing + fallback
  providers/
    openai.ts         OpenAI adapter
    anthropic.ts      Anthropic adapter
  routes/             auth, providers, apikeys, analytics, cache APIs
  lib/                apikey, cache, compress, crypto, embeddings, pricing, tokens
  middleware/auth.ts  API-key + session auth

src/
  pages/              Index, Docs, Whitepaper, SignIn, Onboarding
  pages/app/          Overview, Requests, Providers, ApiKeys, Settings
  components/         UI + UnZip-specific components
  lib/                client helpers (clipboard, api, etc.)
```

---

## Getting started (development)

The app runs via the **Start application** workflow (`npm run dev`), which serves both the API and the Vite frontend on one port.

```bash
npm install
npm run dev
```

### Environment variables

| Variable             | Purpose |
|----------------------|---------|
| `DATABASE_URL`       | PostgreSQL connection string. |
| `APP_ENCRYPTION_KEY` | Key used to encrypt stored provider credentials. |
| `PORT`               | Port the server listens on (defaults to the platform port). |
| `NODE_ENV`           | `development` or `production`. |

Provider API keys (OpenAI, Anthropic, etc.) are **not** set as environment variables — you add them in the dashboard under **Providers**, where they are stored encrypted.

---

## Using the gateway

1. Sign up and create a workspace.
2. Add at least one provider credential under **Providers**.
3. Create an API key under **API Keys** (format: `unzip_...`).
4. Point any OpenAI-compatible client at the gateway:

```bash
curl https://YOUR-APP-URL/v1/chat/completions \
  -H "Authorization: Bearer unzip_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

Optional `metadata` fields on the request body:

- `metadata.provider` — force a specific upstream provider.
- `metadata.user_id` — tag the request to a user for cost attribution.

The response includes how many input tokens were saved by compression/caching.

---

## Deployment

Build the frontend with `npm run build` and run the server with `npm start`. Ensure the production database has the `pgvector` extension enabled, since the semantic cache relies on it.

---

## Status

Core gateway is live: OpenAI-compatible API, exact + semantic caching, prompt compression, routing with fallback, cost logging, and the admin dashboard. Planned next: rule-based routing policies, a cache-browsing screen, deeper cost breakdowns, a public `/v1/embeddings` endpoint, and streaming responses.
