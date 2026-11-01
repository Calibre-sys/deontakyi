import { ArrowUpRight, Check, Copy, Quote } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ActionSwapButton } from "@/components/motion/action-swap";
import { Card } from "@/components/motion/card";
import { useViewer } from "@/components/viewer";
import { ME_AS_AUTHOR, PAPERS, type Paper } from "@/data";
import { EASE_OUT } from "@/lib/ease";
import { Pill, Reveal, Section, Serif } from "./ui";

export function Research() {
  return (
    <Section
      id="research"
      index="01"
      eyebrow="Published research"
      title={
        <>
          Two papers, <Serif>in print.</Serif>
        </>
      }
      intro="Two papers on machine learning for the subsurface: one finds hydraulic flow units automatically, the other works out which water injectors actually drive production."
    >
      <div className="grid gap-6">
        {PAPERS.map((paper, i) => (
          <Reveal key={paper.id} delay={i * 0.08}>
            <PaperCard paper={paper} number={i + 1} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function PaperCard({ paper, number }: { paper: Paper; number: number }) {
  const view = useViewer();
  const url = `https://doi.org/${paper.doi}`;

  return (
    <Card variant="outlined" className="overflow-hidden p-0 py-0 shadow-[0_1px_0_rgb(0_0_0/0.02)]">
      <div className="grid md:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="relative flex items-center justify-center overflow-hidden border-b border-border bg-card p-8 md:border-r md:border-b-0">
          <div aria-hidden className="grid-lines absolute inset-0 opacity-60" />
          <PaperCover paper={paper} />
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-primary">P{String(number).padStart(2, "0")}</span>
            <Pill className="border-primary/25 bg-primary/8 text-primary">{paper.venue}</Pill>
            <Pill>{paper.date}</Pill>
          </div>

          <h3 className="text-balance text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
            <a href={url} target="_blank" rel="noopener" className="decoration-primary/40 underline-offset-4 hover:underline">
              {paper.title}
            </a>
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {paper.authors.map((author, i) => (
              <span key={author}>
                {author === ME_AS_AUTHOR ? (
                  <mark className="rounded bg-primary/12 px-1 font-medium text-foreground">{author}</mark>
                ) : (
                  author
                )}
                {i < paper.authors.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>

          <p className="text-pretty leading-relaxed">{paper.summary}</p>

          <ul className="grid gap-2 sm:grid-cols-3">
            {paper.highlights.map((highlight) => (
              <li key={highlight} className="rounded-2xl border border-border bg-card/60 p-3 text-sm leading-snug text-muted-foreground">
                <Check className="mb-1.5 size-4 text-success" aria-hidden />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5">
            {paper.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-5">
            <a
              href={url}
              target="_blank"
              rel="noopener"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Read the paper
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={() => view({ title: paper.title, items: [{ src: paper.screenshot, caption: `${paper.publisher} · ${paper.detail}` }] })}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-card"
            >
              Publisher page
            </button>
            <CopyCitation paper={paper} />
            <span className="ml-auto hidden font-mono text-xs text-muted-foreground sm:inline">doi:{paper.doi}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function citation(paper: Paper) {
  const year = paper.date.match(/\d{4}/)?.[0] ?? "";
  return `${paper.authors.join(", ")} (${year}). ${paper.title}. ${paper.venue}. https://doi.org/${paper.doi}`;
}

function CopyCitation({ paper }: { paper: Paper }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <ActionSwapButton
      variant="ghost"
      size="md"
      cycle={false}
      value={state}
      items={[
        { id: "idle", label: "Cite", icon: <Quote className="size-4" /> },
        { id: "copied", label: "Citation copied", icon: <Copy className="size-4" /> },
      ]}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(citation(paper));
          setState("copied");
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setState("idle"), 1800);
        } catch {
          /* clipboard can be blocked; nothing else to do */
        }
      }}
    />
  );
}

function PaperCover({ paper }: { paper: Paper }) {
  const reduce = useReducedMotion();
  const hover = reduce ? undefined : { rotate: -2, y: -6, scale: 1.03 };
  if (paper.cover) {
    return (
      <motion.img
        whileHover={hover}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        src={paper.cover}
        alt={`${paper.venue} cover`}
        className="relative w-40 rounded-md shadow-[0_24px_50px_-20px_rgb(0_0_0/0.55)] ring-1 ring-black/10 sm:w-44"
      />
    );
  }
  // A typographic stand-in for conference papers, which have no journal cover.
  return (
    <motion.div
      whileHover={hover}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="relative flex aspect-[3/4] w-40 flex-col justify-between overflow-hidden rounded-md bg-[#0b2b5c] p-4 text-white shadow-[0_24px_50px_-20px_rgb(0_0_0/0.55)] sm:w-44"
    >
      <div aria-hidden className="absolute -right-10 -bottom-10 size-40 rounded-full bg-[#1f6fd1]/50 blur-2xl" />
      <div aria-hidden className="absolute -top-8 -left-8 size-28 rounded-full bg-[#f6b21a]/40 blur-2xl" />
      <span className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">SPE · OnePetro</span>
      <span className="relative">
        <span className="block text-2xl font-bold leading-none">ATC</span>
        <span className="block text-2xl font-bold leading-none text-[#f6b21a]">2026</span>
        <span className="mt-2 block text-[11px] leading-snug text-white/80">Africa Technology Conference · Abidjan</span>
      </span>
      <span className="relative font-mono text-[10px] text-white/60">SPE-233427-MS</span>
    </motion.div>
  );
}
