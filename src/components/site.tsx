import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Download, FileText, Mail, MapPin, Phone } from "lucide-react";
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

const EASE = [0.16, 1, 0.3, 1] as const;
const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#research", label: "Research" },
  { href: "/#experience", label: "Experience" },
  { href: "/#credentials", label: "Certifications" },
  { href: "/#contact", label: "Contact" },
];

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
        scrolled ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent bg-transparent",
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

/* ───────── Hero ───────── */


export function Hero() {
  const reduce = useReducedMotion();
  const openCv = useCv();
  const rise = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: 0.05 + i * 0.08 } };

  return (
    <section id="top" className="relative">
      <Murmuration />
      <div className="container-x relative pt-12 pb-16 sm:pt-20 sm:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <motion.p {...rise(0)} className="text-[0.9375rem] text-muted-foreground">
              Petroleum engineer in {PROFILE.location}
            </motion.p>
            <motion.h1 {...rise(1)} className="mt-5 text-[clamp(2.75rem,1.6rem+4.4vw,4.75rem)] leading-[0.98]">
              Hi, I'm Deon.
            </motion.h1>
            <motion.p {...rise(2)} className="mt-4 max-w-[20ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.03em] text-muted-foreground">
              I build software for subsurface data.
            </motion.p>
            <motion.p {...rise(3)} className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
              Self-taught developer. I use machine learning on rocks, wells and reservoirs, and turn it into tools people use.
            </motion.p>
            <motion.div {...rise(4)} className="mt-8 flex flex-wrap gap-3">
              <a href="#work" className="btn">
                See the work <ArrowRight className="size-4" />
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

      </div>
    </section>
  );
}

/* ───────── Work: case studies ───────── */

export function Work() {
  const byId = (id: string) => PROJECTS.find((p) => p.id === id)!;
  const rest = PROJECTS.filter((p) => p.id !== "reschar");
  return (
    <Section id="work" title="Work" className="border-t border-border">
      <div className="grid gap-20 sm:gap-28">
        <div className="grid gap-10">
          <Case project={byId("reschar")} />
          <Reveal id="demo">
            <LiveDemo />
          </Reveal>
        </div>
        {rest.map((p, i) => (
          <Case key={p.id} project={p} flip={i % 2 === 0} />
        ))}
      </div>

      <Reveal className="mt-24">
        <CollectionLinks />
      </Reveal>
    </Section>
  );
}

function Case({ project, flip }: { project: Project; flip?: boolean }) {
  return (
    <article id={`case-${project.id}`} className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <Reveal className={cn("lg:col-span-7", flip && "lg:order-2")}>
        <WindowFrame title={project.address}>
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
          {project.year}
          {project.private && <span className="ml-3">Private</span>}
        </p>
        <h3 className="mt-2 text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-[1.05]">{project.name}</h3>
        <p className="mt-2 text-[1.0625rem] text-muted-foreground">{project.tagline}</p>

        {project.outcome && (
          <div className="mt-8">
            <p className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] leading-none font-semibold tracking-[-0.05em]">{project.outcome.value}</p>
            <p className="mt-2 text-[0.9375rem] text-muted-foreground">{project.outcome.label}</p>
          </div>
        )}

        <p className="mt-6 max-w-[52ch] text-[1rem] leading-relaxed">{project.built}</p>

        {project.links && (
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener" className="link inline-flex items-center gap-1">
                {l.label} <ArrowUpRight className="size-4" />
              </a>
            ))}
          </div>
        )}
        <HangingTools tools={project.tools} rod size={32} align="start" className="mt-6 w-fit min-w-[10rem]" />
      </Reveal>
    </article>
  );
}

/* ───────── Research ───────── */

