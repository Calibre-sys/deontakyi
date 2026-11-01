import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Rises and fades in once as it enters. Without script the content is simply there. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "figure";
  y?: number;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** One chapter of the story. `id` matches an entry in CHAPTERS so the rail can follow along. */
export function Chapter({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} data-chapter={id} className={cn("relative bg-ground py-28 text-ink sm:py-40", className)}>
      <div className="frame">{children}</div>
    </section>
  );
}

/** A chapter title: huge condensed capitals, never more than two lines. */
export function Title({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.h2
      className={cn("text-head", className)}
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: EASE }}
    >
      {children}
    </motion.h2>
  );
}
