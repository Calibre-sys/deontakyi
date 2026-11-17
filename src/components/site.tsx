import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Download, FileText, Lock, Mail, MapPin, Phone } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { siGithub } from "simple-icons";
import { ArcPicker } from "@/components/motion/arc-picker";
import { CardFolder } from "@/components/motion/card-folder";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { useViewer } from "@/components/viewer";
import {
  ACTIVITIES,
  BOOKS,
  CERTS,
  COLLECTIONS,
  EDUCATION,
  ENTRIES,
  EXPERIENCE,
  ME_AS_AUTHOR,
  PAPERS,
  PROFILE,
  PROJECTS,
  type CollectionId,
  type Entry,
  type Outcome,
  type Paper,
  type Project,
} from "@/data";
import { cn } from "@/lib/utils";
import { BookCover } from "./book-cover";
import { CaseVideo, OutreachReplay, RecruiterFlow, WindowFrame } from "./case-visuals";
import { FlowUnitLab } from "./flow-unit-lab";
import { LiveDemo } from "./live-demo";
import { PhotoStack } from "./photo-stack";
import { HangingTools, TOOLS } from "./tools";
import { ProjectVisual } from "./visuals";
import { PhotoWall, WorkReel } from "./work-reel";
import { Reveal, Section } from "./kit";

const EASE = [0.16, 1, 0.3, 1] as const;
const NAV = [
  { href: "/#work", label: "work" },
  { href: "/#research", label: "research" },
  { href: "/#experience", label: "experience" },
  { href: "/#credentials", label: "credentials" },
  { href: "/#contact", label: "contact" },
];

function useCv() {
  const view = useViewer();
  return () => view({ title: `CV · ${PROFILE.name}`, items: [{ src: PROFILE.cv }] });
}

export function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d={siGithub.path} />
    </svg>
  );
}

/* ───────── Header ───────── */

export function Header() {
  const openCv = useCv();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-border bg-background/75 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center gap-5">
        <a href="/" className="mr-auto flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-foreground font-mono text-[0.75rem] font-medium text-background" data-no-scramble>
            DT
          </span>
          <span className="hidden font-display text-[1rem] font-semibold tracking-[-0.02em] sm:inline">Deon Takyi-Amponsem</span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="rounded-md px-3 py-1.5 font-mono text-[0.75rem] tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:bg-card-2 hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener"
          aria-label="GitHub: Calibre-sys"
          className="flex h-9 items-center gap-2 rounded-lg border border-border px-2.5 text-[0.8125rem] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
        >
          <GithubMark className="size-4" />
          <span className="hidden font-mono text-[0.75rem] xl:inline">Calibre-sys</span>
        </a>
        <ThemeToggle variant="circle-blur" start="top-right" className="size-9 rounded-lg text-muted-foreground hover:bg-card-2 hover:text-foreground" iconClassName="size-4" />
        <button type="button" onClick={openCv} className="btn h-9 px-3.5 text-[0.8125rem]">
          <FileText className="size-4" /> CV
        </button>
      </div>
    </header>
  );
}

/* ───────── Hero ───────── */

