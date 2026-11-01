import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/data";
import { Reveal, Section, Serif } from "./ui";

type Stop = (typeof EXPERIENCE)[number];

export function Journey() {
  return (
    <Section
      id="journey"
      index="05"
      eyebrow="Experience & education"
      title={
        <>
          From the tank farm <Serif>to the model.</Serif>
        </>
      }
      intro="I worked on the pipelines, pumps and meters before I wrote software for them. That's why I know where the data gets messy."
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Timeline label="Experience" stops={EXPERIENCE} />
        <Timeline label="Education" stops={EDUCATION} />
      </div>
    </Section>
  );
}

function Timeline({ label, stops }: { label: string; stops: Stop[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div>
      <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</h3>
      <ol ref={ref} className="relative grid gap-8 pl-7">
        <span aria-hidden className="absolute top-1 bottom-1 left-[5px] w-px bg-border" />
        <motion.span
          aria-hidden
          className="absolute top-1 bottom-1 left-[5px] w-px origin-top bg-primary"
          style={{ scaleY: reduce ? 1 : scaleY }}
        />
        {stops.map((stop, i) => (
          <li key={stop.org + stop.role} className="relative">
            <span aria-hidden className="absolute top-1.5 -left-7 size-[11px] rounded-full border-2 border-primary bg-background" />
            <Reveal delay={i * 0.05}>
              <p className="font-mono text-xs text-muted-foreground">{stop.when}</p>
              <h4 className="mt-1 text-lg font-semibold tracking-tight">{stop.org}</h4>
              <p className="text-sm text-primary">{stop.role}</p>
              {stop.points.length > 0 && (
                <ul className="mt-3 grid gap-1.5 text-sm leading-relaxed text-muted-foreground">
                  {stop.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-border-strong" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
