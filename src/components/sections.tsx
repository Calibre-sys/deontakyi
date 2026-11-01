import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type FormEvent, useState } from "react";
import { ArcPicker } from "@/components/motion/arc-picker";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { useViewer } from "@/components/viewer";
import { CERTS, EDUCATION, EVENTS, EXPERIENCE, ME_AS_AUTHOR, PAPERS, PROFILE, PROJECTS, REFERENCES, SHELVES } from "@/data";
import { cn } from "@/lib/utils";
import { BookCover } from "./book-cover";
import { FlowUnitLab } from "./flow-unit-lab";
import { Heading, Reveal, Section } from "./kit";
import { InlineShot, Slideshow, useStage } from "./stage";

const NAV = [
  { href: "#research", label: "Research" },
  { href: "#certificates", label: "Certificates" },
  { href: "#work", label: "Work" },
  { href: "#reading", label: "Reading" },
  { href: "#contact", label: "Contact" },
];

/* ── The bar ─────────────────────────────────────────── */

export function TopBar() {
  const { section } = useStage();
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-6 bg-bg px-[var(--gutter)]">
      <a href="#top" className="mr-auto font-display text-[1.125rem] font-extrabold tracking-[-0.02em] whitespace-nowrap">
        Deon Takyi-Amponsem
      </a>
      <nav aria-label="Sections" className="hidden items-center gap-5 text-small xl:flex">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={section === item.href.slice(1) ? "true" : undefined}
            className="transition-colors hover:text-accent aria-[current]:font-semibold aria-[current]:text-accent"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <ThemeToggle variant="blinds" className="size-10 hover:text-accent" iconClassName="size-[18px]" />
    </header>
  );
}

/* ── First screen ────────────────────────────────────── */

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 + i * 0.08 },
        };
  return (
    <section id="top" data-stage="intro" className="px-[var(--gutter)] pt-6 lg:flex lg:min-h-[calc(100svh-4rem)] lg:flex-col lg:justify-center lg:pt-0 lg:pb-24">
      <InlineShot section="intro" ratio="16 / 11" className="mb-8" caption={false} />
      <motion.h1 {...rise(0)} className="text-[clamp(3rem,6.4vw,6rem)] leading-[0.92]">
        Rocks, data
        <br />
        and code
      </motion.h1>
      <motion.p {...rise(1)} className="measure mt-8 text-lead leading-[1.4]">
        I'm Deon, a petroleum engineer in Accra who taught himself to code. I publish machine-learning research on oil
        reservoirs and build tools that take hours of manual work off people's desks.
      </motion.p>
      <motion.div {...rise(2)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <a href="#research" className="btn">
          Read the research <ArrowRight className="size-4" />
        </a>
        <CvLink className="link" />
      </motion.div>
    </section>
  );
}

function CvLink({ className, children = "Open my CV" }: { className?: string; children?: string }) {
  const view = useViewer();
  return (
    <button type="button" className={className} onClick={() => view({ title: `CV, ${PROFILE.name}`, items: [{ src: PROFILE.cv }] })}>
      {children}
    </button>
  );
}

/* ── About, as a narrow column ───────────────────────── */

