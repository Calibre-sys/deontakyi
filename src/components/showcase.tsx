import { Expand } from "lucide-react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useViewer } from "@/components/viewer";
import type { Showcase as ShowcaseData } from "@/data";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Stat tiles, an animated pipeline and a filmstrip of real notebook figures. */
export function Showcase({ title, data }: { title: string; data: ShowcaseData }) {
  return (
    <div className="grid min-w-0 gap-8 border-t border-border p-6 sm:p-8">
      <Stats stats={data.stats} />
      <Pipeline steps={data.pipeline} />
      <Filmstrip title={title} figures={data.figures} />
    </div>
  );
}

/* ── Stats ── */

function Stats({ stats }: { stats: ShowcaseData["stats"] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card px-4 py-5 sm:px-5">
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.25rem)] leading-none font-semibold tracking-[-0.03em] text-accent">
            <CountUp value={s.value} />
          </dd>
          <dd aria-hidden className="mt-2 text-[0.875rem] leading-snug text-muted-foreground">
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Counts the first number in `value` up from zero when it scrolls into view. Leaves the rest of the text as is. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [shown, setShown] = useState(match && !reduce ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!match || reduce || !inView) return;
    const [, pre, num, post] = match;
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const controls = animate(0, parseFloat(num), {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setShown(`${pre}${v.toFixed(decimals)}${post}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} aria-label={value} className="tabular-nums">
      {shown}
    </span>
  );
}

/* ── Pipeline ── */

function Pipeline({ steps }: { steps: ShowcaseData["pipeline"] }) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const on = inView || !!reduce;

  return (
    <div>
      <p className="mb-4 text-[0.8125rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">pipeline</p>
      <div className="relative overflow-hidden">
        {/* the wire: vertical on phones, horizontal from md up */}
        <span aria-hidden className="absolute top-0 bottom-0 left-[1.0625rem] w-px bg-border md:top-[1.0625rem] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto" />
        {!reduce && on && <span aria-hidden className="pipe-pulse" />}
      <ol ref={ref} className="relative grid gap-4 md:auto-cols-fr md:grid-flow-col md:gap-2">
        {steps.map((step, i) => (
          <motion.li
            key={step.label}
            className="relative flex gap-3 md:flex-col md:gap-3 md:pr-2"
            initial={reduce ? false : { opacity: 0.25 }}
            animate={on ? { opacity: 1 } : undefined}
            transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.25 + i * 0.22 }}
          >
            <motion.span
              className="relative z-10 grid size-[2.125rem] shrink-0 place-items-center rounded-full border bg-card font-display text-[0.875rem] font-semibold"
              initial={reduce ? false : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}
              animate={on ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}
              transition={{ duration: 0.4, delay: reduce ? 0 : 0.25 + i * 0.22 }}
            >
              {i + 1}
            </motion.span>
            <span className="min-w-0 pb-1">
              <span className="block text-[0.9375rem] leading-snug font-semibold">{step.label}</span>
              <span className="mt-1 block text-[0.8125rem] leading-snug text-muted-foreground">{step.detail}</span>
            </span>
          </motion.li>
        ))}
      </ol>
      </div>
    </div>
  );
}

/* ── Filmstrip ── */

function Filmstrip({ title, figures }: { title: string; figures: ShowcaseData["figures"] }) {
  const view = useViewer();
  const open = (start: number) =>
    view({ title, items: figures.map((f) => ({ src: f.src, caption: f.caption })), start, download: false });

  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="text-[0.8125rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">from the notebook</p>
        <p className="text-[0.8125rem] text-muted-foreground">
          {figures.length} figures · <span className="hidden sm:inline">scroll or </span>tap to open
        </p>
      </div>
      <ul className="filmstrip -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-3 sm:-mx-8 sm:scroll-px-8 sm:px-8">
        {figures.map((f, i) => (
          <li key={f.src} className="snap-start">
            <button
              type="button"
              onClick={() => open(i)}
              className={cn(
                "group relative block overflow-hidden rounded-xl border border-border bg-white text-left transition-[transform,border-color] duration-300",
                "hover:-translate-y-1 hover:border-accent focus-visible:-translate-y-1 focus-visible:border-accent",
              )}
              aria-label={`Open figure: ${f.caption}`}
            >
              <img
                src={f.src}
                alt={f.caption}
                loading="lazy"
                decoding="async"
                className="h-44 w-auto max-w-none object-contain p-2 sm:h-52"
              />
              <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="size-3.5" />
              </span>
            </button>
            <p className="mt-2 max-w-[18rem] text-[0.8125rem] leading-snug text-muted-foreground">{f.caption}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
