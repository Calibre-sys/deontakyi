import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CERTS, MOMENTS, PAPERS, PROFILE, PROJECTS, SHELVES } from "@/data";
import { BookCover } from "./book-cover";
import { OutreachEmail, Shortlist } from "./fragments";

/*
 * The stage is the half of the page that never moves. Each section names what the stage shows
 * while it is in view, and a selection inside a section (a paper, a certificate, a project, a book)
 * changes the picture. Changes are a slow crossfade.
 */

export type Picks = { paper: string; cert: string; project: string; book: string };

type StageState = {
  section: string;
  picks: Picks;
  pick: (key: keyof Picks, value: string) => void;
};

const StageContext = createContext<StageState | null>(null);
export const useStage = () => useContext(StageContext)!;

const ALL_BOOKS = SHELVES.flatMap((shelf) => shelf.books);

export function StageProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState("intro");
  const [picks, setPicks] = useState<Picks>({
    paper: PAPERS[0].id,
    cert: CERTS[0].id,
    project: PROJECTS[0].id,
    book: ALL_BOOKS[0].id,
  });

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setSection(entry.target.getAttribute("data-stage")!);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const value = useMemo(
    () => ({ section, picks, pick: (key: keyof Picks, v: string) => setPicks((p) => ({ ...p, [key]: v })) }),
    [section, picks],
  );
  return <StageContext.Provider value={value}>{children}</StageContext.Provider>;
}

type Shot = { key: string; caption: string; fill: "photo" | "field"; node: ReactNode };

function shotFor(section: string, picks: Picks): Shot {
  switch (section) {
    case "research": {
      const paper = PAPERS.find((p) => p.id === picks.paper)!;
      return {
        key: `paper-${paper.id}`,
        caption: `${paper.venue}, ${paper.date.split(" · ")[0]}`,
        fill: "field",
        node: <PaperObject id={paper.id} />,
      };
    }
    case "certificates": {
      const cert = CERTS.find((c) => c.id === picks.cert)!;
      return {
        key: `cert-${cert.id}`,
        caption: `${cert.issuer}, ${cert.date}`,
        fill: "field",
        node: <img src={cert.preview} alt={`${cert.title} certificate`} className="block w-[82%] max-w-[44rem]" />,
      };
    }
    case "work": {
      const project = PROJECTS.find((p) => p.id === picks.project)!;
      if (project.video) {
        return {
          key: `work-${project.id}`,
          caption: `${project.name}, screen recording`,
          fill: "photo",
          node: <LoopVideo src={project.video} poster={project.poster!} label={`${project.name} demo`} />,
        };
      }
      return {
        key: `work-${project.id}`,
        caption: `${project.name}, sample output`,
        fill: "field",
        node: project.id === "manpower" ? <OutreachEmail /> : <Shortlist />,
      };
    }
    case "reading": {
      const book = ALL_BOOKS.find((b) => b.id === picks.book)!;
      return {
        key: `book-${book.id}`,
        caption: `${book.title}, ${book.author}`,
        fill: "field",
        node: <BookCover book={book} className="w-[46%] max-w-[22rem]" eager />,
      };
    }
    case "events":
      return { key: "events", caption: "", fill: "photo", node: <Slideshow /> };
    case "experience":
      return {
        key: "experience",
        caption: "At the Africa Technology Conference, Abidjan, 2026",
        fill: "photo",
        node: <Photo src="/media/atc-2026.jpg" alt="Deon at the Africa Technology Conference in Abidjan" position="50% 30%" />,
      };
    case "contact":
      return {
        key: "contact",
        caption: "Deon Takyi-Amponsem, Accra",
        fill: "photo",
        node: <Photo src="/portrait.jpg" alt={`${PROFILE.name} in Accra`} position="40% 40%" />,
      };
    default:
      return {
        key: "portrait",
        caption: "Deon Takyi-Amponsem",
        fill: "photo",
        node: <Photo src={PROFILE.portrait} alt={`Portrait of ${PROFILE.name}`} position="50% 25%" eager />,
      };
  }
}