export function Publications() {
  return (
    <Section id="research" title="Research" className="border-t border-border">
      <ol className="grid gap-6">
        {PAPERS.map((paper, i) => (
          <Reveal as="li" key={paper.id} delay={i * 0.06}>
            <PaperCase paper={paper} />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function PaperCase({ paper }: { paper: Paper }) {
  const view = useViewer();
  return (
    <article className="surface grid gap-8 overflow-hidden p-5 sm:p-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <button
          type="button"
          onClick={() => view({ title: paper.title, items: [{ src: paper.screenshot, caption: `${paper.venue}, ${paper.detail}` }] })}
          className="group block w-full text-left"
          aria-label={`Open the publisher page for ${paper.title}`}
        >
          <WindowFrame title={paper.venue}>
            <div className="relative aspect-[16/10] overflow-hidden bg-white">
              <img src={paper.screenshot} alt="" loading="lazy" className="size-full object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03]" />
              {paper.cover && <img src={paper.cover} alt={`${paper.venue} cover`} loading="lazy" className="absolute right-3 bottom-3 w-[24%] rounded-sm shadow-lg ring-1 ring-black/10" />}
            </div>
          </WindowFrame>
        </button>
        <HangingTools tools={paper.tools} size={30} align="start" rod className="mt-2 max-w-[17rem]" />
      </div>
      <div className="min-w-0 lg:col-span-7">
        <p className="kicker">
          {paper.venue}, {paper.year}
        </p>
        <h3 className="mt-2 font-sans text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] sm:text-[1.375rem]">
          <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener" className="hover:underline hover:decoration-border-strong hover:underline-offset-4">
            {paper.title}
          </a>
        </h3>
        <p className="mt-3 text-[0.875rem] leading-relaxed text-muted-foreground">
          {paper.authors.map((a, j) => (
            <Fragment key={a}>
              <span className={a === ME_AS_AUTHOR ? "font-medium text-foreground" : undefined}>{a}</span>
              {j < paper.authors.length - 1 ? ", " : ""}
            </Fragment>
          ))}
        </p>
        <p className="mt-5 max-w-[60ch] leading-relaxed">{paper.summary}</p>
        <p className="mt-3 text-[0.875rem] text-muted-foreground">{paper.methods.join(", ")}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem]">
          <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener" className="link inline-flex items-center gap-1">
            Read the paper <ArrowUpRight className="size-4" />
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
      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
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
    <div>
      <h3 className="mb-6 text-[1.5rem] leading-tight">More work</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {COLLECTIONS.map((c) => {
          const entries = ENTRIES.filter((e) => e.collection === c.id);
          return (
            <a key={c.id} href={c.path} className="surface group flex flex-col p-6 transition-colors hover:border-border-strong sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[1.25rem] font-semibold tracking-[-0.03em]">{c.title}</p>
                  <p className="kicker mt-1">{entries.length} projects</p>
                </div>
                <ArrowRight className="mt-1 size-5 text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
              </div>
              <ul className="mt-6 border-t border-border">
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
      <section className="container-x pt-10 pb-14 sm:pt-16">
        <a href="/#work" className="inline-flex items-center gap-1.5 text-[0.9375rem] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back home
        </a>
        <h1 className="mt-10 text-[clamp(2.5rem,1.6rem+3.6vw,4rem)] leading-[1]">{c.title}</h1>
        <p className="mt-4 max-w-[62ch] text-[1.125rem] leading-relaxed text-muted-foreground">{c.intro}</p>
      </section>
      <section className="container-x pb-16">
        <ol className="grid gap-5">
          {entries.map((e, i) => (
            <Reveal as="li" key={e.id} delay={i * 0.04} className="min-w-0">
              <EntryRow entry={e} />
            </Reveal>
          ))}
        </ol>
      </section>
      <section className="container-x pb-24">
        <Reveal>
          <a href={other.path} className="surface group flex items-center justify-between gap-4 p-6 hover:border-border-strong sm:p-8">
            <span className="text-[1.5rem] font-semibold tracking-[-0.03em]">{other.title}</span>
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </section>
    </>
  );
}

function EntryRow({ entry }: { entry: Entry }) {
  return (
    <article className="surface min-w-0 p-6 sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:gap-10">
        <div className="min-w-0">
          <p className="kicker">{entry.year}</p>
          <h2 className="mt-1 text-[1.5rem] leading-tight">{entry.title}</h2>
          <p className="mt-3 max-w-[68ch] leading-relaxed text-muted-foreground">{entry.summary}</p>
          <p className="mt-3 text-[0.875rem] text-muted-foreground">{entry.methods.join(", ")}</p>
          {entry.links && (
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
              {entry.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" download={l.download || undefined} className="link inline-flex items-center gap-1">
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

/* ───────── Experience ───────── */

export function Experience() {
  return (
    <Section id="experience" title="Experience" className="border-t border-border">
      <ol className="border-b border-border">
        {EXPERIENCE.map((job, i) => (
          <Reveal as="li" key={job.org} delay={i * 0.05} className="grid gap-5 border-t border-border py-10 md:grid-cols-[12rem_1fr_auto] md:gap-10">
            <div className="flex items-center gap-4 md:block">
              <Logo src={job.logo} name={job.org} />
              <p className="kicker md:mt-4">{job.when}</p>
            </div>
            <div>
              <h3 className="text-[1.25rem] leading-tight">{job.org}</h3>
              <p className="mt-1 text-muted-foreground">{job.role}</p>
              <ul className="mt-5 grid max-w-[66ch] list-disc gap-2 pl-5 text-[0.96875rem] leading-relaxed marker:text-border-strong">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <HangingTools tools={job.tools} rod size={32} align="center" className="w-fit min-w-[8rem]" />
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
    view({ title: "Certificates", items: CERTS.map((c) => ({ src: c.preview, file: c.pdf, caption: `${c.title}, ${c.issuer}, ${c.date}` })), start: index });

  return (
    <Section id="credentials" title="Certifications" className="border-t border-border">
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
                    <p className="font-medium">{cert.title}</p>
                    <p className="text-[0.875rem] text-muted-foreground">
                      {cert.issuer}, {cert.date}
                      {cert.length ? `, ${cert.length}` : ""}
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">Credential {cert.credential}</p>
                  </div>
                </div>
                <a href={cert.pdf} download className="link inline-flex items-center gap-1.5 text-[0.9375rem]">
                  <Download className="size-4" /> PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <Reveal>
          <h3 className="text-[1.125rem]">School</h3>
          <ul className="mt-5 grid gap-6">
            {EDUCATION.map((e) => (
              <li key={e.org} className="flex gap-4">
                <Logo src={e.logo} name={e.org} />
                <div>
                  <p className="font-medium">{e.org}</p>
                  <p className="text-[0.9375rem]">{e.role}</p>
                  <p className="text-[0.875rem] text-muted-foreground">
                    {e.when}
                    {e.note ? `. ${e.note}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.05}>
          <h3 className="text-[1.125rem]">Outside class</h3>
          <ul className="mt-5 grid gap-4">
            {ACTIVITIES.map((a) => (
              <li key={a.name} className="flex items-center gap-4">
                <Logo src={a.logo} name={a.name} />
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-[0.875rem] text-muted-foreground">{a.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── Photos ───────── */

export function Moments() {
  return (
    <Section id="moments" title="Photos" className="border-t border-border">
      <Reveal>
        <PhotoWall />
      </Reveal>
    </Section>
  );
}

/* ───────── Reading ───────── */

export function Reading() {
  return (
    <Section id="reading" title="Reading" className="border-t border-border">
      <ul className="grid max-w-3xl grid-cols-3 gap-4 sm:gap-8">
        {BOOKS.map((book, i) => (
          <Reveal as="li" key={book.id} delay={i * 0.06}>
            <BookCover book={book} className="overflow-hidden rounded-md shadow-[0_20px_40px_-24px_rgb(0_0_0/0.5)]" />
            <div className="h-[7.5rem]">
              <HangingTools tools={book.tools} size={30} align="center" />
            </div>
            <p className="text-[0.9375rem] leading-snug font-medium">{book.title}</p>
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
    <section id="contact" className="container-x border-t border-border py-20 sm:py-24">
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="section-title">Say hi.</h2>
            <p className="mt-4 max-w-[40ch] text-[1.0625rem] text-muted-foreground">Email is the quickest way to reach me.</p>
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
          <div className="flex min-w-0 flex-col items-center gap-3 lg:items-end">
            <ContactCard />
            <p className="text-[0.8125rem] text-muted-foreground">Tap the card</p>
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
        <span className="text-[0.75rem] text-white/60">{PROFILE.role}</span>
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
    <footer className="container-x flex flex-wrap items-center justify-between gap-3 border-t border-border py-8 text-[0.875rem] text-muted-foreground">
      <span>
        © {new Date().getFullYear()} {PROFILE.name}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MapPin className="size-3.5" /> {PROFILE.location}
      </span>
      <a href={PROFILE.github} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:text-foreground">
        <GithubMark className="size-3.5" /> GitHub
      </a>
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
