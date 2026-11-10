import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Download, FileText, Mail, Play } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ArcPicker } from "@/components/motion/arc-picker";
import { Card } from "@/components/motion/card";
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
  INTERESTS,
  ME_AS_AUTHOR,
  MOMENTS,
  PAPERS,
  PROFILE,
  PROJECTS,
  REFERENCES,
  type CollectionId,
  type Entry,
  type Paper,
  type Project,
} from "@/data";
import { cn } from "@/lib/utils";
import { BookCover } from "./book-cover";
import { FlowUnitLab } from "./flow-unit-lab";
import { PhotoStack } from "./photo-stack";
import { HangingTools } from "./tools";
import { Reveal, Section } from "./kit";

const EASE = [0.16, 1, 0.3, 1] as const;
const NAV = [
  { href: "/#publications", label: "Publications" },
  { href: "/#work", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#credentials", label: "Certifications" },
  { href: "/#contact", label: "Contact" },
];

function useCv() {
  const view = useViewer();
  return () => view({ title: `CV · ${PROFILE.name}`, items: [{ src: PROFILE.cv }] });
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
    <header className={cn("sticky top-0 z-40 bg-background transition-shadow", scrolled && "shadow-[0_1px_0_var(--border)]")}>
      <div className="container-x flex h-16 items-center gap-6">
        <a href="/" className="mr-auto font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">
          Deon Takyi-Amponsem
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-6 text-[0.9375rem] text-muted-foreground md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <ThemeToggle variant="circle-blur" start="top-right" className="size-9 rounded-lg text-muted-foreground hover:bg-card-2 hover:text-foreground" iconClassName="size-4" />
        <button type="button" onClick={openCv} className="btn h-9 px-3.5 text-[0.875rem]">
          <FileText className="size-4" /> CV
        </button>
      </div>
    </header>
  );
}

/* ───────── Hero ───────── */

