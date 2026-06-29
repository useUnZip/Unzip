import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CtaSection = () => {
  return (
    <section id="cta" className="relative py-32 sm:py-48 px-6 sm:px-12 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 100%, hsl(225 22% 84% / 0.1), transparent 70%)"
      }} />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-[1480px]">
        <div className="mono-label mb-12">/// 08 — GET STARTED</div>

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans-display text-[14vw] sm:text-[10vw] lg:text-[8.5vw] leading-[0.9] tracking-[-0.045em] font-medium text-foreground mb-12"
        >
          Stop burning<br />
          <span className="font-display italic font-normal text-foreground/85">compute. Start</span><br />
          compressing it.
        </motion.h2>

        <div className="grid grid-cols-12 gap-6 items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 lg:col-span-5 text-[15px] leading-relaxed text-foreground/70 max-w-md"
          >
            UnZip helps AI applications spend fewer tokens, call cheaper models, reuse repeated work, and prove exactly how much compute they saved. Drop-in integration in under 30 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="col-span-12 lg:col-span-7 lg:col-start-6 flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/app"
                className="group spotlight inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-4 text-[14px] font-medium text-background hover:scale-[1.02] transition-transform"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              >
                Launch UnZip
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/onboarding"
                className="glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[14px] font-medium text-foreground/90 hover:text-foreground transition-colors"
              >
                Configure Gateway
              </Link>
              <Link
                to="/signin"
                className="glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[14px] font-medium text-foreground/90 hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            </div>
            <div className="mono-label mt-3 px-2">/// PRIVATE BETA — Q1 2026 — INSTANT ACCESS</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="relative px-6 sm:px-12 pt-16 pb-10 border-t border-border/40">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-6 w-6">
                <div className="absolute inset-0 rounded-md bg-foreground/90" />
                <div className="absolute inset-[3px] rounded-[5px] bg-background" />
                <div className="absolute inset-[6px] rounded-[3px] bg-foreground/90" />
              </div>
              <span className="font-sans-display text-base font-medium tracking-tight">UnZip</span>
            </div>
            <p className="text-[14px] text-foreground/60 max-w-sm">
              The compute compression layer for AI applications. Cache, route, compress, and fall back — without rewriting your product.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="mono-label mb-4">SOCIAL</div>
            <ul className="space-y-2 text-[13px] text-foreground/70">
              <li><a href="#" className="hover:text-foreground transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="mono-label mb-4">SYSTEM</div>
            <ul className="space-y-2 text-[13px] text-foreground/70">
              <li><a href="#how" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#inside" className="hover:text-foreground transition-colors">What's Inside</a></li>
              <li><Link to="/app" className="hover:text-foreground transition-colors">Open Dashboard</Link></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <div className="mono-label mb-4">CONTACT</div>
            <a href="mailto:hello@unzip.ai" className="text-[13px] text-foreground/70 hover:text-foreground transition-colors block">hello@unzip.ai</a>
            <div className="mono-label mt-6">/// REMOTE — GLOBAL</div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="hairline mb-8" />
        <div aria-hidden className="font-sans-display font-bold text-[20vw] leading-[0.8] tracking-[-0.06em] text-foreground/[0.04] select-none -mx-2">
          UNZIP
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 mono-label">
          <span>© 2026 UNZIP SYSTEMS — ALL RIGHTS RESERVED</span>
          <span>BUILT FOR AI INFRASTRUCTURE TEAMS</span>
        </div>
      </div>
    </footer>
  );
};
