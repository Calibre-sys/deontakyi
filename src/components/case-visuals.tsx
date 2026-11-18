import { Check, Mail, Maximize2, RotateCcw } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Loader } from "@/components/motion/loader";
import { useViewer } from "@/components/viewer";
import { cn } from "@/lib/utils";

/* ───────── Window frame: a macOS-style window around media ───────── */

export function WindowFrame({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-frame", className)}>
      <div className="relative flex h-9 items-center border-b border-border bg-card px-3.5">
        <div className="flex gap-2" aria-hidden>
          <span className="size-3 rounded-full bg-mac-red" />
          <span className="size-3 rounded-full bg-mac-yellow" />
          <span className="size-3 rounded-full bg-mac-green" />
        </div>
        {title && <span className="pointer-events-none absolute inset-x-20 truncate text-center text-[0.8125rem] font-medium text-muted-foreground">{title}</span>}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/** A screen recording that plays while it's on screen, with the dither loader until it can play. */
export function CaseVideo({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { margin: "-20% 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const view = useViewer();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduce) {
      v.preload = "auto";
      void v.play().catch(() => {});
    } else v.pause();
  }, [inView, reduce]);

  return (
    <div ref={box} className="group relative aspect-[16/10] bg-black">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" onPlaying={() => setReady(true)} className="size-full object-cover" />
      {!ready && inView && !reduce && (
        <div className="pointer-events-none absolute right-3 bottom-3 rounded-md bg-black/75 p-2 text-white/90">
          <Loader variant="dither" size={16} speed={1} label="Loading video" />
        </div>
      )}
      <button
        type="button"
        onClick={() => view({ title, items: [{ src, poster }], download: false })}
        className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1.5 text-[0.75rem] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        aria-label={`Watch the ${title} demo full screen`}
      >
        <Maximize2 className="size-3.5" /> Full screen
      </button>
    </div>
  );
}

/* ───────── Outreach: 880 contacts, replayed ───────── */

const COLS = 40;
const ROWS = 22; // 40 × 22 = 880 contacts
const TOTAL = COLS * ROWS;
const CONVERTED = 455;
const DURATION = 4200;

/** Stable shuffle, so the same dots light every time. */
function order() {
  const a = Array.from({ length: TOTAL }, (_, i) => i);
  let seed = 7;
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const RANK = new Int16Array(TOTAL);
order().forEach((cell, rank) => (RANK[cell] = rank));

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

export function OutreachReplay() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stats, setStats] = useState({ sent: 0, yes: 0 });

  useEffect(() => {
    const c = canvas.current;
    const box = wrap.current;
    if (!c || !box || (!inView && !reduce)) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const start = performance.now();

    const draw = (p: number) => {
      const w = box.clientWidth;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cell = w / COLS;
      const h = cell * ROWS;
      if (c.width !== Math.round(w * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
        c.style.height = `${h}px`;
      }
      const css = getComputedStyle(document.documentElement);
      const idle = css.getPropertyValue("--border").trim();
      const sentC = css.getPropertyValue("--border-strong").trim();
      const yesC = css.getPropertyValue("--foreground").trim();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Emails go out across the sheet first, then the replies come in.
      const sentFrac = ease(p / 0.25);
      const yes = p < 0.25 ? 0 : CONVERTED * ease((p - 0.25) / 0.75);
      const r = cell * 0.3;
      for (let i = 0; i < TOTAL; i++) {
        const col = i % COLS;
        const row = (i / COLS) | 0;
        const on = RANK[i] < yes;
        ctx.fillStyle = on ? yesC : col / COLS < sentFrac ? sentC : idle;
        ctx.beginPath();
        ctx.arc(col * cell + cell / 2, row * cell + cell / 2, r, 0, Math.PI * 2);
        ctx.fill();
      }
      setStats({ sent: Math.round(sentFrac * TOTAL), yes: Math.round(yes) });
    };

    if (reduce) {
      draw(1);
      return;
    }
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      draw(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(() => draw(Math.min(1, (performance.now() - start) / DURATION)));
    ro.observe(box);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView, reduce, run]);

  return (
    <div className="flex flex-col gap-5 bg-card p-5 sm:aspect-[16/10] sm:justify-between sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.875rem] text-muted-foreground">880 contacts</p>
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          aria-label="Replay"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card-2 hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
      <div ref={wrap} className="w-full">
        <canvas ref={canvas} className="block w-full" role="img" aria-label="880 dots, one per contact. 455 of them fill in as people say yes." />
      </div>
      <dl className="grid grid-cols-3 gap-4 border-t border-border pt-4" data-no-scramble>
        <Stat label="Emails sent" value={stats.sent} />
        <Stat label="Said yes" value={stats.yes} />
        <Stat label="Phone calls" value={0} />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[0.8125rem] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-[1.25rem] font-semibold tracking-[-0.02em] tabular-nums">{value}</dd>
    </div>
  );
}

/* ───────── Recruiter: a shortlist sheet the agent fills in and sorts ───────── */

const CANDIDATES = [
  { id: "A", score: 62 },
  { id: "B", score: 88 },
  { id: "C", score: 47 },
  { id: "D", score: 91 },
  { id: "E", score: 73 },
  { id: "F", score: 55 },
];
const SHORTLIST = 3;
const RANKED = [...CANDIDATES].sort((a, b) => b.score - a.score);
const RANK_OF = new Map(RANKED.map((c, i) => [c.id, i]));
const GRID = "grid grid-cols-[1.5rem_2.5rem_1fr_7.5rem] sm:grid-cols-[2.25rem_1fr_8rem_8.5rem]";

export function RecruiterFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  // How many rows the agent has scored; one step past the last, the sheet sorts itself.
  const [scored, setScored] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce) {
      setScored(CANDIDATES.length + 1);
      return;
    }
    if (!inView) return;
    setScored(0);
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      setScored(n);
      if (n > CANDIDATES.length) window.clearInterval(id);
    }, 520);
    return () => window.clearInterval(id);
  }, [inView, reduce, run]);

  const done = scored > CANDIDATES.length;
  const rows = done ? RANKED : CANDIDATES;

  return (
    <div ref={ref} className="flex flex-col bg-card" data-no-scramble>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <p className="text-[0.875rem] font-medium">Candidates</p>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="inline-flex h-7 items-center gap-2 rounded-md border border-border bg-background px-2.5 text-[0.75rem] font-medium whitespace-nowrap"
        >
          {done ? (
            <>
              <Check className="size-3.5" /> Shortlist ready
            </>
          ) : (
            <>
              <Loader variant="dots" size={14} label="Screening" /> Screening
            </>
          )}
        </button>
      </div>
      <div className="px-2 pt-2 pb-4 sm:px-3 sm:pb-6">
        <div className={cn(GRID, "px-2 py-2 text-[0.75rem] text-muted-foreground")}>
          <span>#</span>
          <span className="truncate"><span className="sm:hidden">&nbsp;</span><span className="hidden sm:inline">Candidate</span></span>
          <span>Match</span>
          <span>Status</span>
        </div>
        <ul>
          {rows.map((c, i) => {
            const isScored = CANDIDATES.indexOf(c) < scored;
            const short = done && (RANK_OF.get(c.id) ?? 9) < SHORTLIST;
            return (
              <motion.li
                key={c.id}
                layout={!reduce}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                className={cn(GRID, "items-center rounded-md px-2 py-2 text-[0.8125rem]", short && "bg-card-2")}
              >
                <span className="tabular-nums text-muted-foreground">{done ? i + 1 : "–"}</span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card-2 text-[0.6875rem] font-medium text-muted-foreground ring-1 ring-border">
                    {c.id}
                  </span>
                  <span className="hidden truncate sm:inline">Candidate {c.id}</span>
                </span>
                <span className="flex items-center gap-2 pr-3">
                  <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full bg-foreground"
                      initial={false}
                      animate={{ width: isScored ? `${c.score}%` : "0%" }}
                      transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className="w-5 text-right tabular-nums text-muted-foreground">{isScored ? c.score : ""}</span>
                </span>
                <span className={cn("flex items-center gap-1.5 text-[0.78125rem]", short ? "text-foreground" : "text-muted-foreground")}>
                  {short ? (
                    <>
                      <Mail className="size-3.5" /> Email drafted
                    </>
                  ) : done ? (
                    "Not shortlisted"
                  ) : isScored ? (
                    "Scored"
                  ) : (
                    "Waiting"
                  )}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
