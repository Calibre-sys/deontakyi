import { ArrowDown, ArrowUpRight, BookOpen, MapPin } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { PROFILE, SKILLS, STATS } from "@/data";
import { EASE_OUT, SPRING_MOUSE } from "@/lib/ease";
import { Serif } from "./ui";

const LINES = [
  <>I turn messy, domain-heavy data</>,
  <>
    into <Serif>software</Serif> that does
  </>,
  <>
    the work — and <span className="text-gradient">research</span> that holds up.
  </>,
];

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.9, ease: EASE_OUT, delay: 0.1 + i * 0.09 },
        };

  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-36">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <motion.p {...enter(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            {PROFILE.role}
            <span className="text-border-strong">/</span>
            <MapPin className="size-3" /> {PROFILE.location}
          </motion.p>

          <h1 className="text-balance text-[2.3rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[3.35rem] xl:text-[3.6rem]">
            {LINES.map((line, i) => (
              <motion.span key={i} {...enter(i + 1)} className="block">
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p {...enter(4)} className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            I'm Deon. I trained as a petroleum engineer and taught myself to code. Now I publish ML research on
            reservoir characterization and build tools that take hours of manual work off people's desks.
          </motion.p>

          <motion.div {...enter(5)} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#research"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform active:scale-[0.97]"
            >
              <BookOpen className="size-4" /> Read the research
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-border-strong bg-background px-5 text-sm font-medium transition-colors hover:bg-card"
            >
              GitHub
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.25 }}
          className="mx-auto w-full max-w-[18rem] sm:max-w-sm"
        >
          <TiltPortrait />
        </motion.div>
      </div>

      <motion.dl
        {...enter(6)}
        className="relative mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 sm:px-6 lg:grid-cols-4"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="border-t border-border py-5 pr-4">
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block text-3xl font-semibold tracking-tight sm:text-4xl">{stat.value}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{stat.label}</span>
            </dd>
          </div>
        ))}
      </motion.dl>

      <SkillMarquee />
    </section>
  );
}

function TiltPortrait() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, SPRING_MOUSE);
  const sy = useSpring(py, SPRING_MOUSE);
  const rotateX = useTransform(sy, [0, 1], [7, -7]);
  const rotateY = useTransform(sx, [0, 1], [-9, 9]);
  const shine = useTransform(
    [sx, sy] as const,
    ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgb(255 255 255 / 0.28), transparent 55%)`,
  );

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - box.left) / box.width);
    py.set((event.clientY - box.top) / box.height);
  };
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="[perspective:1000px]" onPointerMove={move} onPointerLeave={leave}>
      <motion.figure
        style={reduce ? undefined : { rotateX, rotateY }}
        className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_80px_-30px_rgb(0_0_0/0.45)]"
      >
        <img src={PROFILE.portrait} alt={`Portrait of ${PROFILE.name}`} className="size-full object-cover" />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: shine }} />
        <figcaption className="glass absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl border px-4 py-3">
          <span>
            <span className="block text-sm font-semibold">{PROFILE.name}</span>
            <span className="block text-xs text-muted-foreground">KNUST · AI-DPRS Lab · SOH Energy</span>
          </span>
          <span className="rounded-full bg-foreground px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-background">
            ML
          </span>
        </figcaption>
      </motion.figure>
    </div>
  );
}

function SkillMarquee() {
  const reduce = useReducedMotion();
  const row = [...SKILLS, ...SKILLS];
  return (
    <div className="relative mt-10 overflow-hidden border-y border-border py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.ul
        aria-label="Tools and skills"
        className="flex w-max gap-8 whitespace-nowrap font-mono text-sm text-muted-foreground"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {row.map((skill, i) => (
          <li key={i} aria-hidden={i >= SKILLS.length || undefined} className="flex items-center gap-8">
            {skill}
            <span className="size-1 rounded-full bg-border-strong" />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
