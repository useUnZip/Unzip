import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const problems = [
  {
    title: "Identical prompts are recomputed from zero, every time.",
    body: "Most AI apps serve the same questions over and over and pay frontier-model prices on every call. Without semantic cache, the bill scales with traffic — not with novelty.",
  },
  {
    title: "Simple tasks are routed to expensive frontier models.",
    body: "Classification, extraction, summarization — workloads a small model handles in milliseconds — get sent to GPT-class endpoints by default. The margin leaks through the model picker.",
  },
  {
    title: "Prompts and context windows are bloated.",
    body: "System instructions repeat, prior turns pile up, retrieved documents are dumped in raw. Token counts (and latency) inflate long before the actual reasoning starts.",
  },
  {
    title: "Provider choice is static, not adaptive.",
    body: "Apps lock to one vendor at integration time and never re-evaluate. When pricing, latency, or availability shifts across OpenAI, Anthropic, Groq, or local models — nothing routes.",
  },
  {
    title: "Retries and fallbacks are brittle and inefficient.",
    body: "When a provider fails or stalls, teams ship hand-rolled retry loops that re-pay token cost, miss SLAs, and never report what actually happened.",
  },
  {
    title: "Nobody can see cost per user, feature, or workflow.",
    body: "Finance sees one invoice. Engineering sees one dashboard. Product sees nothing. Compute waste hides in aggregate numbers until margin disappears.",
  },
];

export const ProblemSection = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="problem" className="relative py-32 sm:py-44 px-6 sm:px-12">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeader
          number="02"
          label="THE PROBLEM"
          title={
            <>
              AI compute is cheap to start.<br />
              <span className="font-display italic font-normal text-foreground/80">Expensive to scale.</span>
            </>
          }
          description="AI products don't fail at the demo. They fail at the unit economics. Every chat, agent loop, summarization, and retrieval burns tokens — most of them unnecessarily."
        />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 self-start">
            <div className="glass rounded-2xl p-6">
              <div className="mono-label mb-4">/// PROBLEM INDEX</div>
              <div className="font-display italic text-2xl leading-tight text-foreground/90">
                "The next winner in AI infra won't add more compute. It will remove wasted compute."
              </div>
              <div className="hairline my-6" />
              <div className="mono-label">06 SYMPTOMS — TAP TO EXPAND</div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 flex flex-col">
            {problems.map((p, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="border-b border-border/50"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start gap-6 py-6 text-left group"
                  >
                    <span className="mono-label pt-1.5 text-foreground/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`flex-1 font-sans-display text-xl sm:text-3xl tracking-[-0.025em] transition-colors ${isOpen ? "text-foreground" : "text-foreground/60 group-hover:text-foreground/90"}`}>
                      {p.title}
                    </span>
                    <span className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full border transition-all ${isOpen ? "bg-foreground text-background border-foreground" : "border-border text-foreground/60 group-hover:border-foreground/40"}`}>
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pl-12 pr-12 pb-8 max-w-2xl text-[15px] leading-relaxed text-foreground/65">
                          {p.body}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
