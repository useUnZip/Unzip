import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const steps = [
  { n: "01", t: "Swap your base URL", d: "Point your OpenAI-compatible SDK at api.unzip.ai (or your self-hosted gateway). Keep your existing keys, code, and streaming behavior." },
  { n: "02", t: "Define routes", d: "Tag requests with a route name. Set max cost, latency target, quality tier, and cache policy per route — in YAML or the dashboard." },
  { n: "03", t: "Enable semantic cache", d: "Embeddings + pgvector lookup with similarity thresholds. Exact cache in Redis. Bypass rules for sensitive or dynamic calls." },
  { n: "04", t: "Add provider fallback", d: "Connect OpenAI, Anthropic, Groq, Together, or local Ollama / vLLM. Health-aware retries kick in on errors, timeouts, or budget breach." },
  { n: "05", t: "Compress prompts and context", d: "Dedupe system instructions, summarize history, prune retrieved docs. Conservative by default, configurable per route." },
  { n: "06", t: "Watch the savings", d: "Every response returns tokens saved, latency saved, and dollars saved. Spend attributed by route, model, user, and feature." },
];

export const HowItWorks = () => {
  return (
    <section id="how" className="relative py-32 sm:py-44 px-6 sm:px-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-[1480px]">
        <SectionHeader
          number="07"
          label="HOW IT WORKS"
          title={
            <>
              Six steps from <span className="font-display italic font-normal">base URL swap</span> to measurable savings.
            </>
          }
        />

        <div className="grid grid-cols-12 gap-x-6 gap-y-0">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="col-span-12 md:col-span-6 lg:col-span-4 group"
            >
              <div className="relative h-full p-8 border-t border-border/60 hover:border-foreground/30 transition-colors">
                <div className="flex items-baseline justify-between mb-12">
                  <span className="font-sans-display text-5xl tracking-[-0.04em] text-foreground/30 group-hover:text-foreground/80 transition-colors">
                    {s.n}
                  </span>
                  <span className="mono-label">STEP</span>
                </div>
                <h3 className="font-sans-display text-2xl sm:text-3xl tracking-[-0.025em] text-foreground mb-4 leading-tight">
                  {s.t}
                </h3>
                <p className="text-[14px] leading-relaxed text-foreground/60 max-w-sm">
                  {s.d}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
