import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const cards = [
  { tag: "GATEWAY", title: "Drop-in LLM Gateway", desc: "OpenAI-compatible endpoint. Change your base URL, keep your SDK. Streaming, embeddings, and tool calls supported.", lines: ["OPENAI API", "STREAMING", "<100ms OH"] },
  { tag: "CACHE", title: "Semantic Cache", desc: "Exact + embedding-based lookup with per-route thresholds, scoped invalidation, and bypass rules for sensitive calls.", lines: ["HIT 41%", "SIM 0.94", "PGVECTOR"] },
  { tag: "ROUTER", title: "Model Router", desc: "Pick the cheapest model that meets the route's quality, latency, and cost budget — with explainable routing reasons.", lines: ["AUTO", "MAX $0.01", "RULE+ML"] },
  { tag: "COMPRESS", title: "Prompt Compression", desc: "Dedupe system prompts, summarize history, prune retrieved context. Token before/after on every request.", lines: ["−52% TOK", "SAFE MODE", "PER ROUTE"] },
  { tag: "FALLBACK", title: "Provider Fallback", desc: "Health-aware retries across OpenAI, Anthropic, Groq, Together, and local Ollama / vLLM endpoints.", lines: ["5 PROVIDERS", "P95 SLA", "AUTO"] },
  { tag: "PROFILER", title: "Cost Profiler", desc: "Spend by route, model, user, and feature. Cache savings and latency saved attributed to every request.", lines: ["SAVED $4.2K", "PER USER", "EXPORT"] },
  { tag: "QUALITY", title: "Quality Guardrails", desc: "Schema and length validation, optional judge model on high-risk routes, A/B replay of optimized vs raw calls.", lines: ["EVAL ON", "JUDGE 4o", "A/B LOG"] },
  { tag: "PRIVACY", title: "Privacy Controls", desc: "PII redaction, per-request cache bypass, metadata-only logging, and zero-retention mode for self-hosted.", lines: ["REDACT", "BYPASS", "ZERO-RET"] },
];

export const InsideSection = () => {
  const [active, setActive] = useState(0);
  const total = cards.length;

  const next = () => setActive((a) => (a + 1) % total);
  const prev = () => setActive((a) => (a - 1 + total) % total);

  return (
    <section id="inside" className="relative py-32 sm:py-44 px-6 sm:px-12 overflow-hidden">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeader
          number="04"
          label="WHAT'S INSIDE"
          title={
            <>
              Eight modules.<br />
              <span className="font-display italic font-normal">One optimization pipeline.</span>
            </>
          }
          description="Every request flows through the same composable chain — normalize, cache, compress, route, call, validate, account. No module demos well in isolation; together they remove the waste."
        />

        {/* Carousel stage */}
        <div
          className="relative h-[520px] sm:h-[560px] mb-10"
          style={{ perspective: "1600px" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {cards.map((c, i) => {
              let offset = i - active;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;
              const abs = Math.abs(offset);
              const isActive = offset === 0;
              return (
                <motion.button
                  key={c.title}
                  onClick={() => setActive(i)}
                  animate={{
                    x: offset * 220,
                    rotateY: offset * -18,
                    scale: isActive ? 1 : 0.85 - abs * 0.04,
                    opacity: abs > 3 ? 0 : 1 - abs * 0.18,
                    zIndex: 10 - abs,
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute w-[300px] sm:w-[380px] h-[460px] sm:h-[500px] rounded-3xl text-left"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className={`relative h-full w-full rounded-3xl overflow-hidden border transition-colors ${isActive ? "border-foreground/20" : "border-border/40"} surface-1`}
                    style={{ boxShadow: isActive ? "var(--shadow-spotlight)" : "var(--shadow-card)" }}
                  >
                    <div className="absolute inset-0 grid-bg opacity-40" />
                    <div className="absolute inset-0" style={{
                      background: "radial-gradient(ellipse at 50% 0%, hsl(0 0% 100% / 0.06), transparent 70%)"
                    }} />

                    <div className="relative h-full p-7 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="mono-label">/// {String(i + 1).padStart(2, "0")} — {c.tag}</span>
                        <span className="h-2 w-2 rounded-full bg-foreground/70 animate-pulse" />
                      </div>

                      <div className="mt-auto">
                        <h3 className="font-sans-display text-3xl sm:text-4xl tracking-[-0.03em] text-foreground leading-[1] mb-4">
                          {c.title}
                        </h3>
                        <p className="text-[14px] leading-relaxed text-foreground/65 mb-6">
                          {c.desc}
                        </p>

                        <div className="hairline mb-4" />
                        <div className="grid grid-cols-3 gap-2">
                          {c.lines.map((l) => (
                            <div key={l} className="glass rounded-md px-2 py-1.5 text-center">
                              <span className="mono-label text-[9px]">{l}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-6">
          <div className="mono-label">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} — {cards[active].tag}
          </div>
          <div className="flex-1 h-px bg-border/60 relative overflow-hidden mx-6">
            <motion.div
              animate={{ width: `${((active + 1) / total) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="absolute left-0 top-0 h-full bg-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prev} aria-label="Previous" className="glass h-11 w-11 rounded-full inline-flex items-center justify-center hover:scale-105 transition-transform">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={next} aria-label="Next" className="glass-strong h-11 w-11 rounded-full inline-flex items-center justify-center hover:scale-105 transition-transform">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
