import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type FormEvent, type ReactNode, useRef, useState } from "react";
import * as Icons from "simple-icons";
import { ArcPicker } from "@/components/motion/arc-picker";
import { useViewer } from "@/components/viewer";
import { CERTS, ME_AS_AUTHOR, PAPERS, PROFILE, PROJECTS, REFERENCES, SHELVES } from "@/data";
import { cn } from "@/lib/utils";
import { BookCover } from "./book-cover";
import { CorePlug, TankFarm } from "./drawings";
import { FlowUnitLab } from "./flow-unit-lab";
import { Chapter, Reveal, Title } from "./kit";
import { OutreachEmail, Shortlist } from "./fragments";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ═════ First screen ═════ */

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: "0.4em" },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease: EASE, delay: 0.05 + i * 0.1 },
        };
  const view = useViewer();
  const facts = [
    { value: "1st", text: "First-Class Honours, BSc Petroleum Engineering, KNUST" },
    { value: "2", text: "papers published, 2025 and 2026" },
    { value: "7", text: "certificates in ML, deep learning and LLM apps" },
    { value: "90%", text: "less time per order with the system I built at SOH Energy" },
  ];

  return (
    <section id="top" className="frame pt-24 pb-24 xl:pt-12">
      <h1 className="monument" aria-label="Deon Takyi-Amponsem">
        <motion.span {...rise(0)} className="block">
          Deon
        </motion.span>
        <motion.span {...rise(1)} className="block">
          Takyi-Amponsem
        </motion.span>
      </h1>

      <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-12 md:gap-8">
        <motion.figure
          className="order-2 md:order-1 md:col-span-5"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
        >
          <img
            src={PROFILE.portrait}
            alt={`Portrait of ${PROFILE.name}`}
            className="aspect-[4/5] w-full object-cover"
            style={{ objectPosition: "50% 18%" }}
          />
        </motion.figure>

        <div className="order-1 flex flex-col md:order-2 md:col-span-7">
          <motion.p {...rise(3)} className="measure text-lead leading-[1.35]">
            I trained to find oil in rock. Somewhere along the way I taught myself to code, published two machine-learning papers
            on reservoirs, and started building the software my colleagues use every day. This is how that happened.
          </motion.p>
          <motion.div {...rise(4)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#rock" className="btn">
              Start at the beginning <ArrowDown className="size-4" />
            </a>
            <button type="button" className="link" onClick={() => view({ title: `CV, ${PROFILE.name}`, items: [{ src: PROFILE.cv }] })}>
              Or read the CV
            </button>
          </motion.div>
          <dl className="mt-auto grid grid-cols-2 gap-x-6 gap-y-8 pt-10 md:pt-14">
            {facts.map((fact, i) => (
              <Reveal key={fact.value} delay={0.4 + i * 0.07}>
                <dt className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.85] font-black uppercase">{fact.value}</dt>
                <dd className="mt-2 max-w-[24ch] text-small text-muted">{fact.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ═════ 2018: rock ═════ */

export function Rock() {
  return (
    <Chapter id="rock">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Title>It started with rock</Title>
          <div className="measure mt-10 grid gap-5">
            <Reveal as="p" className="text-lead leading-[1.35]">
              Cape Coast, 2018. Mfantsipim gave me general science. Then KNUST gave me petroleum engineering.
            </Reveal>
            <Reveal as="p" delay={0.06}>
              For four years I learned porosity, permeability and pressure: how oil and water move through stone two kilometres
              down. I liked it most when the numbers got hard, and I finished with First-Class Honours and the College of
              Engineering Excellence Award.
            </Reveal>
            <Reveal as="p" delay={0.12}>
              Those two words, porosity and permeability, turn up again later in this story. They are what my first paper is
              about.
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <dl className="mt-14 grid gap-6 sm:grid-cols-2">
              <Fact term="KNUST, Kumasi" detail="BSc Petroleum Engineering, 2021 to 2025. First-Class Honours." />
              <Fact term="Excellence Award" detail="College of Engineering, 2021/22 academic year." />
              <Fact term="Mfantsipim School" detail="WASSCE, General Science, Cape Coast, 2018 to 2021." />
              <Fact term="Engineering software" detail="Eclipse 100 and 300, Prosper, GAP, AutoCAD." />
            </dl>
          </Reveal>
        </div>
        <Reveal className="flex items-end justify-center gap-8 lg:col-span-4 lg:justify-end" y={60}>
          <CorePlug className="w-40 sm:w-48" />
          <img src="/images/Knust_seal.png" alt="KNUST seal" className="mb-4 w-24 sm:w-28" loading="lazy" />
        </Reveal>
      </div>
    </Chapter>
  );
}

function Fact({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="bg-panel p-5">
      <dt className="font-semibold">{term}</dt>
      <dd className="mt-1 text-muted">{detail}</dd>
    </div>
  );
}

/* ═════ 2021: SPE ═════ */

export function Spe() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  return (
    <Chapter id="spe" className="bg-panel">
      <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
        <div ref={ref} className="relative lg:col-span-6">
          <Reveal as="figure">
            <img src="/media/energy4me-1.jpg" alt="Deon with students at an SPE Energy4me session" loading="lazy" className="aspect-[16/10] w-full object-cover" />
          </Reveal>
          <motion.figure style={{ y: drift }} className="relative z-10 -mt-20 ml-auto w-[58%]">
            <img src="/media/energy4me-2.jpg" alt="Energy4me outreach in a school classroom" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </motion.figure>
        </div>
        <div className="lg:col-span-6">
          <Title>SPE put me in the room</Title>
          <div className="mt-10 grid gap-5">
            <Reveal as="p">
              I joined the Society of Petroleum Engineers' KNUST chapter in my first year, 2021, and never left. In my final year
              I was the chapter's treasurer, in charge of the money for every event, trip and conference.
            </Reveal>
            <Reveal as="p" delay={0.06}>
              With SPE's Energy4me programme I went into schools and explained where energy comes from to students who had never
              thought about it. If a classroom of students can follow how a reservoir works, a client can follow a model.
            </Reveal>
            <Reveal as="p" delay={0.12} className="text-muted">
              Hold on to SPE too. It comes back in 2026.
            </Reveal>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

/* ═════ 2023: the field ═════ */

export function Field() {
  const steps = [
    { title: "Calibrated", text: "flow meters against prover tanks, so the volumes leaving the farm were right." },
    { title: "Tracked", text: "product from the storage tanks to the terminals, shift after shift." },
    { title: "Checked", text: "pumps, valves, pipelines and tanks on the routine rounds." },
  ];
  return (
    <Chapter id="field">
      <Title>Then I saw the field</Title>
      <Reveal as="p" delay={0.06} className="measure mt-8 text-lead leading-[1.35]">
        Tema Tank Farm and Booster Station, September 2023 to January 2024. Operations intern.
      </Reveal>
      <Reveal className="mt-12" y={40}>
        <TankFarm />
      </Reveal>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.08}>
            <h3 className="text-[clamp(2rem,3vw,2.75rem)]">{step.title}</h3>
            <p className="mt-3">{step.text}</p>
          </Reveal>
        ))}
      </div>
      <Reveal as="p" className="measure mt-16 text-lead leading-[1.35]">
        Every reading ended up in a logbook or a spreadsheet, typed in by hand. I kept thinking a short script could do it.
      </Reveal>
    </Chapter>
  );
}

/* ═════ 2024: self-taught ═════ */

const TOOLS: { name: string; icon?: Icons.SimpleIcon }[] = [
  { name: "Python", icon: Icons.siPython },
  { name: "PyTorch", icon: Icons.siPytorch },
  { name: "TensorFlow", icon: Icons.siTensorflow },
  { name: "scikit-learn", icon: Icons.siScikitlearn },
  { name: "pandas", icon: Icons.siPandas },
  { name: "NumPy", icon: Icons.siNumpy },
  { name: "Jupyter", icon: Icons.siJupyter },
  { name: "FastAPI", icon: Icons.siFastapi },
  { name: "LangChain", icon: Icons.siLangchain },
  { name: "JavaScript", icon: Icons.siJavascript },
  { name: "React", icon: Icons.siReact },
  { name: "Node.js", icon: Icons.siNodedotjs },
  { name: "HTML", icon: Icons.siHtml5 },
  { name: "CSS", icon: Icons.siCss },
  { name: "Apps Script", icon: Icons.siGoogleappsscript },
  { name: "Google Sheets", icon: Icons.siGooglesheets },
  { name: "Zapier", icon: Icons.siZapier },
  { name: "Git", icon: Icons.siGit },
  { name: "GitHub", icon: Icons.siGithub },
  { name: "AutoCAD", icon: Icons.siAutocad },
];

export function SelfTaught() {
  return (
    <Chapter id="self-taught">
      <Title>So I taught myself to code</Title>
      <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-12">
        <Reveal as="p" className="text-lead leading-[1.35]">
          No bootcamp and no CS degree. Books at night, courses at weekends, and small scripts that saved me an hour here and
          there until they were not small any more.
        </Reveal>
        <Reveal as="p" delay={0.06}>
          This is what I learned with: the books I worked through, the courses I finished, and the tools I now use every week.
          Pick a book or a certificate to see it properly.
        </Reveal>
      </div>

      <Books />
      <Certificates />
      <Tools />
    </Chapter>
  );
}

function Books() {
  const books = SHELVES.flatMap((s) => s.books.map((b) => ({ ...b, shelf: s.title })));
  const [current, setCurrent] = useState(books[0].id);
  const book = books.find((b) => b.id === current)!;
  return (
    <div className="mt-28">
      <Reveal>
        <h3 className="text-[clamp(2rem,3.4vw,3.25rem)]">The books</h3>
      </Reveal>
      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="flex items-end gap-5 sm:gap-8 lg:col-span-7">
          {books.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.08} className="w-[31%] max-w-[13rem]" y={50}>
              <button
                type="button"
                aria-pressed={b.id === current}
                aria-label={`${b.title} by ${b.author}`}
                onClick={() => setCurrent(b.id)}
                onMouseEnter={() => setCurrent(b.id)}
                className={cn(
                  "block w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  b.id === current ? "-translate-y-4" : "opacity-70 hover:-translate-y-2 hover:opacity-100",
                )}
              >
                <BookCover book={b} />
              </button>
            </Reveal>
          ))}
        </div>
        <div className="lg:col-span-5" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={book.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <p className="text-small text-muted">{book.shelf}</p>
              <p className="mt-2 text-lead leading-tight font-semibold">{book.title}</p>
              <p className="text-muted">{book.author}</p>
              <p className="mt-5 text-lead leading-[1.35]">{book.note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Certificates() {
  const [current, setCurrent] = useState(CERTS[0].id);
  const view = useViewer();
  const cert = CERTS.find((c) => c.id === current)!;
  const index = CERTS.indexOf(cert);
  return (
    <div className="mt-32">
      <Reveal>
        <h3 className="text-[clamp(2rem,3.4vw,3.25rem)]">The certificates</h3>
      </Reveal>
      <Reveal as="p" delay={0.05} className="measure mt-4 text-muted">
        Four from DataCamp, three from 365 Data Science. Scroll or drag the list.
      </Reveal>
      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center">
        <Reveal className="bg-panel py-4 lg:col-span-5">
          <div data-ui>
            <ArcPicker
              aria-label="Certificates"
              options={CERTS.map((c) => ({ value: c.id, label: c.short }))}
              value={cert.id}
              onValueChange={setCurrent}
              side="right"
              radius={380}
              itemHeight={60}
              visibleCount={5}
            />
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.button
              key={cert.id}
              type="button"
              onClick={() =>
                view({
                  title: "Certificates",
                  items: CERTS.map((c) => ({ src: c.preview, file: c.pdf, caption: `${c.title}, ${c.issuer}, ${c.date}` })),
                  start: index,
                })
              }
              aria-label={`Open the ${cert.title} certificate`}
              className="block w-full bg-white"
              initial={{ opacity: 0, rotate: -1.5, y: 16 }}
              animate={{ opacity: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, rotate: 1, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              whileHover={{ y: -4 }}
            >
              <img src={cert.preview} alt="" className="block h-auto w-full" />
            </motion.button>
          </AnimatePresence>
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p>
              <span className="font-semibold">{cert.title}</span>
              <span className="text-muted">
                {" "}
                · {cert.issuer}, {cert.date}
                {cert.length ? `, ${cert.length}` : ""}
              </span>
            </p>
            <a href={cert.pdf} download className="link inline-flex items-center gap-1.5 text-small">
              <Download className="size-3.5" /> PDF, ID {cert.credential}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tools() {
  return (
    <div className="mt-32">
      <Reveal>
        <h3 className="text-[clamp(2rem,3.4vw,3.25rem)]">The tools</h3>
      </Reveal>
      <Reveal as="p" delay={0.05} className="measure mt-4 text-muted">
        What I build with now, plus VBA and Excel for financial models, and Eclipse 100/300, Prosper and GAP from the petroleum
        side.
      </Reveal>
      <ul className="mt-10 grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-5">
        {TOOLS.map((tool, i) => (
          <Reveal as="li" key={tool.name} delay={(i % 5) * 0.04} y={16}>
            <div
              className="group flex h-full flex-col items-start gap-6 bg-panel p-4 transition-colors duration-300 hover:bg-panel-2 sm:p-5"
              style={{ ["--brand" as string]: tool.icon ? `#${tool.icon.hex}` : undefined }}
            >
              {tool.icon && (
                <svg viewBox="0 0 24 24" aria-hidden className="size-7 fill-ink transition-[fill,transform] duration-300 group-hover:scale-110 group-hover:fill-[var(--brand)] sm:size-8">
                  <path d={tool.icon.path} />
                </svg>
              )}
              <span className="text-small font-semibold">{tool.name}</span>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/* ═════ 2024 onwards: the lab ═════ */

export function Lab() {
  const view = useViewer();
  return (
    <Chapter id="lab" className="flip">
      <Title>Then the models worked</Title>
      <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-12">
        <Reveal as="p" className="text-lead leading-[1.35]">
          In September 2024 I joined Dr. Stephen Adjei's AI-DPRS lab at KNUST as reservoir characterization lead.
        </Reveal>
        <Reveal as="p" delay={0.06}>
          The question was simple to ask and hard to answer: can a machine sort rock into hydraulic flow units without an
          engineer ranking every sample by hand? It can. We published the method, worked with GNPC on real field data, and I
          turned it into software.
        </Reveal>
      </div>

      <div className="mt-20 grid gap-6 lg:grid-cols-2">
        {PAPERS.map((paper, i) => (
          <Reveal key={paper.id} delay={i * 0.08} className="flex flex-col bg-panel">
            <div className="flex items-center justify-center bg-panel-2 p-10">
              {paper.cover ? (
                <img src={paper.cover} alt={`${paper.venue} cover`} loading="lazy" className="w-36 sm:w-44" />
              ) : (
                <div className="flex aspect-[3/4] w-36 flex-col justify-between bg-ground p-4 sm:w-44">
                  <span className="font-display text-[2rem] leading-[0.9] font-black uppercase">ATC 2026</span>
                  <span className="text-[13px] leading-snug text-muted">SPE Africa Technology Conference, Abidjan. Paper SPE-233427-MS.</span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <p className="text-small text-muted">
                {paper.venue}, {paper.date.split(" · ")[0]}
              </p>
              <h3 className="mt-3 font-text text-lead leading-snug font-semibold tracking-normal normal-case">{paper.title}</h3>
              <p className="mt-3 text-small text-muted">
                {paper.authors.map((a, j) => (
                  <span key={a}>
                    <span className={a === ME_AS_AUTHOR ? "font-semibold text-ink" : undefined}>{a}</span>
                    {j < paper.authors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="mt-5">{paper.summary}</p>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener" className="btn">
                  Read the paper <ArrowUpRight className="size-4" />
                </a>
                <button
                  type="button"
                  className="link"
                  onClick={() => view({ title: paper.title, items: [{ src: paper.screenshot, caption: `${paper.publisher}, ${paper.detail}` }] })}
                >
                  See the publisher page
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <FlowUnitLab />

      <div className="mt-28 grid gap-10 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-8" y={40}>
          <video
            src="/media/reschar-demo.mp4"
            poster="/media/reschar-poster.jpg"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label="RescharAI screen recording"
            className="block aspect-video w-full bg-black object-contain"
          />
        </Reveal>
        <div className="lg:col-span-4">
          <h3 className="text-[clamp(2rem,3.4vw,3.25rem)]">RescharAI</h3>
          <Reveal as="p" delay={0.05} className="mt-4">
            The paper, turned into a tool. Unsupervised learning finds the flow units, and supervised models with residual
            correctors mark the net pay. No more manual petrophysics workflow.
          </Reveal>
          <button type="button" className="btn btn-quiet mt-6" onClick={() => view({ title: "RescharAI, demo", items: [{ src: "/media/reschar-demo.mp4" }], download: false })}>
            Watch with sound
          </button>
        </div>
      </div>
    </Chapter>
  );
}

/* ═════ 2025: SOH Energy ═════ */

export function Soh() {
  const shipped = PROJECTS.filter((p) => p.id !== "reschar");
  const [current, setCurrent] = useState(shipped[0].id);
  const project = shipped.find((p) => p.id === current)!;
  const view = useViewer();

  let media: ReactNode;
  if (project.video) {
    media = (
      <video
        key={project.id}
        src={project.video}
        poster={project.poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={`${project.name} screen recording`}
        className="absolute inset-0 size-full bg-black object-contain"
      />
    );
  } else {
    media = <div className="absolute inset-0 flex items-center justify-center bg-panel-2">{project.id === "manpower" ? <OutreachEmail /> : <Shortlist />}</div>;
  }

  return (
    <Chapter id="soh">
      <Title>Now it runs at work</Title>
      <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-12">
        <Reveal as="p" className="text-lead leading-[1.35]">
          November 2025, national service at SOH Energy, in business development.
        </Reveal>
        <Reveal as="p" delay={0.06}>
          The role was business development, not software. But the tank-farm feeling came back: people copying numbers between documents,
          calling hundreds of contacts by hand. So I built the tools instead, and they stayed.
        </Reveal>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="relative aspect-[16/10] overflow-hidden bg-black">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={project.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                {media}
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={project.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-6">
              <p className="measure">{project.blurb}</p>
              <p className="mt-3 text-small text-muted">
                Built with {project.stack.join(", ")}.{project.private ? " Private, so this is a recording or sample output, not a link." : ""}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {project.video && (
                  <button type="button" className="btn btn-quiet" onClick={() => view({ title: `${project.name}, demo`, items: [{ src: project.video! }], download: false })}>
                    Watch with sound
                  </button>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener" className="btn">
                    Visit {project.name} <ArrowUpRight className="size-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <ul className="grid content-start gap-1.5 lg:col-span-4" aria-label="Projects">
          {shipped.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={p.id === current}
                onClick={() => setCurrent(p.id)}
                className={cn("w-full p-5 text-left transition-colors duration-300", p.id === current ? "bg-accent text-accent-ink" : "bg-panel hover:bg-panel-2")}
              >
                <span className="block font-display text-[1.75rem] leading-none font-extrabold uppercase">{p.name}</span>
                {p.impact && <span className={cn("mt-2 block text-small", p.id === current ? "" : "text-muted")}>{p.impact}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}

/* ═════ 2026: Abidjan ═════ */

export function Abidjan() {
  return (
    <Chapter id="abidjan" className="bg-panel">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal as="figure" className="lg:col-span-5" y={50}>
          <img src="/media/atc-2026.jpg" alt="Deon at the Africa Technology Conference in Abidjan" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          <figcaption className="mt-3 text-small text-muted">Africa Technology Conference, Abidjan, June 2026.</figcaption>
        </Reveal>
        <div className="lg:col-span-7">
          <Title>Back to SPE, in Abidjan</Title>
          <div className="measure mt-10 grid gap-5">
            <Reveal as="p" className="text-lead leading-[1.35]">
              June 2026. Five years after I joined SPE as a first-year, I was in Abidjan as a delegate at SPE's Africa Technology
              Conference.
            </Reveal>
            <Reveal as="p" delay={0.06}>
              Our second paper, on how water injectors drive oil production, was in the conference programme. The society that
              gave a first-year student a room to sit in had my name in its proceedings.
            </Reveal>
            <Reveal as="p" delay={0.12}>
              Before that I had pitched at the Building Bytes Pitch Program in Kumasi, which is where I learned to explain a
              product in three minutes to people who do not care about reservoirs.
            </Reveal>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4">
            <Reveal as="figure">
              <img src="/media/buildingbytes-1.jpg" alt="Building Bytes Pitch Program, Kumasi" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </Reveal>
            <Reveal as="figure" delay={0.08}>
              <img src="/media/buildingbytes-2.jpg" alt="Building Bytes demo day" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </Reveal>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

/* ═════ Next ═════ */

export function Contact() {
  const [message, setMessage] = useState("");
  const view = useViewer();
  const send = (event: FormEvent) => {
    event.preventDefault();
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent("From your website")}&body=${encodeURIComponent(message.trim())}`;
  };
  return (
    <Chapter id="contact">
      <Title className="max-w-[12ch]">Bring me the messy data</Title>
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <Reveal as="p" className="text-lead leading-[1.35]">
          Rock, spreadsheets, logbooks, inboxes. The next chapter is whatever you are stuck on. I am open to ML engineering,
          software and research work, in energy or anywhere the data is hard.
        </Reveal>
        <Reveal delay={0.06}>
          <form onSubmit={send}>
            <label htmlFor="message" className="font-semibold">
              What are you working on?
            </label>
            <div className="relative mt-3">
              <input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-describedby="message-note"
                className="h-16 w-full bg-panel pr-20 pl-5 text-ink outline-none focus:outline-2 focus:outline-offset-[-2px] focus:outline-accent"
              />
              <button type="submit" aria-label="Send by email" className="absolute top-2 right-2 flex size-12 items-center justify-center bg-accent text-accent-ink transition-transform active:scale-95">
                <ArrowRight className="size-5" />
              </button>
            </div>
            <p id="message-note" className="mt-3 text-small text-muted">
              Opens your email app with the message filled in.
            </p>
          </form>
          <dl className="mt-10 grid grid-cols-2 gap-6">
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
            <Row label="Code">
              <a href={PROFILE.github} target="_blank" rel="noopener" className="link">
                GitHub
              </a>
              {", "}
              <a href={PROFILE.linkedin} target="_blank" rel="noopener" className="link">
                LinkedIn
              </a>
            </Row>
            <Row label="CV">
              <button type="button" className="link" onClick={() => view({ title: `CV, ${PROFILE.name}`, items: [{ src: PROFILE.cv }] })}>
                Read it here
              </button>
            </Row>
          </dl>
          <p className="mt-10 text-small text-muted">
            References: {REFERENCES.map((r) => `${r.name}, ${r.role}`).join("; ")}. Details on request.
          </p>
        </Reveal>
      </div>
    </Chapter>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-small text-muted">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative isolate flex min-h-[80svh] flex-col justify-between overflow-hidden pt-10 pb-10 text-[#ecebe7]">
      <img src="/portrait.jpg" alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover brightness-[0.38]" style={{ objectPosition: "50% 30%" }} />
      <div className="frame flex w-full flex-wrap justify-between gap-6">
        <span>Accra, Ghana</span>
        <a href="#top" className="hover:underline">
          Back to the top
        </a>
      </div>
      <div className="frame w-full">
        <p aria-hidden className="monument">
          Takyi-Amponsem
        </p>
        <p className="mt-6 text-small">© {new Date().getFullYear()} Deon Takyi-Amponsem.</p>
      </div>
    </footer>
  );
}
