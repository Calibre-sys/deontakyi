import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A plain wrapper. The Almanac theme keeps still: nothing fades or rises on
 * scroll, so content is there from the first paint (and with scripts off).
 * The props stay so every caller keeps working.
 */
export function Reveal({
  children,
  className,
  as = "div",
  id,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "figure" | "article";
  y?: number;
  id?: string;
}) {
  const Tag = as;
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A page section: a head block (the title, with an optional line or link set
 * on the right of the same baseline), then its body.
 */
export function Section({
  id,
  title,
  aside,
  children,
  className,
}: {
  id: string;
  /** Kept for callers; not rendered (no numbered labels over heads). */
  index?: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-[calc(var(--section-gap)/2)]", className)}>
      <div className="container-x">
        <div className="mb-12 grid gap-x-[var(--gap-columns)] gap-y-4 border-t-2 border-rule-2 pt-6 md:grid-cols-12 md:items-baseline lg:mb-16">
          <h2 className="section-title md:col-span-6">{title}</h2>
          {aside && <div className="kicker md:col-span-5 md:col-start-8">{aside}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}
