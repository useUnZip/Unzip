import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { copyText } from "@/lib/clipboard";

export const CopyButton = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      aria-label="Copy"
      onClick={async () => {
        const ok = await copyText(value);
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }}
      className={
        className ??
        "flex-shrink-0 rounded-lg border border-border p-2.5 hover:bg-foreground/5 transition-colors"
      }
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
};