const RECEIPTS = [
  { value: "90%+", label: "less time per order", from: "SOH Order Management", href: "#case-soh", thumb: "/media/soh-poster.jpg" },
  { value: "455/880", label: "contacts converted, zero calls", from: "outreach automation", href: "#case-outreach", thumb: null },
  { value: "2", label: "peer-reviewed papers", from: "Elsevier · SPE", href: "#research", thumb: "/media/jag-cover.jpg" },
  { value: "live", label: "RescharAI demo you can use", from: "reservoir software", href: "#demo", thumb: "/media/reschar-poster.jpg" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const openCv = useCv();
  const rise = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: 0.05 + i * 0.08 } };

  return (
    <section id="top" className="relative">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-x-0 -top-16 h-[52rem]" />
      <div className="container-x relative pt-10 pb-16 sm:pt-16 sm:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <motion.p {...rise(0)} className="kicker flex items-center gap-2.5">
              <span className="relative flex size-2">
                <span className="absolute inset-0 rounded-full bg-accent" style={{ animation: reduce ? undefined : "ping-soft 2.2s ease-out infinite" }} />
                <span className="relative size-2 rounded-full bg-accent" />
              </span>
              petroleum engineer · builder · {PROFILE.location}
            </motion.p>
            <motion.h1 {...rise(1)} className="mt-6 text-[clamp(2.75rem,1.4rem+5vw,5.25rem)] leading-[0.95] font-semibold">
              hi, i'm Deon.
              <span className="mt-3 block max-w-[17ch] text-[0.62em] leading-[1.02] text-muted-foreground">i build software for the ground beneath us.</span>
            </motion.h1>
            <motion.p {...rise(2)} className="mt-7 max-w-[54ch] text-[1.1875rem] leading-relaxed text-muted-foreground">
              i trained as a petroleum engineer and taught myself to code. i'm an enthusiast for machine learning where it meets{" "}
              <span className="text-foreground">physical systems</span> (rocks, wells, reservoirs), and i ship what i build as tools people actually use.
            </motion.p>
            <motion.div {...rise(3)} className="mt-9 flex flex-wrap gap-3">
              <a href="#work" className="btn btn-accent">
                see the work <ArrowRight className="size-4" />
              </a>
              <a href={PROFILE.github} target="_blank" rel="noopener" className="btn btn-ghost">
                <GithubMark className="size-4" /> GitHub
              </a>
              <button type="button" onClick={openCv} className="btn btn-ghost">
                <FileText className="size-4" /> CV
              </button>
            </motion.div>
          </div>
          <motion.div
            className="lg:col-span-5"
            initial={reduce ? false : { opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          >
            <PhotoStack />
          </motion.div>
        </div>

        {/* Receipts: what the work did, each one linking to the work itself. */}
        <motion.div {...rise(5)} className="mt-16 sm:mt-20">
          <p className="kicker mb-4">// what the work did</p>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {RECEIPTS.map((r) => (
              <li key={r.label}>
                <a href={r.href} className="surface group flex h-full items-center gap-4 p-3.5 pr-4 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-border-strong sm:p-4">
                  <span className="hidden size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-card-2 sm:block">
                    {r.thumb ? <img src={r.thumb} alt="" loading="lazy" className="size-full object-cover" /> : <DotThumb />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[1.625rem] leading-none font-semibold tracking-[-0.03em] text-foreground group-hover:text-accent">{r.value}</span>
                    <span className="mt-1.5 block text-[0.8125rem] leading-snug text-muted-foreground">{r.label}</span>
                    <span className="kicker mt-1 block truncate !text-[0.625rem]">{r.from}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function DotThumb() {
  return (
    <svg viewBox="0 0 56 56" className="size-full" aria-hidden>
      {Array.from({ length: 49 }, (_, i) => (
        <circle key={i} cx={6 + (i % 7) * 7.3} cy={6 + Math.floor(i / 7) * 7.3} r={2.2} fill={(i * 37) % 100 < 52 ? "var(--accent)" : "var(--border-strong)"} />
      ))}
    </svg>
  );
}

/* ───────── Work: case studies ───────── */

export function Work() {
  const byId = (id: string) => PROJECTS.find((p) => p.id === id)!;
  const rest = PROJECTS.filter((p) => p.id !== "reschar");
  return (
    <Section id="work" index="01" title="selected work" aside="shipped, in use, and measured" className="border-t border-border">
      <Reveal className="mb-20 sm:mb-28">
        <WorkReel />
      </Reveal>

      <div className="grid gap-24 sm:gap-32">
        <div className="grid gap-10">
          <Case project={byId("reschar")} n={1} />
          <Reveal id="demo">
            <LiveDemo />
          </Reveal>
        </div>
        {rest.map((p, i) => (
          <Case key={p.id} project={p} n={i + 2} flip={i % 2 === 0} />
        ))}
      </div>

      <Reveal className="mt-28">
        <CollectionLinks />
      </Reveal>
    </Section>
  );
}

function Case({ project, n, flip }: { project: Project; n: number; flip?: boolean }) {
  return (
    <article id={`case-${project.id}`} className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <Reveal className={cn("lg:col-span-7", flip && "lg:order-2")}>
        <WindowFrame address={project.address}>
          {project.video ? (
            <CaseVideo src={project.video} poster={project.poster} title={project.name} />
          ) : project.visual === "outreach" ? (
            <OutreachReplay />
          ) : (
            <RecruiterFlow />
          )}
        </WindowFrame>
      </Reveal>

      <Reveal delay={0.08} className={cn("lg:col-span-5", flip && "lg:order-1")}>
        <p className="kicker">
          {String(n).padStart(2, "0")} — {project.kind} · {project.year}
        </p>
        <h3 className="mt-3 text-[clamp(1.875rem,1.4rem+1.6vw,2.625rem)] leading-[1.02] font-semibold">{project.name}</h3>
        <p className="mt-3 text-[1.0625rem] text-muted-foreground">{project.tagline}</p>

        <OutcomeBlock outcome={project.outcome} />

        <dl className="mt-7 grid gap-5 text-[0.96875rem] leading-relaxed">
          <div>
            <dt className="kicker">the problem</dt>
            <dd className="mt-1.5 text-muted-foreground">{project.problem}</dd>
          </div>
          <div>
            <dt className="kicker">what i built</dt>
            <dd className="mt-1.5">{project.built}</dd>
          </div>
        </dl>

        <ul className="mt-6 grid gap-2">
          {project.facts.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[0.9375rem] text-muted-foreground">
              <Check className="mt-1 size-3.5 shrink-0 text-accent" /> {f}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          {project.tools.map((t) => (
            <ToolChip key={t} tool={t} />
          ))}
          {project.private && (
            <span className="chip">
              <Lock className="size-3" /> private build
            </span>
          )}
        </div>
        {project.links && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener" className="btn btn-ghost h-10 text-[0.875rem]">
                {l.label} <ArrowUpRight className="size-4" />
              </a>
            ))}
          </div>
        )}
      </Reveal>
    </article>
  );
}

function OutcomeBlock({ outcome }: { outcome: Outcome }) {
  return (
    <div className="surface mt-7 overflow-hidden p-5">
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-accent" />
      <p className="kicker">outcome</p>
      {outcome.kind === "number" ? (
        <>
          <p className="mt-2 font-display text-[clamp(2.5rem,1.8rem+2.4vw,3.5rem)] leading-none font-semibold tracking-[-0.04em] text-accent">{outcome.value}</p>
          <p className="mt-2 text-[0.96875rem]">{outcome.label}</p>
        </>
      ) : (
        <div className="mt-3 grid gap-2.5">
          <p className="flex items-baseline gap-3 text-[0.96875rem] text-muted-foreground">
            <span className="kicker w-12 shrink-0">before</span>
            <span className="line-through decoration-border-strong">{outcome.before}</span>
          </p>
          <p className="flex items-baseline gap-3 text-[1.25rem] leading-snug font-semibold">
            <span className="kicker w-12 shrink-0 !text-accent">after</span>
            <span>{outcome.after}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function ToolChip({ tool }: { tool: keyof typeof TOOLS }) {
  const t = TOOLS[tool];
  return (
    <span className="chip">
      <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden fill={`#${t.icon.hex}`}>
        <path d={t.icon.path} />
      </svg>
      {t.name}
    </span>
  );
}

/* ───────── Research ───────── */

const PAPER_RESULTS: Record<string, { value: string; label: string }> = {
  hfu: { value: "0 labels", label: "rock types found unsupervised on five Subei Basin wells, then predicted in wells the model had never seen" },
  injectors: { value: "0 field tests", label: "well-to-well influence read from production history alone, with VAR and VECM causality models" },
};

export function Publications() {
  return (
    <Section id="research" index="02" title="research" aside="machine learning on subsurface data, peer reviewed" className="border-t border-border">
      <ol className="grid gap-6">
        {PAPERS.map((paper, i) => (
          <Reveal as="li" key={paper.id} delay={i * 0.06}>
            <PaperCase paper={paper} />
            {paper.id === "hfu" && (
              <div className="surface mt-6 p-4 py-5 sm:p-8">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="kicker">interactive · the physics behind the 2025 paper</p>
                    <h3 className="mt-2 text-[1.5rem] leading-tight font-semibold">Flow zone indicator</h3>
                  </div>
                  <p className="max-w-[44ch] text-[0.9375rem] text-muted-foreground">move the sliders to classify a rock sample into a hydraulic flow unit.</p>
                </div>
                <FlowUnitLab />
              </div>
            )}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function PaperCase({ paper }: { paper: Paper }) {
  const view = useViewer();
  const result = PAPER_RESULTS[paper.id];
  return (
    <article className="surface grid gap-8 overflow-hidden p-5 sm:p-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <button
          type="button"
          onClick={() => view({ title: paper.title, items: [{ src: paper.screenshot, caption: `${paper.venue} · ${paper.detail}` }] })}
          className="group block w-full text-left"
          aria-label={`Open the publisher page for ${paper.title}`}
        >
          <WindowFrame address={`doi.org/${paper.doi}`}>
            <div className="relative aspect-[16/10] overflow-hidden bg-white">
              <img src={paper.screenshot} alt="" loading="lazy" className="size-full object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03]" />
              {paper.cover && <img src={paper.cover} alt={`${paper.venue} cover`} loading="lazy" className="absolute right-3 bottom-3 w-[24%] rounded-sm shadow-lg ring-1 ring-black/10" />}
            </div>
          </WindowFrame>
        </button>
        <HangingTools tools={paper.tools} size={28} align="start" rod className="mt-2 max-w-[17rem]" />
      </div>
      <div className="min-w-0 lg:col-span-7">
        <p className="kicker">
          {paper.year} · {paper.venue}
        </p>
        <h3 className="mt-3 font-sans text-[1.25rem] leading-snug font-semibold tracking-normal sm:text-[1.375rem]">
          <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener" className="hover:text-accent">
            {paper.title}
          </a>
        </h3>
        <p className="mt-3 text-[0.875rem] leading-relaxed text-muted-foreground">
          {paper.authors.map((a, j) => (
            <Fragment key={a}>
              <span className={a === ME_AS_AUTHOR ? "font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4" : undefined}>{a}</span>
              {j < paper.authors.length - 1 ? ", " : ""}
            </Fragment>
          ))}
        </p>
        <p className="mt-1 text-[0.875rem] text-muted-foreground">{paper.detail}</p>

        {result && (
          <div className="mt-6 grid gap-4 border-y border-border py-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
            <p className="font-display text-[2.25rem] leading-none font-semibold tracking-[-0.04em] text-accent">{result.value}</p>
            <p className="text-[0.9375rem] leading-relaxed">{result.label}</p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {paper.methods.map((m) => (
            <span key={m} className="chip">
              {m}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9375rem]">
          <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener" className="btn btn-ghost h-10 text-[0.875rem]">
            read the paper <ArrowUpRight className="size-4" />
          </a>
          <CopyCitation paper={paper} />
        </div>
      </div>
    </article>
  );
}

function CopyCitation({ paper }: { paper: Paper }) {
  const [copied, setCopied] = useState(false);
  const text = `${paper.authors.join(", ")} (${paper.year}). ${paper.title}. ${paper.venue}. https://doi.org/${paper.doi}`;
  return (
    <button
      type="button"
      className="link inline-flex items-center gap-1.5"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "copied" : "copy citation"}
    </button>
  );
}

/* ───────── Project collections ───────── */

function CollectionLinks() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-[1.75rem] leading-tight font-semibold">more work</h3>
        <p className="text-[0.9375rem] text-muted-foreground">notebooks, datathons and experiments</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {COLLECTIONS.map((c) => {
          const entries = ENTRIES.filter((e) => e.collection === c.id);
          return (
            <a key={c.id} href={c.path} className="surface group flex flex-col p-6 transition-colors hover:border-border-strong sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="kicker">{entries.length} projects</p>
                  <p className="mt-2 font-display text-[1.5rem] font-semibold tracking-[-0.03em] group-hover:text-accent">{c.title}</p>
                  <p className="mt-1 text-[0.9375rem] text-muted-foreground">{c.note}</p>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-[transform,border-color,color] duration-300 group-hover:translate-x-1 group-hover:border-accent group-hover:text-accent">
                  <ArrowRight className="size-4" />
                </span>
              </div>
              <ul className="mt-6 grid gap-0 border-t border-border">
                {entries.map((e) => (
                  <li key={e.id} className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 text-[0.9375rem] last:border-b-0">
                    <span className="truncate">{e.title}</span>
                    <span className="kicker shrink-0">{e.year}</span>
                  </li>
                ))}
              </ul>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/** A subpage listing every project in one collection. */
export function ProjectsPage({ id }: { id: CollectionId }) {
  const c = COLLECTIONS.find((x) => x.id === id)!;
  const other = COLLECTIONS.find((x) => x.id !== id)!;
  const entries = ENTRIES.filter((e) => e.collection === id);
  return (
    <>
      <section className="relative">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-x-0 -top-16 h-[36rem]" />
        <div className="container-x relative pt-10 pb-14 sm:pt-16">
          <a href="/#work" className="link inline-flex items-center gap-1.5 text-[0.9375rem]">
            <ArrowLeft className="size-4" /> back home
          </a>
          <p className="kicker mt-10">{entries.length} projects</p>
          <h1 className="mt-3 text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[0.98] font-semibold">{c.title}</h1>
          <p className="mt-5 max-w-[62ch] text-[1.125rem] leading-relaxed text-muted-foreground">{c.intro}</p>
        </div>
      </section>
      <section className="container-x pb-16">
        <ol className="grid gap-5">
          {entries.map((e, i) => (
            <Reveal as="li" key={e.id} delay={i * 0.04} className="min-w-0">
              <EntryRow entry={e} n={i + 1} />
            </Reveal>
          ))}
        </ol>
      </section>
      <section className="container-x pb-24">
        <Reveal>
          <a href={other.path} className="surface group flex items-center justify-between gap-4 p-6 hover:border-border-strong sm:p-8">
            <span>
              <span className="kicker block">next collection</span>
              <span className="mt-2 block font-display text-[1.75rem] font-semibold tracking-[-0.03em] group-hover:text-accent">{other.title}</span>
            </span>
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </section>
    </>
  );
}

function EntryRow({ entry, n }: { entry: Entry; n: number }) {
  return (
    <article className="surface min-w-0 p-6 sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:gap-10">
        <div className="min-w-0">
          <p className="kicker">
            {String(n).padStart(2, "0")} · {entry.year}
          </p>
          <h2 className="mt-2 font-display text-[1.625rem] leading-tight font-semibold">{entry.title}</h2>
          <p className="mt-3 max-w-[70ch] leading-relaxed text-muted-foreground">{entry.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.methods.map((m) => (
              <span key={m} className="chip">
                {m}
              </span>
            ))}
          </div>
          {entry.links && (
            <div className="mt-5 flex flex-wrap gap-3">
              {entry.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" download={l.download || undefined} className="btn btn-ghost h-10 text-[0.875rem]">
                  {l.download ? <Download className="size-4" /> : null} {l.label} {!l.download && <ArrowUpRight className="size-4" />}
                </a>
              ))}
            </div>
          )}
          {entry.visual && (
            <div className="mt-8 max-w-[44rem] rounded-xl border border-border bg-card-2/50 p-4 sm:p-5">
              <ProjectVisual kind={entry.visual} />
            </div>
          )}
        </div>
        <HangingTools tools={entry.tools} rod size={30} align="center" className="w-fit min-w-[8rem]" />
      </div>
    </article>
  );
}

/* ───────── Experience ───────── */

/** Emphasises the measured bits of a sentence: percentages and "x of y". */
function Measured({ text }: { text: string }) {
  const parts = text.split(/(\d+%\+?|\d+ of \d+|\d+-contact)/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <span key={i} className="font-semibold text-accent">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

export function Experience() {
  return (
    <Section id="experience" index="03" title="experience" className="border-t border-border">
      <ol className="relative grid gap-6">
        {EXPERIENCE.map((job, i) => (
          <Reveal as="li" key={job.org} delay={i * 0.05}>
            <article className="surface grid gap-6 p-6 sm:p-8 md:grid-cols-[13rem_1fr_auto] md:gap-10">
              <div>
                <p className="kicker">{job.when}</p>
                <div className="mt-4">
                  <Logo src={job.logo} name={job.org} />
                </div>
              </div>
              <div>
                <h3 className="font-display text-[1.5rem] leading-tight font-semibold">{job.org}</h3>
                <p className="mt-1 text-muted-foreground">{job.role}</p>
                <ul className="mt-5 grid max-w-[68ch] gap-2.5">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[0.96875rem] leading-relaxed">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-border-strong" />
                      <span>
                        <Measured text={point} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <HangingTools tools={job.tools} rod size={32} align="center" className="w-fit min-w-[8rem]" />
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ───────── Credentials ───────── */

export function Credentials() {
  const [current, setCurrent] = useState(CERTS[2].id);
  const view = useViewer();
  const cert = CERTS.find((c) => c.id === current)!;
  const index = CERTS.indexOf(cert);
  const openCert = () =>
    view({ title: "Certificates", items: CERTS.map((c) => ({ src: c.preview, file: c.pdf, caption: `${c.title} · ${c.issuer} · ${c.date}` })), start: index });

  return (
    <Section id="credentials" index="04" title="credentials" aside="DataCamp × 4 · 365 Data Science × 3" className="border-t border-border">
      <Reveal>
        <div className="surface overflow-hidden">
          <div className="grid lg:grid-cols-12">
            <div className="border-b border-border p-4 lg:col-span-5 lg:border-r lg:border-b-0">
              <ArcPicker
                aria-label="Certificates"
                options={CERTS.map((c) => ({ value: c.id, label: c.short }))}
                value={cert.id}
                onValueChange={setCurrent}
                side="right"
                radius={380}
                itemHeight={54}
                visibleCount={7}
              />
            </div>
            <div className="p-5 sm:p-8 lg:col-span-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.button
                  key={cert.id}
                  type="button"
                  onClick={openCert}
                  aria-label={`Open the ${cert.title} certificate`}
                  className="block w-full overflow-hidden rounded-lg bg-white ring-1 ring-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <img src={cert.preview} alt="" className="block h-auto w-full" />
                </motion.button>
              </AnimatePresence>
              <div className={cert.tools.length ? "h-[7.75rem]" : "h-5"}>
                <HangingTools key={cert.id} tools={cert.tools} size={32} align="center" />
              </div>
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="flex items-center gap-4">
                  <Logo src={cert.issuer === "DataCamp" ? "/logos/datacamp.png" : "/logos/365-data-science.png"} name={cert.issuer} wide={cert.issuer !== "DataCamp"} />
                  <div>
                    <p className="font-semibold">{cert.title}</p>
                    <p className="text-[0.875rem] text-muted-foreground">
                      {cert.issuer} · {cert.date}
                      {cert.length ? ` · ${cert.length}` : ""}
                    </p>
                    <p className="kicker mt-0.5 !text-[0.625rem]">ID {cert.credential}</p>
                  </div>
                </div>
                <a href={cert.pdf} download className="btn btn-ghost h-10 text-[0.875rem]">
                  <Download className="size-4" /> PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="surface h-full p-6 sm:p-7">
            <p className="kicker">school</p>
            <ul className="mt-5 grid gap-6">
              {EDUCATION.map((e) => (
                <li key={e.org} className="flex gap-4">
                  <Logo src={e.logo} name={e.org} />
                  <div>
                    <p className="font-semibold">{e.org}</p>
                    <p className="text-[0.9375rem]">{e.role}</p>
                    <p className="text-[0.875rem] text-muted-foreground">
                      {e.when}
                      {e.note ? ` · ${e.note}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="surface h-full p-6 sm:p-7">
            <p className="kicker">outside class</p>
            <ul className="mt-5 grid gap-4">
              {ACTIVITIES.map((a) => (
                <li key={a.name} className="flex items-center gap-4">
                  <Logo src={a.logo} name={a.name} />
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-[0.875rem] text-muted-foreground">{a.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── Moments ───────── */

export function Moments() {
  return (
    <Section id="moments" index="05" title="in the room" aside="conferences, pitches and outreach" className="border-t border-border">
      <Reveal>
        <PhotoWall />
      </Reveal>
    </Section>
  );
}

/* ───────── Reading ───────── */

export function Reading() {
  return (
    <Section id="reading" index="06" title="reading" aside="books i keep going back to" className="border-t border-border">
      <ul className="grid max-w-3xl grid-cols-3 gap-4 sm:gap-8">
        {BOOKS.map((book, i) => (
          <Reveal as="li" key={book.id} delay={i * 0.06}>
            <BookCover book={book} className="overflow-hidden rounded-md shadow-[0_20px_40px_-24px_rgb(0_0_0/0.6)]" />
            <div className="h-[7.5rem]">
              <HangingTools tools={book.tools} size={30} align="center" />
            </div>
            <p className="text-[0.9375rem] leading-snug font-semibold">{book.title}</p>
            <p className="text-[0.8125rem] text-muted-foreground">{book.author}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* ───────── Contact ───────── */

export function Contact() {
  const openCv = useCv();
  return (
    <section id="contact" className="container-x pb-20">
      <Reveal>
        <div className="surface overflow-hidden">
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <p className="kicker">07 — contact</p>
              <h2 className="mt-4 text-[clamp(2.25rem,1.4rem+3vw,3.75rem)] leading-[1] font-semibold">
                building something with physical data?
                <span className="block text-muted-foreground">let's talk.</span>
              </h2>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href={`mailto:${PROFILE.email}`} className="btn btn-accent">
                  <Mail className="size-4" /> email me
                </a>
                <a href={PROFILE.github} target="_blank" rel="noopener" className="btn btn-ghost">
                  <GithubMark className="size-4" /> GitHub
                </a>
                <button type="button" onClick={openCv} className="btn btn-ghost">
                  <FileText className="size-4" /> CV
                </button>
              </div>
            </div>
            <div className="flex min-w-0 flex-col items-center gap-3 lg:items-end">
              <ContactCard />
              <p className="text-[0.8125rem] text-muted-foreground">tap the card for my details · references on request</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const CONTOURS = Array.from({ length: 16 }, (_, i) => 70 + i * 26);
const at = PROFILE.email.indexOf("@");
const MASKED_EMAIL = PROFILE.email[0] + "•".repeat(at - 1) + PROFILE.email.slice(at);
// Keep the country code and last three digits, mask the rest digit for digit.
const MASKED_PHONE = PROFILE.phone.replace(/\d/g, (d, i) => (i < 4 || i >= PROFILE.phone.length - 3 ? d : "•"));

/** The contact card: name peeks out of the purse, details are on the card once it's opened. */
function ContactCard() {
  return (
    <CardFolder
      title={`contact card for ${PROFILE.name}`}
      className="w-[26rem]"
      fields={[{ label: "Phone", value: PROFILE.phone, masked: MASKED_PHONE }]}
      secret={{ label: "Email", value: PROFILE.email, masked: MASKED_EMAIL }}
      card={<ContactArtwork />}
      details={<ContactDetails />}
    />
  );
}

function ContactArtwork() {
  return (
    <span className="relative block size-full overflow-hidden bg-[linear-gradient(135deg,#1f3b38_0%,#122422_48%,#0a1312_100%)] text-white">
      <svg aria-hidden viewBox="0 0 640 404" className="absolute inset-0 size-full">
        {CONTOURS.map((r, i) => (
          <circle key={r} cx="660" cy="-30" r={r} fill="none" stroke="currentColor" strokeOpacity={0.22 - i * 0.011} strokeWidth="1.5" />
        ))}
      </svg>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_12%_6%,rgb(45_212_191/0.16),transparent_40%)]" />
      <span className="absolute top-[8%] left-[6%] flex flex-col gap-1">
        <span className="font-display text-[1.0625rem] leading-tight font-semibold tracking-[-0.02em]">{PROFILE.name}</span>
        <span className="text-[10px] font-medium tracking-[0.2em] text-white/55 uppercase">{PROFILE.role}</span>
      </span>
      <span className="absolute top-[8%] right-[6%] hidden items-center gap-1.5 font-display sm:flex text-sm font-semibold text-white/80">
        DTA <span className="block size-2 rotate-45 rounded-[2px] bg-[#2dd4bf]" />
      </span>
    </span>
  );
}

function ContactDetails() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked; the mailto link still works */
    }
  };
  const link =
    "truncate rounded-sm text-white/90 underline-offset-2 outline-none hover:text-[#5eead4] hover:underline focus-visible:ring-2 focus-visible:ring-[#2dd4bf]";
  return (
    <div className="absolute inset-x-[6%] bottom-[7%] flex flex-col gap-1.5 text-[0.6875rem] text-white sm:gap-2 sm:text-[0.8125rem]">
      <span className="flex min-w-0 items-center gap-2">
        <Mail aria-hidden className="size-3.5 shrink-0 text-white/45" />
        <a href={`mailto:${PROFILE.email}`} className={link}>
          {PROFILE.email}
        </a>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Email copied" : "Copy email"}
          className="-my-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-white/55 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#2dd4bf]"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </span>
      <span className="flex min-w-0 items-center gap-2">
        <Phone aria-hidden className="size-3.5 shrink-0 text-white/45" />
        <a href={PROFILE.phoneHref} className={link}>
          {PROFILE.phone}
        </a>
      </span>
      <span className="flex min-w-0 items-center gap-4 pl-[1.375rem]">
        {[
          { href: PROFILE.github, text: "GitHub" },
          { href: PROFILE.linkedin, text: "LinkedIn" },
        ].map((l) => (
          <a key={l.text} href={l.href} target="_blank" rel="noopener" className={cn(link, "inline-flex items-center gap-0.5")}>
            {l.text} <ArrowUpRight aria-hidden className="size-3 text-white/45" />
          </a>
        ))}
      </span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="container-x flex flex-wrap items-center justify-between gap-3 border-t border-border py-8 font-mono text-[0.75rem] text-muted-foreground">
      <span>
        © {new Date().getFullYear()} {PROFILE.name}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MapPin className="size-3.5" /> {PROFILE.location}
      </span>
      <a href={PROFILE.github} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:text-foreground">
        <GithubMark className="size-3.5" /> Calibre-sys
      </a>
    </footer>
  );
}

/** An organisation's logo, shown as-is; marks with a baked-in background get a light tile, missing logos fall back to initials. */
function Logo({ src, name, wide }: { src?: string; name: string; wide?: boolean }) {
  const initials = name
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .filter((w) => w && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  const bare = src && (src.includes("knust") || src.includes("soh"));
  return (
    <span
      className={cn(
        "flex h-11 shrink-0 items-center justify-center overflow-hidden",
        wide ? "w-24" : "w-11",
        bare
          ? ""
          : src
            ? cn("rounded-lg border border-border", src.includes("datacamp") ? "" : "bg-white p-1", wide && "px-2")
            : "rounded-lg border border-border bg-card-2",
      )}
    >
      {src ? (
        <img src={src} alt={`${name} logo`} loading="lazy" className="max-h-full max-w-full object-contain" />
      ) : (
        <span aria-hidden className="font-display text-[0.9375rem] font-semibold text-muted-foreground">
          {initials}
        </span>
      )}
    </span>
  );
}
