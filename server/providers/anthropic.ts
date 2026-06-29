import type { ProviderCallResult } from "./openai";

const DEFAULT_BASE_URL = "https://api.anthropic.com/v1";

function contentToText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((p: any) => (p && typeof p.text === "string" ? p.text : ""))
      .join("");
  }
  return "";
}

function mapStopReason(reason: string | null | undefined): string {
  switch (reason) {
    case "max_tokens":
      return "length";
    case "tool_use":
      return "tool_calls";
    case "end_turn":
    case "stop_sequence":
    default:
      return "stop";
  }
}

// Translate an Anthropic Messages response into an OpenAI chat.completion shape,
// so the gateway stays OpenAI-compatible regardless of the upstream provider.
function toOpenAIResponse(a: any): any {
  const text = (a.content || [])
    .filter((c: any) => c.type === "text")
    .map((c: any) => c.text)
    .join("");
  const promptTokens = a.usage?.input_tokens || 0;
  const completionTokens = a.usage?.output_tokens || 0;
  return {
    id: a.id,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: a.model,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: text },
        finish_reason: mapStopReason(a.stop_reason),
      },
    ],
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
    },
  };
}

// Accepts an OpenAI-style request body and calls Anthropic's /messages API.
export async function anthropicChatCompletion(
  apiKey: string,
  body: Record<string, any>,
  baseUrl: string = DEFAULT_BASE_URL,
): Promise<ProviderCallResult> {
  const start = Date.now();

  const messages: Array<{ role: string; content: string }> = [];
  let system = "";
  for (const m of body.messages || []) {
    if (m.role === "system") {
      system += (system ? "\n" : "") + contentToText(m.content);
      continue;
    }
    messages.push({
      role: m.role === "assistant" ? "assistant" : "user",
      content: contentToText(m.content),
    });
  }

  const req: Record<string, any> = {
    model: body.model,
    max_tokens: body.max_tokens ?? 1024,
    messages,
  };
  if (system) req.system = system;
  if (body.temperature !== undefined) req.temperature = body.temperature;
  if (body.top_p !== undefined) req.top_p = body.top_p;
  if (body.stop) req.stop_sequences = Array.isArray(body.stop) ? body.stop : [body.stop];

  try {
    const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(req),
    });
    const latencyMs = Date.now() - start;
    let json: any = null;
    try {
      json = await resp.json();
    } catch {
      json = null;
    }
    if (!resp.ok) {
      return {
        ok: false,
        status: resp.status,
        json: {
          error: {
            message: json?.error?.message || "anthropic request failed",
            type: json?.error?.type || "provider_error",
          },
        },
        latencyMs,
        error: json?.error?.message,
      };
    }
    return { ok: true, status: resp.status, json: toOpenAIResponse(json), latencyMs };
  } catch (err: any) {
    return {
      ok: false,
      status: 502,
      json: null,
      latencyMs: Date.now() - start,
      error: err?.message || "anthropic request failed",
    };
  }
}

export async function anthropicHealth(
  apiKey: string,
  baseUrl: string = DEFAULT_BASE_URL,
): Promise<ProviderCallResult> {
  const start = Date.now();
  try {
    // Minimal 1-token message is the cheapest reliable Anthropic health probe.
    const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 1,
        messages: [{ role: "user", content: "ping" }],
      }),
    });
    return { ok: resp.ok, status: resp.status, json: null, latencyMs: Date.now() - start };
  } catch (err: any) {
    return { ok: false, status: 502, json: null, latencyMs: Date.now() - start, error: err?.message };
  }
}
