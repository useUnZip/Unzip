import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden noise"
    >
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 110%, hsl(225 22% 84% / 0.08), transparent 60%), radial-gradient(ellipse 50% 30% at 0% 0%, hsl(225 15% 22% / 0.4), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[1480px] px-6 sm:px-12 pt-32 sm:pt-40 pb-12 min-h-screen flex flex-col">
        {/* Top mono row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mono-label flex items-center justify-between mb-12 sm:mb-20"
        >
          <span>/// 01 — INDEX</span>
          <span className="hidden sm:inline">OPENAI · ANTHROPIC · GROQ · LOCAL</span>
          <span>EST. 2026</span>
        </motion.div>

        {/* Headline + paragraph row */}
        <div className="grid grid-cols-12 gap-6 mb-auto">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="col-span-12 lg:col-span-8 font-sans-display text-[14vw] sm:text-[11vw] lg:text-[8.6vw] leading-[0.9] tracking-[-0.045em] font-medium text-foreground"
          >
            Compress<br />
            AI <span className="font-display italic font-normal text-foreground/90">Compute.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="col-span-12 lg:col-span-4 lg:pt-6 flex flex-col gap-6"
          >
            <div className="hairline" />
            <p className="text-[15px] leading-relaxed text-foreground/70 max-w-sm">
              UnZip is a drop-in compute compression layer between your app and LLM providers. Semantic cache, model routing, prompt compression — reduce AI spend by 30–70% without rewriting your product.
            </p>
            <div className="mono-label">/// COMPUTE COMPRESSION LAYER<br />FOR AI APPLICATIONS</div>
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="relative mt-12">
          {/* Giant blurred wordmark */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.7 }}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-8 sm:-bottom-16 flex justify-center"
          >
            <span className="wordmark-blur font-sans-display font-bold text-[28vw] leading-[0.8] tracking-[-0.06em] select-none">
              UNZIP
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8"
          >
            <div className="flex flex-col gap-4">
              <div className="mono-label">/// MANIFESTO — REMOVE WASTED COMPUTE.</div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  to="/app"
                  className="group spotlight inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:scale-[1.02]"
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                  }}
                >
                  Open Dashboard
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <a
                  href="#how"
                  className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground/90 hover:text-foreground transition-colors"
                >
                  See How It Works
                </a>
              </div>
            </div>

            <a
              href="#problem"
              className="hidden sm:flex items-center gap-2 mono-label hover:text-foreground transition-colors"
            >
              <ArrowDown className="h-3 w-3 animate-bounce" />
              SCROLL — 02 / THE PROBLEM
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
