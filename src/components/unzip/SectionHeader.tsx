import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  number: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
}

export const SectionHeader = ({ number, label, title, description }: SectionHeaderProps) => {
  return (
    <div className="grid grid-cols-12 gap-6 mb-12 sm:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="col-span-12 lg:col-span-4 flex flex-col gap-3"
      >
        <div className="mono-label">/// {number} — {label}</div>
        <div className="hairline w-24" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="col-span-12 lg:col-span-8"
      >
        <h2 className="font-sans-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.035em] font-medium text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-foreground/65">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
};