export function Hero() {
  const reduce = useReducedMotion();
  const openCv = useCv();
  const rise = (i: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: 0.05 + i * 0.08 } };

  return (
    <section id="top" className="container-x pt-10 pb-16 sm:pt-20 sm:pb-24">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div
          className="lg:order-2 lg:col-span-5"
          initial={reduce ? false : { opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        >
          <PhotoStack />
        </motion.div>

        <div className="lg:order-1 lg:col-span-7">
          <motion.p {...rise(0)} className="flex items-center gap-2 text-[0.9375rem] text-muted-foreground">
            <span className="size-2 rounded-full bg-accent" aria-hidden />
            Open to ML engineering and research roles
          </motion.p>
          <motion.h1 {...rise(1)} className="mt-5 text-[clamp(2.6rem,1.6rem+4.4vw,4.75rem)] leading-[0.98] font-semibold">
            Hi, I'm Deon.
          </motion.h1>
          <motion.p {...rise(2)} className="mt-6 max-w-[56ch] text-[1.1875rem] leading-relaxed text-muted-foreground">
            I'm a <span className="text-foreground">petroleum engineer</span> who builds machine learning tools. Most of my work is AI
            for the energy sector: models that read rock and well data, and the software that lets engineers use them. My research
            is published in the <span className="text-foreground">Journal of Applied Geophysics</span>.
          </motion.p>
          <motion.div {...rise(3)} className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="btn">
              See my projects
            </a>
            <button type="button" onClick={openCv} className="btn btn-ghost">
              <FileText className="size-4" /> Read CV
            </button>
          </motion.div>
          <motion.p {...rise(4)} className="mt-10 text-[0.9375rem] text-muted-foreground">
            Right now: ML research at the AI-DPRS Lab, KNUST, and national service at SOH Energy · {PROFILE.location}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* ───────── Publications ───────── */

export function Publications() {
  return (
    <Section
      id="publications"
      title="Publications"
      aside={<span>Interests: {INTERESTS.join(" · ")}</span>}
      className="border-t border-border"
    >
      <ol className="grid gap-4">
        {PAPERS.map((paper, i) => (
          <Reveal as="li" key={paper.id} delay={i * 0.06}>
            <PaperRow paper={paper} />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function PaperRow({ paper }: { paper: Paper }) {
  const view = useViewer();
  return (
    <Card className="gap-0 py-0">
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[4.5rem_1fr_12rem]">
        <p className="font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-muted-foreground">{paper.year}</p>
        <div className="min-w-0">
          <h3 className="font-sans text-[1.1875rem] leading-snug font-semibold tracking-normal">
            <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener" className="hover:text-accent">
              {paper.title}
            </a>
          </h3>
          <p className="mt-2 text-[0.875rem] text-muted-foreground">
            {paper.authors.map((a, j) => (
              <span key={a}>
                <span className={a === ME_AS_AUTHOR ? "font-semibold text-foreground" : undefined}>{a}</span>
                {j < paper.authors.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
          <p className="mt-1 text-[0.875rem]">
            <span className="font-semibold">{paper.venue}</span>
            <span className="text-muted-foreground"> · {paper.detail}</span>
          </p>
          <p className="mt-4 max-w-[70ch] leading-relaxed text-muted-foreground">{paper.summary}</p>
          <p className="mt-3 text-[0.875rem] text-muted-foreground">
            <span className="text-foreground">Methods:</span> {paper.methods.join(", ")}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9375rem]">
            <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener" className="link inline-flex items-center gap-1">
              DOI <ArrowUpRight className="size-3.5" />
            </a>
            <CopyCitation paper={paper} />
            <button
              type="button"
              className="link"
              onClick={() => view({ title: paper.title, items: [{ src: paper.screenshot, caption: `${paper.venue} · ${paper.detail}` }] })}
            >
              Publisher page
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          {paper.cover ? (
            <img src={paper.cover} alt={`${paper.venue} cover`} loading="lazy" className="w-full rounded-md" />
          ) : (
            <div className="flex aspect-[3/4] w-full flex-col justify-between rounded-md bg-card-2 p-3">
              <img src="/logos/spe.png" alt="SPE" className="w-full rounded-sm bg-white p-1.5" />
              <span className="font-display text-[1.25rem] leading-tight font-semibold">ATC 2026</span>
              <span className="text-[0.75rem] leading-snug text-muted-foreground">Africa Technology Conference, Abidjan</span>
            </div>
          )}
          <HangingTools tools={paper.tools} size={28} align="center" className="-mx-3" />
        </div>
        <HangingTools tools={paper.tools} size={28} align="start" rod className="max-w-[17rem] md:hidden" />
      </div>
    </Card>
  );
}

function CopyCitation({ paper }: { paper: Paper }) {
  const [copied, setCopied] = useState(false);
  const text = `${paper.authors.join(", ")} (${paper.year}). ${paper.title}. ${paper.venue}. https://doi.org/${paper.doi}`;
  return (
    <button
      type="button"
      className="link inline-flex items-center gap-1"
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
      {copied ? "Copied" : "Cite"}
    </button>
  );
}

/* ───────── Work (bento) ───────── */

export function Work() {
  const byId = (id: string) => PROJECTS.find((p) => p.id === id)!;
  return (
    <Section id="work" title="Projects" aside="Private builds are shown as screen recordings." className="border-t border-border">
      <div className="grid gap-4 lg:grid-cols-6">
        <Reveal className="lg:col-span-6">
          <ProjectCard project={byId("reschar")} wide />
        </Reveal>
        <Reveal className="lg:col-span-6">
          <ProjectCard project={byId("fortell")} wide />
        </Reveal>
        <Reveal className="lg:col-span-6">
          <Card className="gap-5 p-4 py-5 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[0.875rem] text-muted-foreground">Try it · From the 2025 paper</p>
                <h3 className="mt-1 text-[1.5rem] leading-tight font-semibold">Flow zone indicator</h3>
              </div>
              <p className="max-w-[44ch] text-[0.9375rem] text-muted-foreground">
                Set a rock sample's porosity and permeability to see which flow unit it falls in. Uses RQI = 0.0314·√(k/φ),
                φz = φ/(1−φ) and FZI = RQI/φz.
              </p>
            </div>
            <FlowUnitLab />
          </Card>
        </Reveal>
        <Reveal className="lg:col-span-6">
          <ProjectCard project={byId("soh")} wide />
        </Reveal>
      </div>

      <Reveal className="mt-16 mb-6">
        <h3 className="text-[1.5rem] font-semibold">All projects</h3>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-2">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.06}>
            <CollectionCard id={c.id} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project, wide }: { project: Project; wide?: boolean }) {
  const view = useViewer();
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const play = () => {
    if (!reduce) void video.current?.play().catch(() => {});
  };
  const pause = () => video.current?.pause();

  return (
    <Card
      interactive={Boolean(project.video)}
      className={cn("h-full gap-0 overflow-hidden py-0", wide && "lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]")}
      onPointerEnter={play}
      onPointerLeave={pause}
    >
      <div className={cn("relative overflow-hidden bg-card-2", wide ? "aspect-[16/9] lg:aspect-auto lg:min-h-[22rem]" : "aspect-[16/10]")}>
        {project.video ? (
          <>
            <video ref={video} src={project.video} poster={project.poster} muted loop playsInline preload="none" className="size-full bg-black object-cover" />
            <button
              type="button"
              onClick={() => view({ title: `${project.name} · demo`, items: [{ src: project.video! }], download: false })}
              className="absolute inset-0 flex items-end p-4 after:absolute after:inset-0"
              aria-label={`Play the ${project.name} demo`}
            >
              <span className="relative z-10 inline-flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1.5 text-[0.8125rem] font-medium">
                <Play className="size-3.5 fill-current" /> Demo
              </span>
            </button>
          </>
        ) : null}
      </div>
      <div className={cn("relative flex flex-1 flex-col gap-3 p-6", wide && "lg:p-8")}>
        {/* The tools hang from the edge of the demo above. */}
        <HangingTools tools={project.tools} size={34} className="absolute top-0 right-3 z-20" />
        <div style={{ paddingRight: project.tools.length * 61 + 8 }}>
          <h3 className="text-[1.375rem] leading-tight font-semibold">{project.name}</h3>
          <p className="mt-1 text-[0.8125rem] text-muted-foreground">{project.kind}</p>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener" className="link relative z-10 mt-1 inline-flex items-center gap-1 text-[0.875rem]">
              {project.link.replace(/^https?:\/\/(www\.)?/, "")} <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
        <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{project.blurb}</p>
        {project.result && <p className="text-[0.9375rem] font-medium text-accent">{project.result}</p>}
        <p className="mt-auto pt-2 text-[0.8125rem] text-muted-foreground">
          {project.stack.join(" · ")}
          {project.private ? " · Private build" : ""}
        </p>
      </div>
    </Card>
  );
}

/* ───────── Project collections ───────── */

function CollectionCard({ id }: { id: CollectionId }) {
  const c = COLLECTIONS.find((x) => x.id === id)!;
  const entries = ENTRIES.filter((e) => e.collection === id);
  return (
    <Card interactive className="relative h-full gap-4 p-6 py-6 sm:p-8">
      <p className="text-[0.875rem] text-muted-foreground">
        {c.label} · {entries.length} projects
      </p>
      <h4 className="font-display text-[1.375rem] leading-tight font-semibold tracking-[-0.02em]">
        <a href={c.path} className="after:absolute after:inset-0 hover:text-accent">
          {c.title}
        </a>
      </h4>
      <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{c.note}</p>
      <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-[0.875rem]">
        {entries.slice(0, 4).map((e) => (
          <span key={e.id}>{e.title}</span>
        ))}
      </p>
      <span className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent">
        See all <ArrowRight className="size-4" />
      </span>
    </Card>
  );
}

/** A subpage listing every project in one collection. */
export function ProjectsPage({ id }: { id: CollectionId }) {
  const c = COLLECTIONS.find((x) => x.id === id)!;
  const other = COLLECTIONS.find((x) => x.id !== id)!;
  const entries = ENTRIES.filter((e) => e.collection === id);
  return (
    <>
      <section className="container-x pt-10 pb-10 sm:pt-16">
        <a href="/#work" className="link inline-flex items-center gap-1.5 text-[0.9375rem]">
          <ArrowLeft className="size-4" /> Back home
        </a>
        <h1 className="mt-6 text-[clamp(2.2rem,1.5rem+3vw,3.5rem)] leading-[1.02] font-semibold">{c.title}</h1>
        <p className="mt-5 max-w-[62ch] text-[1.125rem] leading-relaxed text-muted-foreground">{c.intro}</p>
      </section>
      <section className="container-x pb-16">
        <ol className="grid gap-4">
          {entries.map((e, i) => (
            <Reveal as="li" key={e.id} delay={i * 0.04}>
              <EntryRow entry={e} />
            </Reveal>
          ))}
        </ol>
      </section>
      <section className="container-x pb-20">
        <Reveal>
          <p className="mb-4 text-[0.9375rem] text-muted-foreground">Keep looking</p>
          <div className="max-w-xl">
            <CollectionCard id={other.id} />
          </div>
        </Reveal>
      </section>
    </>
  );
}

function EntryRow({ entry }: { entry: Entry }) {
  return (
    <Card className="gap-0 py-0">
      <div className="grid gap-4 p-6 sm:p-8 md:grid-cols-[4.5rem_1fr_auto] md:gap-6">
        <p className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-muted-foreground">{entry.year}</p>
        <div className="min-w-0">
          <h2 className="font-sans text-[1.25rem] leading-snug font-semibold tracking-normal">{entry.title}</h2>
          <p className="mt-3 max-w-[70ch] leading-relaxed text-muted-foreground">{entry.summary}</p>
          <p className="mt-3 text-[0.875rem] text-muted-foreground">
            <span className="text-foreground">Methods:</span> {entry.methods.join(", ")}
          </p>
          {entry.links && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
              {entry.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" className="link inline-flex items-center gap-1">
                  {l.label} <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          )}
        </div>
        <HangingTools tools={entry.tools} rod size={30} align="center" className="w-fit min-w-[8rem]" />
      </div>
    </Card>
  );
}

/* ───────── Experience ───────── */

export function Experience() {
  return (
    <Section id="experience" title="Experience" className="border-t border-border">
      <ol className="grid gap-10">
        {EXPERIENCE.map((job, i) => (
          <Reveal as="li" key={job.org} delay={i * 0.05} className="grid gap-2 md:grid-cols-[12rem_1fr_auto] md:gap-10">
            <p className="text-[0.9375rem] text-muted-foreground">{job.when}</p>
            <div>
              <div className="flex items-center gap-4">
                <Logo src={job.logo} name={job.org} />
                <div>
                  <h3 className="font-sans text-[1.1875rem] font-semibold tracking-normal">{job.org}</h3>
                  <p className="text-muted-foreground">{job.role}</p>
                </div>
              </div>
              <ul className="mt-4 grid max-w-[72ch] gap-2">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[0.9875rem]">
                    <span aria-hidden className="mt-[0.65em] size-1 shrink-0 rounded-full bg-muted-foreground" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <HangingTools tools={job.tools} rod size={34} align="center" className="mt-4 w-fit min-w-[8rem] md:mt-1" />
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
    <Section id="credentials" title="Certifications" aside="DataCamp × 4 · 365 Data Science × 3" className="border-t border-border">
      <Reveal>
        <Card className="gap-0 overflow-hidden py-0">
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
                  className="block w-full overflow-hidden rounded-lg bg-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <img src={cert.preview} alt="" className="block h-auto w-full" />
                </motion.button>
              </AnimatePresence>
              {/* Tools from this course hang from the certificate. */}
              <div className={cert.tools.length ? "h-[7.75rem]" : "h-5"}>
                <HangingTools key={cert.id} tools={cert.tools} size={32} align="center" />
              </div>
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="flex items-center gap-4">
                  <Logo src={cert.issuer === "DataCamp" ? "/logos/datacamp.png" : "/logos/365-data-science.png"} name={cert.issuer} wide={cert.issuer !== "DataCamp"} />
                  <div>
                  <p className="font-semibold">{cert.title}</p>
                  <p className="text-[0.9375rem] text-muted-foreground">
                    {cert.issuer} · {cert.date}
                    {cert.length ? ` · ${cert.length}` : ""} · ID {cert.credential}
                  </p>
                  </div>
                </div>
                <a href={cert.pdf} download className="link inline-flex items-center gap-1.5 text-[0.9375rem]">
                  <Download className="size-4" /> PDF
                </a>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Reveal>
          <Card className="h-full gap-5 p-6 py-6">
            <h3 className="text-[1.375rem] font-semibold">Education</h3>
            <ul className="grid gap-5">
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
          </Card>
        </Reveal>
        <Reveal delay={0.05}>
          <Card className="h-full gap-5 p-6 py-6">
            <h3 className="text-[1.375rem] font-semibold">Activities</h3>
            <ul className="grid gap-4">
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
          </Card>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-2 lg:col-span-1">
          <Card className="h-full gap-3 p-3 py-3">
            <div className="grid grid-cols-2 gap-2">
              {MOMENTS.map((m, i) => (
                <button
                  key={m.src}
                  type="button"
                  onClick={() => view({ title: "Events", items: MOMENTS.map((x) => ({ src: x.src, caption: x.caption })), start: i, download: false })}
                  className="group overflow-hidden rounded-md"
                  aria-label={`Open photo: ${m.caption}`}
                >
                  <img src={m.src} alt={m.caption} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </button>
              ))}
            </div>
            <p className="px-1 pb-1 text-[0.8125rem] text-muted-foreground">SPE ATC 2026 · Building Bytes · Energy4me</p>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── Reading ───────── */

export function Reading() {
  return (
    <Section id="reading" title="Reading" aside="Books that shaped how I work" className="border-t border-border">
      <ul className="grid max-w-3xl grid-cols-3 gap-4 sm:gap-8">
        {BOOKS.map((book, i) => (
          <Reveal as="li" key={book.id} delay={i * 0.06}>
            <BookCover book={book} className="overflow-hidden rounded-md" />
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
        <Card className="gap-0 overflow-hidden py-0">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <h2 className="section-title">Get in touch</h2>
              <p className="mt-4 max-w-[48ch] text-[1.0625rem] text-muted-foreground">
                I'm looking for machine learning engineering and research roles. If you're working on ML for energy or other
                physical systems, I'd like to hear about it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${PROFILE.email}`} className="btn">
                  <Mail className="size-4" /> Email
                </a>
                <button type="button" onClick={openCv} className="btn btn-ghost">
                  <FileText className="size-4" /> CV
                </button>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-[0.9375rem]">
              <Row label="Email">
                <a href={`mailto:${PROFILE.email}`} className="link break-all">
                  {PROFILE.email}
                </a>
              </Row>
              <Row label="Phone">
                <a href={PROFILE.phoneHref} className="link">
                  {PROFILE.phone}
                </a>
              </Row>
              <Row label="GitHub">
                <a href={PROFILE.github} target="_blank" rel="noopener" className="link">
                  Calibre-sys
                </a>
              </Row>
              <Row label="LinkedIn">
                <a href={PROFILE.linkedin} target="_blank" rel="noopener" className="link">
                  Deon Takyi-Amponsem
                </a>
              </Row>
              <Row label="References">
                <span className="text-muted-foreground">{REFERENCES.map((r) => r.name).join(", ")} · on request</span>
              </Row>
            </dl>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={label === "References" ? "col-span-2" : undefined}>
      <dt className="text-[0.8125rem] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="container-x flex flex-wrap items-center justify-between gap-3 border-t border-border py-8 text-[0.875rem] text-muted-foreground">
      <span>© {new Date().getFullYear()} {PROFILE.name}</span>
      <span>{PROFILE.location}</span>
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
  // Transparent marks sit directly on the page; others keep a tile so their own background doesn't look clipped.
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
