import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const audiences = [
  {
    tag: "01",
    title: "AI SaaS Founder",
    body: "Your gross margin is set by inference, not subscription price. Route through UnZip and reclaim 30–70% of compute cost without slowing product velocity.",
    stats: ["Margin recovery", "Pricing flexibility", "No app rewrite"],
  },
  {
    tag: "02",
    title: "AI / Backend Engineer",
    body: "Stop hand-rolling caches, retries, fallbacks, and telemetry inside the app. One proxy, one SDK, full traces, override controls when you need them.",
    stats: ["Drop-in proxy", "OpenAI-compatible", "Transparent logs"],
  },
  {
    tag: "03",
    title: "Product & Finance Lead",
    body: "See AI cost per user, per feature, per customer, per route. Anomaly detection on runaway spend before it shows up on the invoice.",
    stats: ["Cost attribution", "Per-route budgets", "Exportable metrics"],
  },
  {
    tag: "04",
    title: "Enterprise & Agency",
    body: "Self-hostable gateway with PII redaction, zero-retention mode, and provider-neutral routing across cloud and local models. Compliance-friendly by default.",
    stats: ["Self-hosted", "Multi-provider", "Privacy-first"],
  },
];

export const AudienceSection = () => {
  return (
    <section id="audience" className="relative py-32 sm:py-44 px-6 sm:px-12 overflow-hidden">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeader
          number="06"
          label="WHO IT'S FOR"
          title={
            <>
              Built for teams shipping <span className="font-display italic font-normal">real AI workloads</span> in production.
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
              className="spotlight group relative rounded-3xl border border-border/60 surface-1 p-8 sm:p-10 transition-all hover:border-foreground/20 hover:-translate-y-1 duration-500"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="mono-label">/// {a.tag}</span>
                <span className="mono-label text-foreground/40">PROFILE</span>
              </div>
              <h3 className="font-sans-display text-5xl sm:text-6xl tracking-[-0.035em] mb-6 text-foreground">
                {a.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-foreground/65 max-w-md mb-8">
                {a.body}
              </p>
              <div className="hairline mb-5" />
              <div className="flex flex-wrap gap-2">
                {a.stats.map((s) => (
                  <span key={s} className="glass rounded-full px-3 py-1.5 text-[11px] text-foreground/80">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
