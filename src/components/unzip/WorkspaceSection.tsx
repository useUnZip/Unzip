import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Activity, Database, GitBranch, Server } from "lucide-react";

export const WorkspaceSection = () => {
  return (
    <section id="workspace" className="relative py-32 sm:py-44 px-6 sm:px-12 overflow-hidden">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeader
          number="05"
          label="LIVE GATEWAY"
          title={
            <>
              One control plane.<br />
              <span className="font-display italic font-normal">Every model. Every request.</span>
            </>
          }
          description="A real-time view of the optimization pipeline — requests, cache hits, routing decisions, provider health, and exact dollars saved across every workload."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 -z-10" style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(225 22% 84% / 0.06), transparent 70%)"
          }} />

          <div className="glass-strong rounded-3xl p-3 sm:p-5">
            {/* Browser chrome */}
            <div className="flex items-center justify-between px-3 py-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              </div>
              <div className="mono-label">unzip.ai / gateway / live</div>
              <div className="mono-label hidden sm:block">● LIVE</div>
            </div>

            <div className="grid grid-cols-12 gap-3">
              {/* Sidebar */}
              <div className="col-span-12 md:col-span-2 surface-1 rounded-2xl p-4 flex md:flex-col gap-3 md:h-auto">
                {[
                  { i: Activity, l: "Requests" },
                  { i: Database, l: "Cache" },
                  { i: GitBranch, l: "Routes" },
                  { i: Server, l: "Providers" },
                ].map(({ i: Icon, l }, idx) => (
                  <div key={l} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] ${idx === 0 ? "bg-foreground/10 text-foreground" : "text-foreground/50"}`}>
                    <Icon className="h-3.5 w-3.5" />
                    <span>{l}</span>
                  </div>
                ))}
              </div>

              {/* Main pipeline */}
              <div className="col-span-12 md:col-span-6 surface-1 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="mono-label mb-1">/// ROUTING</div>
                    <div className="font-sans-display text-xl tracking-tight">Active Routes</div>
                  </div>
                  <div className="mono-label">07 LIVE</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["CACHE HIT", "ROUTED", "FALLBACK"].map((stage, si) => (
                    <div key={stage} className="space-y-2">
                      <div className="mono-label text-[9px] pb-1">{stage}</div>
                      {[1, 2, 3].slice(0, 3 - si).map((j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + si * 0.1 + j * 0.05, duration: 0.5 }}
                          className="rounded-lg border border-border/60 bg-background/40 p-2.5 hover:border-foreground/20 transition-colors"
                        >
                          <div className="text-[11px] text-foreground/85 font-medium truncate">
                            {["support_summary", "rag_answer", "code_review", "classify_intent", "draft_reply", "extract_json"][si * 3 + j - 1] || "route"}
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="mono-label text-[9px]">{["gpt-4o-mini","haiku","gpt-4.1","groq-l3","mini","local"][si * 3 + j - 1] || "auto"}</span>
                            <span className={`h-1.5 w-1.5 rounded-full ${j === 1 ? "bg-foreground/80" : "bg-foreground/30"}`} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div className="col-span-12 md:col-span-4 flex flex-col gap-3">
                <div className="surface-1 rounded-2xl p-5">
                  <div className="mono-label mb-3">/// REQUESTS — 24H</div>
                  <div className="flex items-end gap-1 h-20">
                    {[40, 65, 35, 80, 55, 90, 70, 60, 85, 50, 75, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.04, duration: 0.6 }}
                        className="flex-1 bg-foreground/70 rounded-sm"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 text-[11px] text-foreground/60">
                    <span>184,210 calls</span>
                    <span className="text-foreground">41% cache hit</span>
                  </div>
                </div>

                <div className="surface-1 rounded-2xl p-5">
                  <div className="mono-label mb-3">/// LATEST TRACES</div>
                  {["support_summary — gpt-4o-mini", "rag_answer — semantic hit", "classify_intent — haiku"].map((t, i) => (
                    <div key={t} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <span className="text-[12px] text-foreground/80 truncate">{t}</span>
                      <span className="mono-label text-[9px]">{["MISS", "HIT", "ROUTE"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {[
                { l: "SPEND SAVED — MO", v: "$24,800" },
                { l: "CACHE HIT RATE", v: "41.2%" },
                { l: "P95 GW OVERHEAD", v: "92ms" },
                { l: "TOKENS COMPRESSED", v: "146.5M" },
              ].map((k) => (
                <div key={k.l} className="surface-1 rounded-2xl p-4">
                  <div className="mono-label mb-1">{k.l}</div>
                  <div className="font-sans-display text-2xl tracking-tight text-foreground">{k.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
