import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades and rises in once, the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  y = 20,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "figure" | "article";
  y?: number;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** A page section with a title row: title on the left, an optional note or link on the right. */
export function Section({
  id,
  title,
  aside,
  children,
  className,
}: {
  id: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("container-x py-20 sm:py-28", className)}>
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 sm:mb-14">
        <h2 className="section-title">{title}</h2>
        {aside && <div className="text-[0.9375rem] text-muted-foreground">{aside}</div>}
      </Reveal>
      {children}
    </section>
  );
}
