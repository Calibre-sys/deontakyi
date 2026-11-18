import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Download, FileText, Mail, MapPin, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
  type Paper,
  type Project,
} from "@/data";
import { cn } from "@/lib/utils";
import { BookCover } from "./book-cover";
import { CaseVideo, OutreachReplay, RecruiterFlow, WindowFrame } from "./case-visuals";
import { LiveDemo } from "./live-demo";
import { Murmuration } from "./murmuration";
import { PhotoStack } from "./photo-stack";
import { HangingTools } from "./tools";
import { ProjectVisual } from "./visuals";
import { PhotoWall } from "./photo-wall";
import { Reveal, Section } from "./kit";
import { WorkMap } from "./work-map";

const EASE = [0.16, 1, 0.3, 1] as const;
const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#research", label: "Research" },
  { href: "/#experience", label: "Experience" },
  { href: "/#credentials", label: "Certifications" },
  { href: "/#contact", label: "Contact" },
];

/** Twelve columns inside the container, one gap. */
const GRID = "grid gap-x-[var(--gap-columns)] lg:grid-cols-12";

function useCv() {
  const view = useViewer();
  return () => view({ title: `CV, ${PROFILE.name}`, items: [{ src: PROFILE.cv }] });
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
        "sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300",
        scrolled ? "border-border bg-background" : "border-transparent bg-background",
      )}
    >
      <div className="container-x flex h-16 items-center gap-4">
        <a href="/" className="mr-auto flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-[0.6875rem] font-semibold text-background" data-no-scramble>
            DT
          </span>
          <span className="hidden text-[0.9375rem] font-semibold tracking-[-0.02em] sm:inline">Deon Takyi-Amponsem</span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="rounded-md px-3 py-1.5 text-[0.875rem] text-muted-foreground transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card-2 hover:text-foreground"
        >
          <GithubMark className="size-[1.125rem]" />
        </a>
        <ThemeToggle variant="circle-blur" start="top-right" className="size-9 rounded-lg text-muted-foreground hover:bg-card-2 hover:text-foreground" iconClassName="size-4" />
        <button type="button" onClick={openCv} className="btn h-9 px-3.5 text-[0.875rem]">
          CV
        </button>
      </div>
    </header>
  );
}

/* ───────── Hero: the field above, the name resting at its base ───────── */

