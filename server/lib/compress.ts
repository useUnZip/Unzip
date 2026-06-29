// Deterministic, meaning-preserving prompt compression. We deliberately apply
// only transforms that never change the actual content the model reads:
//   - normalize CRLF -> LF line endings
//   - strip trailing whitespace at the end of each line
//   - collapse 3+ consecutive newlines down to one blank line
// We do NOT collapse internal runs of spaces/tabs or trim leading indentation,
// because those are significant in code and whitespace-sensitive prompts. This
// is opt-in via metadata.compress so prompts are never altered unless asked.

export interface CompressionResult {
  messages: any[];
  applied: boolean;
}

function compressString(s: string): string {
  return s
    .replace(/\r\n/g, "\n") // normalize line endings
    .replace(/[ \t]+\n/g, "\n") // strip trailing spaces/tabs at end of each line
    .replace(/\n{3,}/g, "\n\n"); // collapse 3+ consecutive newlines to one blank line
}

export function compressMessages(messages: any[]): CompressionResult {
  if (!Array.isArray(messages)) return { messages, applied: false };
  let applied = false;
  const out = messages.map((m) => {
    if (typeof m?.content === "string") {
      const c = compressString(m.content);
      if (c !== m.content) applied = true;
      return { ...m, content: c };
    }
    if (Array.isArray(m?.content)) {
      const parts = m.content.map((p: any) => {
        if (p && typeof p.text === "string") {
          const t = compressString(p.text);
          if (t !== p.text) applied = true;
          return { ...p, text: t };
        }
        return p;
      });
      return { ...m, content: parts };
    }
    return m;
  });
  return { messages: out, applied };
}
