import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const negations = [
  { tag: "01", text: "Not just observability." },
  { tag: "02", text: "Not just a cache." },
  { tag: "03", text: "Not just a model router." },
];

const pillars = [
  { k: "CACHE", v: "Exact and semantic caching. Reuse equivalent answers safely, with similarity thresholds you control." },
  { k: "ROUTE", v: "Pick the cheapest model that meets the route's quality, latency, and cost budget — automatically." },
  { k: "COMPRESS", v: "Dedupe system prompts, trim history, summarize retrieved context. Shrink tokens before they ship." },
  { k: "PROFILE", v: "Spend by route, model, customer, and feature. Every saving is measured against the unoptimized baseline." },
];

export const DefinitionSection = () => {
  return (
    <section id="definition" className="relative py-32 sm:py-44 px-6 sm:px-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-[1480px]">
        <SectionHeader
          number="03"
          label="DEFINITION"
          title={
            <>
              UnZip is a <span className="font-display italic font-normal">compute compression layer</span> for AI applications.
            </>
          }
        />

        <div className="grid grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-5 flex flex-col gap-4"
          >
            {negations.map((n, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass rounded-2xl px-6 py-5 flex items-center gap-5"
              >
                <span className="mono-label text-foreground/40">{n.tag}</span>
                <span className="font-sans-display text-2xl sm:text-3xl tracking-[-0.025em] text-foreground/85">
                  {n.text}
                </span>
              </motion.div>
            ))}
            <div className="glass-strong rounded-2xl px-6 py-5 flex items-center gap-5 mt-2">
              <span className="mono-label text-foreground">→</span>
              <span className="font-sans-display text-2xl sm:text-3xl tracking-[-0.025em] text-foreground">
                A unified optimization layer.
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 lg:col-span-7 lg:pl-12"
          >
            <p className="font-sans-display text-2xl sm:text-3xl leading-[1.15] tracking-[-0.02em] text-foreground/85 mb-12">
              Replace your LLM base URL with UnZip and <span className="text-foreground">cache, route, compress, and fall back</span> across providers — without rewriting your product.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.k}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
                  className="surface-1 border border-border/60 rounded-2xl p-5 hover:border-border transition-colors"
                >
                  <div className="mono-label mb-3 text-foreground">/// {p.k}</div>
                  <div className="text-[14px] leading-relaxed text-foreground/65">{p.v}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