export function Hero() {
  const openCv = useCv();
  return (
    <section id="top" className="relative flex min-h-[calc(100svh-var(--nav-h))] flex-col">
      <div className="relative min-h-[15rem] flex-1 overflow-hidden" aria-hidden>
        <Murmuration />
      </div>
      <div className="container-x pb-12 lg:pb-14">
        <div className={cn(GRID, "gap-y-8 border-t border-border pt-7 lg:items-end")}>
          <h1 className="max-w-none text-display leading-[0.9] tracking-[-0.04em] lg:col-span-8">
            Hi, I’m Deon.
            <span className="mt-4 block max-w-[19ch] text-display-s leading-[1.02] tracking-[-0.03em] text-ink-2">
              I build software for subsurface data.
            </span>
          </h1>
          <div className="lg:col-span-4">
            <p className="max-w-[38ch] text-lead leading-[1.45] text-ink-2">
              Petroleum engineer in {PROFILE.location}, and a self-taught developer. I use machine learning on rocks, wells and reservoirs, and turn it into tools people use.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#work" className="btn">
                See the work
              </a>
              <a href={PROFILE.github} target="_blank" rel="noopener" className="btn btn-ghost">
                <GithubMark className="size-4" /> GitHub
              </a>
              <button type="button" onClick={openCv} className="btn btn-ghost">
                <FileText className="size-4" /> CV
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Where: the prints, the school, the work outside class ───────── */

export function About() {
  return (
    <section id="about" className="py-[calc(var(--section-gap-l)/2)]">
      <div className={cn("container-x", GRID, "gap-y-16 lg:items-center")}>
        <div className="mx-auto w-full max-w-[30rem] lg:col-span-5 lg:max-w-none">
          <PhotoStack />
        </div>
        <div className="min-w-0 lg:col-span-6 lg:col-start-7">
          <h2 className="section-title">{PROFILE.location}</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <h3 className="border-b border-border pb-3 text-[1.125rem]">School</h3>
              <ul className="divide-y divide-border">
                {EDUCATION.map((e) => (
                  <li key={e.org} className="flex gap-4 py-4">
                    <Logo src={e.logo} name={e.org} />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{e.org}</p>
                      <p className="text-[0.9375rem]">{e.role}</p>
                      <p className="text-[0.875rem] text-muted-foreground">
                        {e.when}
                        {e.note ? `. ${e.note}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="border-b border-border pb-3 text-[1.125rem]">Outside class</h3>
              <ul className="divide-y divide-border">
                {ACTIVITIES.map((a) => (
                  <li key={a.name} className="flex items-center gap-4 py-3">
                    <Logo src={a.logo} name={a.name} />
                    <div className="min-w-0">
                      <p className="font-medium leading-snug text-foreground">{a.name}</p>
                      <p className="text-[0.875rem] text-muted-foreground">{a.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── The map: rocks and wells in, tools out ───────── */

export function MapSection() {
  return (
    <Section id="map" title="Rocks and wells in, tools out." className="pt-[calc(var(--section-gap-s)/2)]">
      <WorkMap />
    </Section>
  );
}

/* ───────── Work ───────── */

export function Work() {
  const lead = PROJECTS.find((p) => p.id === "reschar")!;
  const rest = PROJECTS.filter((p) => p.id !== "reschar");
  return (
    <Section id="work" title="Work">
      <LeadCase project={lead} />
      <Reveal id="demo" className="mt-20">
        <LiveDemo />
      </Reveal>
      <div className="mt-28 grid gap-x-[var(--gap-columns)] gap-y-24 md:grid-cols-2">
        {rest.map((p) => (
          <Case key={p.id} project={p} />
        ))}
      </div>
      <CollectionLinks />
    </Section>
  );
}

function CaseVisual({ project }: { project: Project }) {
  return (
    <WindowFrame title={project.address !== project.name ? project.address : undefined}>
      {project.video ? (
        <CaseVideo src={project.video} poster={project.poster} title={project.name} />
      ) : project.visual === "outreach" ? (
        <OutreachReplay />
      ) : (
        <RecruiterFlow />
      )}
    </WindowFrame>
  );
}

function CaseMeta({ project }: { project: Project }) {
  return (
    <p className="kicker mt-3">
      <time className="num">{project.year}</time>
      {project.private && <span className="ml-3">Private</span>}
    </p>
  );
}

function CaseLinks({ project }: { project: Project }) {
  if (!project.links) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[1rem]">
      {project.links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener" className="link inline-flex items-center gap-1 font-medium">
          {l.label} <ArrowUpRight className="size-4" />
        </a>
      ))}
    </div>
  );
}

function Outcome({ project }: { project: Project }) {
  if (!project.outcome) return null;
  return (
    <div className="mt-7 border-t border-border pt-5">
      <p className="num text-[clamp(2.5rem,1.8rem+2.4vw,3.75rem)] leading-none font-medium tracking-[-0.04em] text-foreground">{project.outcome.value}</p>
      <p className="mt-2 text-[0.9375rem] font-medium text-muted-foreground">{project.outcome.label}</p>
    </div>
  );
}

/** The lead case: the product on seven columns, the facts on four. */
function LeadCase({ project }: { project: Project }) {
  return (
    <article id={`case-${project.id}`} className={cn(GRID, "scroll-mt-24 gap-y-10 lg:items-center")}>
      <div className="min-w-0 lg:col-span-7">
        <CaseVisual project={project} />
      </div>
      <div className="min-w-0 lg:col-span-4 lg:col-start-9">
        <h3 className="text-display-s leading-[1] tracking-[-0.03em]">{project.name}</h3>
        <p className="mt-3 text-lead text-ink-2">{project.tagline}</p>
        <CaseMeta project={project} />
        <p className="mt-6 max-w-[52ch]">{project.built}</p>
        <CaseLinks project={project} />
        <HangingTools tools={project.tools} rod size={32} align="start" className="mt-6 w-fit min-w-[10rem]" />
      </div>
    </article>
  );
}

/** A case in the two-across grid: the product above, the facts beneath. */
function Case({ project }: { project: Project }) {
  return (
    <article id={`case-${project.id}`} className="flex min-w-0 scroll-mt-24 flex-col">
      <CaseVisual project={project} />
      <div className="mt-8">
        <h3 className="text-title tracking-[-0.02em] sm:text-[1.875rem]">{project.name}</h3>
        <p className="mt-2 text-[1.125rem] text-ink-2">{project.tagline}</p>
        <CaseMeta project={project} />
        <Outcome project={project} />
        <p className="mt-6 max-w-[56ch]">{project.built}</p>
        <CaseLinks project={project} />
        <HangingTools tools={project.tools} rod size={32} align="start" className="mt-6 w-fit min-w-[10rem]" />
      </div>
    </article>
  );
}

/* ───────── Research: the one ink band ───────── */

export function Publications() {
  return (
    <section id="research" className="band-ink py-[var(--section-gap-s)]">
      <div className="container-x">
        <div className={cn(GRID, "mb-4 gap-y-4 border-t border-band-line pt-6")}>
          <h2 className="section-title lg:col-span-6">Research</h2>
        </div>
        <ol>
          {PAPERS.map((paper) => (
            <li key={paper.id} id={`paper-${paper.id}`} className="scroll-mt-24 border-b border-band-line last:border-b-0">
              <PaperRow paper={paper} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PaperRow({ paper }: { paper: Paper }) {
  const view = useViewer();
  return (
    <article className={cn(GRID, "gap-y-8 py-12")}>
      <div className="lg:col-span-3">
        <p className="num text-[1.5rem] leading-none font-medium tracking-[-0.03em] text-band-text">{paper.year}</p>
        <p className="mt-3 text-[1rem] font-medium text-band-text">{paper.venue}</p>
        <p className="mt-1 text-[0.875rem] text-band-text-2">{paper.detail}</p>
      </div>
      <div className="min-w-0 lg:col-span-5">
        <h3 className="text-[1.375rem] leading-[1.3] tracking-[-0.015em] sm:text-[1.5rem]">
          <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener" className="decoration-accent underline-offset-4 hover:underline">
            {paper.title}
          </a>
        </h3>
        <p className="mt-4 text-[0.9375rem] leading-relaxed">
          {paper.authors.map((a, j) => (
            <Fragment key={a}>
              <span className={a === ME_AS_AUTHOR ? "font-semibold text-band-text" : undefined}>{a}</span>
              {j < paper.authors.length - 1 ? ", " : ""}
            </Fragment>
          ))}
        </p>
        <p className="mt-5 max-w-[60ch] text-band-text">{paper.summary}</p>
        <p className="mt-3 text-[0.9375rem]">{paper.methods.join(", ")}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 text-[1rem]">
          <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener" className="link inline-flex items-center gap-1 font-medium">
            Read the paper <ArrowUpRight className="size-4" />
          </a>
          <CopyCitation paper={paper} />
        </div>
      </div>
      <div className="min-w-0 lg:col-span-4">
        <button
          type="button"
          onClick={() => view({ title: paper.title, items: [{ src: paper.screenshot, caption: `${paper.venue}, ${paper.detail}` }] })}
          className="group block w-full text-left"
          aria-label={`Open the publisher page for ${paper.title}`}
        >
          <WindowFrame title={paper.venue}>
            <span className="relative block aspect-[16/10] bg-white">
              <img src={paper.screenshot} alt="" loading="lazy" className="size-full object-cover object-left-top" />
              {paper.cover && <img src={paper.cover} alt={`${paper.venue} cover`} loading="lazy" className="absolute right-3 bottom-3 w-[24%] rounded-sm shadow-lg ring-1 ring-black/10" />}
            </span>
          </WindowFrame>
        </button>
        <HangingTools tools={paper.tools} size={30} align="start" rod className="mt-2 max-w-[17rem]" />
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
      className="inline-flex min-h-11 items-center gap-1.5 font-sans text-band-text-2 transition-colors hover:text-band-text"
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
      {copied ? "Copied" : "Copy citation"}
    </button>
  );
}

/* ───────── Project collections ───────── */

function CollectionLinks() {
  return (
    <div className="mt-28">
      <h3 className="mb-6 text-title">More work</h3>
      <div className="grid gap-x-[var(--gap-columns)] gap-y-10 md:grid-cols-2">
        {COLLECTIONS.map((c) => {
          const entries = ENTRIES.filter((e) => e.collection === c.id);
          return (
            <a key={c.id} href={c.path} className="surface group flex min-w-0 flex-col p-6 transition-colors hover:border-border-strong sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-foreground">{c.title}</p>
                <ArrowRight className="size-5 shrink-0 self-center text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
              </div>
              <p className="kicker mt-1">
                <span className="num">{entries.length}</span> projects
              </p>
              <ul className="mt-6 border-t border-border">
                {entries.map((e) => (
                  <li key={e.id} className="flex items-baseline justify-between gap-4 border-b border-border py-3 text-[1rem] last:border-b-0">
                    <span className="min-w-0 truncate text-foreground">{e.title}</span>
                    <span className="num shrink-0 text-[0.875rem] text-muted-foreground">{e.year}</span>
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
      <section className="container-x pt-10 pb-14 sm:pt-16">
        <a href="/#work" className="inline-flex min-h-11 items-center gap-1.5 text-[1rem] font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back home
        </a>
        <div className="mt-8 border-t border-border pt-6">
          <h1 className="text-display-s leading-[1] tracking-[-0.03em]">{c.title}</h1>
          <p className="mt-4 max-w-[62ch] text-lead text-ink-2">{c.intro}</p>
        </div>
      </section>
      <section className="container-x pb-16">
        <ol className="grid gap-8">
          {entries.map((e) => (
            <Reveal as="li" key={e.id} className="min-w-0">
              <EntryRow entry={e} />
            </Reveal>
          ))}
        </ol>
      </section>
      <section className="container-x pb-24">
        <a href={other.path} className="surface group flex items-center justify-between gap-4 p-6 transition-colors hover:border-border-strong sm:p-8">
          <span className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground">{other.title}</span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </a>
      </section>
    </>
  );
}

function EntryRow({ entry }: { entry: Entry }) {
  return (
    <article className="surface min-w-0 p-6 sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:gap-10">
        <div className="min-w-0">
          <h2 className="text-title tracking-[-0.02em] sm:text-[1.75rem]">{entry.title}</h2>
          <p className="kicker mt-1">
            <time className="num">{entry.year}</time>
          </p>
          <p className="mt-3 max-w-[68ch] text-ink-2">{entry.summary}</p>
          <p className="mt-3 text-[0.9375rem] text-muted-foreground">{entry.methods.join(", ")}</p>
          {entry.links && (
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[1rem]">
              {entry.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" download={l.download || undefined} className="link inline-flex items-center gap-1 font-medium">
                  {l.label} {l.download ? <Download className="size-4" /> : <ArrowUpRight className="size-4" />}
                </a>
              ))}
            </div>
          )}
          {entry.visual && (
            <div className="mt-8 max-w-[44rem]">
              <ProjectVisual kind={entry.visual} />
            </div>
          )}
        </div>
        <HangingTools tools={entry.tools} rod size={30} align="center" className="w-fit min-w-[8rem]" />
      </div>
    </article>
  );
}

/* ───────── Experience: the record, as a table ───────── */

export function Experience() {
  return (
    <Section id="experience" title="Experience" className="pt-[calc(var(--section-gap-l)/2)]">
      <ol className="border-b border-border">
        {EXPERIENCE.map((job, i) => (
          <li key={job.org} className={cn(GRID, "gap-y-5 py-10", i > 0 && "border-t border-border")}>
            <div className="flex items-center gap-4 lg:col-span-3 lg:block">
              <Logo src={job.logo} name={job.org} />
              <p className="kicker lg:mt-4">{job.when}</p>
            </div>
            <div className="min-w-0 lg:col-span-6">
              <h3 className="text-title tracking-[-0.02em]">{job.org}</h3>
              <p className="mt-1 text-[1.0625rem] text-muted-foreground">{job.role}</p>
              <ul className="mt-5 grid max-w-[66ch] list-disc gap-2 pl-5 marker:text-border-strong">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <HangingTools tools={job.tools} rod size={32} align="center" className="w-fit min-w-[8rem] lg:col-span-3 lg:justify-self-end" />
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ───────── Certifications, then the reading shelf ───────── */

export function Credentials() {
  const [current, setCurrent] = useState(CERTS[2].id);
  const view = useViewer();
  const cert = CERTS.find((c) => c.id === current)!;
  const index = CERTS.indexOf(cert);
  const openCert = () =>
    view({ title: "Certificates", items: CERTS.map((c) => ({ src: c.preview, file: c.pdf, caption: `${c.title}, ${c.issuer}, ${c.date}` })), start: index });

  return (
    <Section id="credentials" title="Certifications">
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
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-t border-border pt-5">
              <div className="flex items-center gap-4">
                <Logo src={cert.issuer === "DataCamp" ? "/logos/datacamp.png" : "/logos/365-data-science.png"} name={cert.issuer} wide={cert.issuer !== "DataCamp"} />
                <div>
                  <p className="font-display font-semibold text-foreground">{cert.title}</p>
                  <p className="text-[0.9375rem] text-muted-foreground">
                    {cert.issuer}, {cert.date}
                    {cert.length ? `, ${cert.length}` : ""}
                  </p>
                  <p className="mt-0.5 text-[0.875rem] text-muted-foreground">
                    Credential <span className="num">{cert.credential}</span>
                  </p>
                </div>
              </div>
              <a href={cert.pdf} download className="link inline-flex min-h-11 items-center gap-1.5 text-[1rem] font-medium">
                <Download className="size-4" /> PDF
              </a>
            </div>
          </div>
        </div>
      </div>
      <Reading />
    </Section>
  );
}

/* ───────── Reading ───────── */

export function Reading() {
  return (
    <div id="reading" className={cn(GRID, "mt-28 scroll-mt-24 gap-y-10")}>
      <h3 className="text-title lg:col-span-3">Reading</h3>
      <ul className="grid grid-cols-3 gap-x-4 sm:gap-x-[var(--gap-columns)] lg:col-span-7 lg:col-start-6">
        {BOOKS.map((book) => (
          <li key={book.id} className="min-w-0">
            <BookCover book={book} className="overflow-hidden rounded-md shadow-book" />
            <div className="h-[7.5rem]">
              <HangingTools tools={book.tools} size={30} align="center" />
            </div>
            <p className="font-display text-[1rem] leading-snug font-semibold text-foreground">{book.title}</p>
            <p className="text-[0.875rem] text-muted-foreground">{book.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── Photos ───────── */

export function Moments() {
  return (
    <Section id="moments" title="Photos">
      <PhotoWall />
    </Section>
  );
}

/* ───────── Contact: the letter's close ───────── */

export function Contact() {
  const openCv = useCv();
  return (
    <div id="contact" className={cn(GRID, "scroll-mt-24 gap-y-14 border-t border-border pt-8 lg:items-center")}>
      <div className="lg:col-span-6">
        <h2 className="text-display-s leading-[1] tracking-[-0.03em]">Say hi.</h2>
        <p className="mt-5 max-w-[40ch] text-lead text-ink-2">Email is the quickest way to reach me.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${PROFILE.email}`} className="btn">
            <Mail className="size-4" /> Email me
          </a>
          <a href={PROFILE.github} target="_blank" rel="noopener" className="btn btn-ghost">
            <GithubMark className="size-4" /> GitHub
          </a>
          <button type="button" onClick={openCv} className="btn btn-ghost">
            <FileText className="size-4" /> CV
          </button>
        </div>
      </div>
      <div className="flex min-w-0 flex-col items-center gap-3 lg:col-span-5 lg:col-start-8 lg:items-end">
        <ContactCard />
        <p className="text-[0.875rem] font-medium text-muted-foreground">Tap the card</p>
      </div>
    </div>
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
      className="w-[26rem] max-w-full"
      fields={[{ label: "Phone", value: PROFILE.phone, masked: MASKED_PHONE }]}
      secret={{ label: "Email", value: PROFILE.email, masked: MASKED_EMAIL }}
      card={<ContactArtwork />}
      details={<ContactDetails />}
    />
  );
}

function ContactArtwork() {
  return (
    <span className="contact-art relative block size-full overflow-hidden text-white">
      <svg aria-hidden viewBox="0 0 640 404" className="absolute inset-0 size-full">
        {CONTOURS.map((r, i) => (
          <circle key={r} cx="660" cy="-30" r={r} fill="none" stroke="currentColor" strokeOpacity={0.22 - i * 0.011} strokeWidth="1.5" />
        ))}
      </svg>
      <span className="contact-art-light absolute inset-0" />
      <span className="absolute top-[8%] left-[6%] flex flex-col gap-1">
        <span className="font-display text-[1.0625rem] leading-tight font-semibold tracking-[-0.02em]">{PROFILE.name}</span>
        <span className="text-[0.75rem] text-white/60">{PROFILE.role}</span>
      </span>
      <span className="absolute top-[8%] right-[6%] hidden items-center gap-1.5 font-display sm:flex text-sm font-semibold text-white/80">
        DTA <span className="block size-2 rotate-45 rounded-[2px] bg-signal" />
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
    "truncate rounded-sm text-white/90 underline-offset-2 outline-none hover:text-signal-soft hover:underline focus-visible:ring-2 focus-visible:ring-signal";
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
          className="-my-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-white/55 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-signal"
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

/* ───────── Footer: the close, then a colophon line ───────── */

export function Footer() {
  return (
    <footer className="border-t border-border pt-[var(--section-gap-s)]">
      <div className="container-x">
        <Contact />
        <div className="mt-[var(--section-gap-s)] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border py-8 text-[0.9375rem] text-muted-foreground">
          <span>
            © <span className="num">{new Date().getFullYear()}</span> {PROFILE.name}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {PROFILE.location}
          </span>
          <a href={PROFILE.github} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 hover:text-foreground">
            <GithubMark className="size-3.5" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

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
