export interface ProviderCallResult {
  ok: boolean;
  status: number;
  json: any;
  latencyMs: number;
  error?: string;
}

const DEFAULT_BASE_URL = "https://api.openai.com/v1";

// OpenAI-compatible chat completion call. Works for OpenAI and any
// OpenAI-compatible endpoint (Groq, Together, local) via baseUrl.
export async function openaiChatCompletion(
  apiKey: string,
  body: Record<string, any>,
  baseUrl: string = DEFAULT_BASE_URL,
): Promise<ProviderCallResult> {
  const start = Date.now();
  try {
    const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const latencyMs = Date.now() - start;
    let json: any = null;
    try {
      json = await resp.json();
    } catch {
      json = null;
    }
    return { ok: resp.ok, status: resp.status, json, latencyMs };
  } catch (err: any) {
    return {
      ok: false,
      status: 502,
      json: null,
      latencyMs: Date.now() - start,
      error: err?.message || "provider request failed",
    };
  }
}

// Lightweight health probe (used by Providers page later).
export async function openaiHealth(apiKey: string, baseUrl: string = DEFAULT_BASE_URL): Promise<ProviderCallResult> {
  const start = Date.now();
  try {
    const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return { ok: resp.ok, status: resp.status, json: null, latencyMs: Date.now() - start };
  } catch (err: any) {
    return { ok: false, status: 502, json: null, latencyMs: Date.now() - start, error: err?.message };
  }
}
