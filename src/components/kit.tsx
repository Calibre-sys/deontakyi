import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Rises 24px and fades in once, the first time it scrolls into view. Content stays visible without script. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** A reading-column section. `stage` names what the sticky picture shows while this section is in view. */
export function Section({
  id,
  stage,
  className,
  children,
  label,
}: {
  id: string;
  stage: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <section id={id} data-stage={stage} aria-label={label} className={cn("px-[var(--gutter)] pt-28 pb-12 lg:pt-44 lg:pb-16", className)}>
      {children}
    </section>
  );
}

export function Heading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal>
      <h2 className={cn("text-head", className)}>{children}</h2>
    </Reveal>
  );
}