/** The fixed half on desktop. */
export function Stage() {
  const { section, picks } = useStage();
  const shot = shotFor(section, picks);
  const [slideCaption, setSlideCaption] = useState(MOMENTS[0].title);
  const caption = shot.key === "events" ? slideCaption : shot.caption;

  return (
    <div className="sticky top-0 hidden h-svh overflow-hidden bg-field lg:block">
      <SlideCaption.Provider value={setSlideCaption}>
        <AnimatePresence initial={false}>
          <motion.div
            key={shot.key}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: shot.fill === "field" ? "var(--field)" : undefined }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            {shot.node}
          </motion.div>
        </AnimatePresence>
      </SlideCaption.Provider>
      {/* The bar across the foot of the picture, like the header strip on a well log. */}
      <div className="absolute inset-x-0 bottom-0 flex h-14 items-center justify-between gap-6 bg-bg px-6 text-small">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={caption}
            className="truncate"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {caption}
          </motion.span>
        </AnimatePresence>
        <span className="shrink-0 text-muted">Accra, Ghana</span>
      </div>
    </div>
  );
}

/** On phones and tablets each section shows its own picture inline instead of the fixed half. */
export function InlineShot({
  section,
  ratio = "4 / 5",
  className,
  caption = true,
}: {
  section: string;
  ratio?: string;
  className?: string;
  caption?: boolean;
}) {
  const { picks } = useStage();
  const shot = shotFor(section, picks);
  return (
    <figure className={`lg:hidden ${className ?? ""}`}>
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ aspectRatio: ratio, background: shot.fill === "field" ? "var(--field)" : undefined }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={shot.key}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {shot.node}
          </motion.div>
        </AnimatePresence>
      </div>
      {caption && shot.caption && <figcaption className="mt-3 text-small text-muted">{shot.caption}</figcaption>}
    </figure>
  );
}

const SlideCaption = createContext<(caption: string) => void>(() => {});

function Photo({ src, alt, position = "50% 50%", eager }: { src: string; alt: string; position?: string; eager?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      className="absolute inset-0 size-full object-cover"
      style={{ objectPosition: position }}
    />
  );
}

function LoopVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const reduce = useReducedMotion();
  return (
    <video
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      autoPlay={!reduce}
      preload="metadata"
      className="absolute inset-0 size-full bg-black object-contain"
    />
  );
}

/** The signature move: the event photographs crossfade in turn, slowly. */
export function Slideshow({ inline }: { inline?: boolean }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const setCaption = useContext(SlideCaption);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    setCaption(MOMENTS[index].title);
  }, [index, setCaption]);

  useEffect(() => {
    if (reduce) return;
    const start = () => {
      clearInterval(timer.current);
      timer.current = setInterval(() => setIndex((i) => (i + 1) % MOMENTS.length), 5200);
    };
    const onVisibility = () => (document.hidden ? clearInterval(timer.current) : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(timer.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return (
    <button
      type="button"
      onClick={() => setIndex((i) => (i + 1) % MOMENTS.length)}
      aria-label={`Photo ${index + 1} of ${MOMENTS.length}: ${MOMENTS[index].title}. Show the next photo`}
      className="absolute inset-0 size-full cursor-pointer"
    >
      {MOMENTS.map((moment, i) => (
        <motion.img
          key={moment.id}
          src={moment.src}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0, scale: i === index && !reduce ? 1.04 : 1 }}
          transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 7, ease: "linear" } }}
        />
      ))}
      {inline && <span className="sr-only">{MOMENTS[index].title}</span>}
    </button>
  );
}

function PaperObject({ id }: { id: string }) {
  const paper = PAPERS.find((p) => p.id === id)!;
  if (paper.cover) {
    return <img src={paper.cover} alt={`${paper.venue} cover`} className="block w-[42%] max-w-[20rem]" />;
  }
  // The conference proceedings have no cover, so the paper's title page is set in the page's own type.
  return (
    <div className="flex aspect-[3/4] w-[42%] max-w-[20rem] flex-col justify-between bg-paper p-[6%] text-ink" data-ui>
      <span className="text-small">SPE Africa Technology Conference, Abidjan, June 2026</span>
      <span className="font-display text-[clamp(1.25rem,1.9vw,2rem)] leading-[1.02] font-extrabold tracking-[-0.02em]">
        {paper.title}
      </span>
      <span className="text-small">SPE-233427-MS</span>
    </div>
  );
}