export function Intro() {
  return (
    <Section id="about" stage="intro" label="About" className="lg:pt-24">
      <h2 className="sr-only">About me</h2>
      <div className="measure grid gap-5 text-body">
        <Reveal as="p" className="font-semibold">
          I studied petroleum engineering at KNUST and finished with First-Class Honours. Somewhere between reservoir simulations
          and spreadsheets I started writing code to do the slow parts for me, and I never stopped.
        </Reveal>
        <Reveal as="p" delay={0.06}>
          Today I lead reservoir characterization at the AI-DPRS research lab, where we teach models to read core and well data,
          and I build the internal software at SOH Energy.
        </Reveal>
        <Reveal as="p" delay={0.12}>
          Before that I calibrated flow meters and checked pumps at the Tema Tank Farm. That is where I learned how messy field
          data really is, and why the tools that handle it have to be dependable.
        </Reveal>
        <Reveal as="p" delay={0.18}>
          Away from the desk: football, reading, and code written for fun.{" "}
          <a href={PROFILE.github} target="_blank" rel="noopener" className="link">
            My GitHub
          </a>
          .
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Research: big names, fixed preview ──────────────── */

export function Research() {
  const { picks, pick } = useStage();
  const paper = PAPERS.find((p) => p.id === picks.paper)!;
  const url = `https://doi.org/${paper.doi}`;

  return (
    <Section id="research" stage="research">
      <Heading>Research</Heading>
      <Reveal delay={0.06}>
        <p className="measure mt-6">Two published papers on machine learning for oil reservoirs. Choose one to read about it.</p>
      </Reveal>

      <div role="tablist" aria-label="Papers" className="mt-12 grid gap-6">
        {PAPERS.map((p, i) => (
          <Reveal key={p.id} delay={0.1 + i * 0.07}>
            <button
              type="button"
              role="tab"
              aria-selected={p.id === paper.id}
              onClick={() => pick("paper", p.id)}
              onMouseEnter={() => pick("paper", p.id)}
              onFocus={() => pick("paper", p.id)}
              className={cn(
                "py-2 text-left font-display text-head leading-[1] font-extrabold tracking-[-0.02em] transition-colors",
                p.id === paper.id ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              {p.name}
            </button>
            <p className="text-small text-muted">
              {p.venue}, {p.date.split(" · ")[0]}
            </p>
          </Reveal>
        ))}
      </div>

      <InlineShot section="research" ratio="4 / 3.4" className="mt-10" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={paper.id}
          role="tabpanel"
          className="mt-12 bg-surface p-6 sm:p-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          <h3 className="max-w-[40ch] font-text text-lead leading-snug font-semibold tracking-normal">{paper.title}</h3>
          <p className="mt-4 text-small text-muted">
            {paper.authors.map((author, i) => (
              <span key={author}>
                <span className={author === ME_AS_AUTHOR ? "font-semibold text-ink" : undefined}>{author}</span>
                {i < paper.authors.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
          <p className="measure mt-6">{paper.summary}</p>
          <ul className="measure mt-6 grid gap-3">
            {paper.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden className="mt-[0.6em] size-2 shrink-0 bg-accent" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={url} target="_blank" rel="noopener" className="btn">
              Read the paper <ArrowUpRight className="size-4" />
            </a>
            <CopyCitation paper={paper} />
          </div>
          <p className="mt-6 text-small text-muted">
            {paper.publisher} · {paper.detail} · doi {paper.doi}
          </p>
        </motion.article>
      </AnimatePresence>

      <FlowUnitLab />
    </Section>
  );
}

function CopyCitation({ paper }: { paper: (typeof PAPERS)[number] }) {
  const [copied, setCopied] = useState(false);
  const year = paper.date.match(/\d{4}/)?.[0] ?? "";
  const text = `${paper.authors.join(", ")} (${year}). ${paper.title}. ${paper.venue}. https://doi.org/${paper.doi}`;
  return (
    <button
      type="button"
      className="link"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard blocked */
        }
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={String(copied)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-block">
          {copied ? "Citation copied" : "Copy the citation"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ── Certificates: an index of names, the sheet beside it ── */

export function Certificates() {
  const { picks, pick } = useStage();
  const view = useViewer();
  const cert = CERTS.find((c) => c.id === picks.cert)!;
  const index = CERTS.indexOf(cert);
  const datacamp = CERTS.filter((c) => c.issuer === "DataCamp").length;

  return (
    <Section id="certificates" stage="certificates">
      <Heading>Certificates</Heading>
      <Reveal delay={0.06}>
        <p className="measure mt-6">
          Seven courses: {datacamp} from DataCamp and {CERTS.length - datacamp} from 365 Data Science, covering deep learning
          with PyTorch, time series, LLM applications and the core ML algorithms.
        </p>
      </Reveal>

      <Reveal delay={0.12} className="mt-10 bg-surface py-4">
        <div data-ui>
        <ArcPicker
          aria-label="Certificates"
          options={CERTS.map((c) => ({ value: c.id, label: c.short }))}
          value={cert.id}
          onValueChange={(v) => pick("cert", v)}
          side="right"
          radius={360}
          itemHeight={56}
          visibleCount={5}
        />
        </div>
      </Reveal>

      <InlineShot section="certificates" ratio="4 / 3" className="mt-8" />

      <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h3 className="text-lead leading-[1.15]">{cert.title}</h3>
          <p className="mt-3">
            {cert.issuer}, completed {cert.date}
            {cert.length ? `, ${cert.length}` : ""}. Credential {cert.credential}.
          </p>
          <p className="mt-2 text-muted">Covers {cert.skills.join(", ")}.</p>
        </div>
        <button
          type="button"
          className="btn btn-quiet justify-self-start"
          onClick={() =>
            view({
              title: "Certificates",
              items: CERTS.map((c) => ({ src: c.preview, file: c.pdf, caption: `${c.title}, ${c.issuer}, ${c.date}` })),
              start: index,
            })
          }
        >
          View the original
        </button>
      </div>
    </Section>
  );
}

/* ── Work: one giant word, rows that open in place ───── */

export function Work() {
  const { picks, pick } = useStage();
  const view = useViewer();
  return (
    <Section id="work" stage="work">
      <div className="[container-type:inline-size]">
        <Reveal>
          <h2 className="text-[19.5cqw] leading-[0.82]">Shipped</h2>
        </Reveal>
      </div>
      <Reveal delay={0.06}>
        <p className="measure mt-8">
          Software I've built and put to work. Three of these run inside companies, so you see screen recordings instead of
          links.
        </p>
      </Reveal>

      <InlineShot section="work" ratio="16 / 10" className="mt-10" />

      <div className="mt-8 grid gap-1.5">
        {PROJECTS.map((project, i) => {
          const open = picks.project === project.id;
          return (
            <Reveal key={project.id} delay={i * 0.05}>
              <details
                open={open}
                onToggle={(event) => {
                  if ((event.currentTarget as HTMLDetailsElement).open) pick("project", project.id);
                }}
                className="group bg-surface"
              >
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    pick("project", project.id);
                  }}
                  className="flex min-h-16 list-none items-center gap-4 px-5 py-4 transition-colors hover:bg-field [&::-webkit-details-marker]:hidden"
                >
                  <span className="flex-1">
                    <span className="block text-lead leading-tight font-semibold">{project.name}</span>
                    {project.impact && <span className="mt-1 block text-small text-muted">{project.impact}</span>}
                  </span>
                  <Plus aria-hidden className={cn("size-5 shrink-0 transition-transform duration-300", open && "rotate-45")} />
                </summary>
                <div className="px-5 pb-6">
                  <p className="measure">{project.blurb}</p>
                  <p className="mt-3 text-small text-muted">
                    Built with {project.stack.join(", ")}.{project.private ? " Private, made for the company." : ""}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {project.video && (
                      <button
                        type="button"
                        className="btn btn-quiet"
                        onClick={() => view({ title: `${project.name}, demo`, items: [{ src: project.video! }], download: false })}
                      >
                        Watch with sound
                      </button>
                    )}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener" className="link">
                        Visit the live site
                      </a>
                    )}
                  </div>
                </div>
              </details>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ── Reading: names in columns, the covers ───────────── */

export function Reading() {
  const { picks, pick } = useStage();
  const books = SHELVES.flatMap((s) => s.books);
  const current = books.find((b) => b.id === picks.book)!;
  return (
    <Section id="reading" stage="reading">
      <Heading>On my shelf</Heading>
      <Reveal delay={0.06}>
        <p className="measure mt-6">
          I taught myself most of what I use. These are the books that did the teaching, and one that changed how I think.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        {SHELVES.map((shelf, s) => (
          <Reveal key={shelf.id} delay={0.1 + s * 0.08}>
            <h3 className="font-text text-body font-normal tracking-normal text-muted">{shelf.title}</h3>
            <ul className="mt-2 grid gap-2">
              {shelf.books.map((book) => (
                <li key={book.id}>
                  <button
                    type="button"
                    aria-pressed={book.id === current.id}
                    onClick={() => pick("book", book.id)}
                    onMouseEnter={() => pick("book", book.id)}
                    onFocus={() => pick("book", book.id)}
                    className={cn("text-left text-lead leading-snug transition-colors", book.id === current.id ? "text-ink" : "text-muted hover:text-ink")}
                  >
                    <span className="font-semibold">{book.title}</span>
                    <span className="block text-small">{book.author}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 flex items-end gap-4 sm:gap-6">
        {books.map((book, i) => (
          <Reveal key={book.id} delay={0.1 + i * 0.07} className="w-[30%] max-w-[11rem]">
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              onClick={() => pick("book", book.id)}
              onMouseEnter={() => pick("book", book.id)}
              className={cn(
                "block w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                book.id === current.id ? "-translate-y-3" : "hover:-translate-y-1.5",
              )}
            >
              <BookCover book={book} />
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={current.id}
          className="measure mt-8 text-lead leading-[1.35]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          {current.note}
        </motion.p>
      </AnimatePresence>
    </Section>
  );
}

/* ── Experience ──────────────────────────────────────── */

export function Experience() {
  return (
    <Section id="experience" stage="experience">
      <Heading>Experience</Heading>
      <InlineShot section="experience" ratio="4 / 4.2" className="mt-10" />
      <div className="mt-12 grid gap-14">
        {EXPERIENCE.map((job, i) => (
          <Reveal key={job.org} delay={i * 0.05}>
            <h3 className="text-lead leading-tight">{job.org}</h3>
            <p className="mt-2">
              {job.role}, <span className="text-muted">{job.when}</span>
            </p>
            <ul className="measure mt-4 grid gap-2">
              {job.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden className="mt-[0.6em] size-2 shrink-0 bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="mt-20 bg-surface p-6 sm:p-10">
        <Reveal>
          <h3 className="text-lead">Education</h3>
        </Reveal>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          {EDUCATION.map((school, i) => (
            <Reveal key={school.org} delay={0.06 + i * 0.06}>
              <p className="font-semibold">{school.org}</p>
              <p>{school.role}</p>
              <p className="text-muted">{school.when}</p>
              {school.points.length > 0 && <p className="mt-3 text-small">{school.points.join(". ")}.</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ── Events: the frame whose contents change ─────────── */

export function Events() {
  return (
    <Section id="events" stage="events">
      <Heading>Conferences and outreach</Heading>
      <figure className="relative mt-10 aspect-[4/3.4] overflow-hidden lg:hidden">
        <Slideshow inline />
      </figure>
      <dl className="mt-12 grid gap-8 sm:grid-cols-2">
        {EVENTS.map((event, i) => (
          <Reveal key={event.name} delay={i * 0.06}>
            <dt className="text-lead leading-tight font-semibold">{event.name}</dt>
            <dd className="mt-2">{event.detail}</dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}

/* ── Contact: one field ──────────────────────────────── */

export function Contact() {
  const [message, setMessage] = useState("");
  const send = (event: FormEvent) => {
    event.preventDefault();
    const body = encodeURIComponent(message.trim());
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Hello from your website")}&body=${body}`;
  };
  return (
    <Section id="contact" stage="contact" className="pb-28 lg:pb-40">
      <Reveal>
        <h2 className="text-head">
          Got messy data?
          <br />
          Let's talk.
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <form onSubmit={send} className="mt-10 max-w-[34rem]">
          <label htmlFor="message" className="sr-only">
            Your message
          </label>
          <div className="relative">
            <input
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="A sentence about the problem"
              aria-describedby="message-note"
              className="h-16 w-full bg-paper pr-16 pl-5 text-body text-ink outline-none placeholder:text-muted focus:outline-2 focus:outline-offset-[-2px] focus:outline-accent"
            />
            <button
              type="submit"
              aria-label="Send by email"
              className="absolute top-2 right-2 flex size-12 items-center justify-center bg-accent text-accent-ink transition-transform active:scale-95"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
          <p id="message-note" className="mt-3 text-small text-muted">
            This opens your email app with the message filled in.
          </p>
        </form>
      </Reveal>

      <Reveal delay={0.14}>
        <dl className="mt-14 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          <ContactRow label="Email">
            <a href={`mailto:${PROFILE.email}`} className="link break-all">
              {PROFILE.email}
            </a>
          </ContactRow>
          <ContactRow label="Phone">
            <a href={PROFILE.phoneHref} className="link">
              {PROFILE.phone}
            </a>
          </ContactRow>
          <ContactRow label="Elsewhere">
            <a href={PROFILE.github} target="_blank" rel="noopener" className="link">
              GitHub
            </a>
            {", "}
            <a href={PROFILE.linkedin} target="_blank" rel="noopener" className="link">
              LinkedIn
            </a>
          </ContactRow>
          <ContactRow label="CV">
            <CvLink className="link">Read it here</CvLink>
          </ContactRow>
        </dl>
      </Reveal>

      <Reveal delay={0.18}>
        <p className="mt-12 text-small text-muted">
          References: {REFERENCES.map((r) => `${r.name}, ${r.role}`).join("; ")}. Contact details on request.
        </p>
      </Reveal>
    </Section>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-small text-muted">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

/* ── Footer: the name across the last photograph ─────── */

export function Footer() {
  return (
    <footer className="relative flex min-h-[88svh] flex-col justify-between overflow-hidden px-[var(--gutter)] pt-8 pb-10 text-[#f6f2f0] lg:min-h-svh">
      <img
        src="/media/buildingbytes-2.jpg"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover brightness-[0.5]"
      />
      <div className="flex flex-wrap justify-between gap-8 text-body">
        <nav aria-label="Footer" className="grid gap-1">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="grid gap-1 sm:text-right">
          <a href={`mailto:${PROFILE.email}`} className="hover:underline">
            {PROFILE.email}
          </a>
          <a href={PROFILE.phoneHref} className="hover:underline">
            {PROFILE.phone}
          </a>
          <span>Accra, Ghana</span>
        </div>
      </div>
      <div>
        <p aria-hidden className="font-display text-[9.2vw] leading-[0.8] lg:text-[10.2vw] font-extrabold tracking-[-0.04em] whitespace-nowrap">
          Takyi-Amponsem
        </p>
        <p className="mt-6 text-small">© {new Date().getFullYear()} Deon Takyi-Amponsem. Photograph: Building Bytes demo day, Kumasi.</p>
      </div>
    </footer>
  );
}
