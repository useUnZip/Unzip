import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "01 / Hero", href: "#hero" },
  { label: "02 / Problem", href: "#problem" },
  { label: "03 / Definition", href: "#definition" },
  { label: "04 / What's Inside", href: "#inside" },
  { label: "05 / Workspace", href: "#workspace" },
  { label: "06 / Who It's For", href: "#audience" },
  { label: "07 / How It Works", href: "#how" },
  { label: "08 / Join", href: "#cta" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 sm:pt-6"
      >
        <div
          className={`mx-auto flex max-w-[1480px] items-center justify-between rounded-full px-3 py-2 transition-all duration-500 ${
            scrolled ? "glass-strong" : "glass"
          }`}
        >
          {/* Brand */}
          <a href="#hero" className="flex items-center gap-2 pl-3">
            <div className="relative h-6 w-6">
              <div className="absolute inset-0 rounded-md bg-foreground/90" />
              <div className="absolute inset-[3px] rounded-[5px] bg-background" />
              <div className="absolute inset-[6px] rounded-[3px] bg-foreground/90" />
            </div>
            <span className="font-sans-display text-[15px] font-medium tracking-tight text-foreground">
              UnZip
            </span>
            <span className="mono-label hidden sm:inline ml-2">/// V0.1</span>
          </a>

          {/* Right pills */}
          <div className="flex items-center gap-2">
            <a
              href="#how"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <Link
              to="/signin"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/app"
              className="group spotlight inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all hover:scale-[1.02]"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              Open App
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:text-foreground transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-2xl"
          >
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between px-6 sm:px-12 pt-6">
                <span className="font-sans-display text-lg font-medium">UnZip</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="glass inline-flex h-10 w-10 items-center justify-center rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex-1 flex flex-col justify-center px-6 sm:px-16 max-w-5xl">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex items-baseline gap-6 border-b border-border/40 py-5 hover:pl-3 transition-all duration-500"
                  >
                    <span className="mono-label w-12">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-sans-display text-3xl sm:text-5xl font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                      {item.label.split("/ ")[1]}
                    </span>
                    <ArrowUpRight className="ml-auto h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </nav>
              <div className="px-6 sm:px-12 pb-8 mono-label flex justify-between">
                <span>/// UNZIP — COMPUTE COMPRESSION LAYER FOR AI</span>
                <span>© 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
