import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Copy } from "lucide-react";

const resourceLinks = [
  { label: "Docs", to: "/docs" },
  { label: "Whitepaper", to: "/whitepaper" },
];

export const ResourceNav = ({ active }: { active?: "docs" | "whitepaper" }) => {
  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 pt-4 sm:pt-6">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between rounded-full glass-strong px-3 py-2">
        <Link to="/" className="flex items-center gap-2 pl-2 sm:pl-3 flex-shrink-0">
          <img src="/unzip-logo.png" alt="" aria-hidden="true" className="h-6 w-6 flex-shrink-0" />
          <span className="font-sans-display text-[15px] font-medium tracking-tight text-foreground">
            UnZip
          </span>
          <span className="mono-label hidden md:inline ml-2">
            /// {active === "whitepaper" ? "WHITEPAPER" : "DOCS"}
          </span>
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-2">
          {resourceLinks.map((l) => {
            const isActive =
              (active === "docs" && l.to === "/docs") ||
              (active === "whitepaper" && l.to === "/whitepaper");
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 sm:px-4 py-2 text-[12.5px] sm:text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            to="/app"
            aria-label="Open App"
            className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-3 sm:px-4 py-2 text-[13px] font-medium text-primary-foreground transition-all hover:scale-[1.02]"
          >
            <span className="hidden sm:inline">Open App</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export const CodeBlock = ({
  code,
  lang,
}: {
  code: string;
  lang?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="group relative my-5 overflow-hidden rounded-2xl border border-border/60 bg-foreground/[0.03]">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
        <span className="mono-label">{lang ?? "shell"}</span>
        <button
          onClick={copy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-foreground/50 hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed">
        <code className="font-mono text-foreground/85 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
};
