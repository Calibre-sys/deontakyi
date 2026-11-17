import { Bot, FileText, Mail, Maximize2, RotateCcw } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Loader } from "@/components/motion/loader";
import { useViewer } from "@/components/viewer";
import { cn } from "@/lib/utils";

/* ───────── Window frame: makes media read as a real, running product ───────── */

export function WindowFrame({ address, children, className }: { address: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card-2 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]", className)}>
      <div className="flex h-9 items-center gap-3 border-b border-border bg-card px-3.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-border-strong/70" />
          <span className="size-2.5 rounded-full bg-border-strong/70" />
          <span className="size-2.5 rounded-full bg-border-strong/70" />
        </div>
        <div className="mx-auto flex h-5 min-w-0 max-w-[60%] items-center justify-center rounded-md bg-card-2 px-3 font-mono text-[0.6875rem] text-muted-foreground">
          <span className="truncate">{address}</span>
        </div>
        <span className="w-[42px]" aria-hidden />
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
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onPlaying={() => setReady(true)}
        className="size-full object-cover"
      />
      {!ready && inView && !reduce && (
        <div className="pointer-events-none absolute right-3 bottom-3 rounded-md bg-black/60 p-2 text-white/90 backdrop-blur">
          <Loader variant="dither" size={16} speed={1} label="Loading video" />
        </div>
      )}
      <button
        type="button"
        onClick={() => view({ title: `${title} · demo`, items: [{ src }], download: false })}
        className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-[0.75rem] font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        aria-label={`Watch the ${title} demo full screen`}
      >
        <Maximize2 className="size-3.5" /> full screen
      </button>
    </div>
  );
}

/* ───────── Outreach: 880 contacts, replayed ───────── */

const COLS = 40;
const ROWS = 22; // 40 × 22 = 880 contacts
const TOTAL = COLS * ROWS;
const CONVERTED = 455;
const FIRST_WAVE = 290; // replies before the day-3 follow-up: illustrative split of the real 455
const DURATION = 5200;

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
const ORDER = order();
const RANK = new Int16Array(TOTAL);
ORDER.forEach((cell, rank) => (RANK[cell] = rank));

export function OutreachReplay() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stats, setStats] = useState({ sent: 0, replied: 0, day: 0 });

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
      const dim = css.getPropertyValue("--border").trim();
      const sentC = css.getPropertyValue("--border-strong").trim();
      const accent = css.getPropertyValue("--accent").trim();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // 0–0.22: emails go out, sweeping across the sheet. Then replies arrive; a follow-up at day 3 brings a second wave.
      const sentFrac = Math.min(1, p / 0.22);
      const replied =
        p < 0.22 ? 0 : p < 0.6 ? FIRST_WAVE * ease((p - 0.22) / 0.38) : p < 0.68 ? FIRST_WAVE : FIRST_WAVE + (CONVERTED - FIRST_WAVE) * ease((p - 0.68) / 0.32);
      const r = cell * 0.3;
      for (let i = 0; i < TOTAL; i++) {
        const col = i % COLS;
        const row = (i / COLS) | 0;
        const sent = col / COLS < sentFrac;
        const on = RANK[i] < replied;
        ctx.fillStyle = on ? accent : sent ? sentC : dim;
        ctx.beginPath();
        ctx.arc(col * cell + cell / 2, row * cell + cell / 2, on ? r * 1.15 : r, 0, Math.PI * 2);
        ctx.fill();
      }
      setStats({ sent: Math.round(sentFrac * TOTAL), replied: Math.round(replied), day: p < 0.22 ? 0 : p < 0.68 ? 1 + Math.floor(((p - 0.22) / 0.46) * 2) : 3 + Math.floor(((p - 0.68) / 0.32) * 3) });
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

  const done = stats.replied >= CONVERTED;
  return (
    <div className="flex flex-col justify-between gap-4 bg-card p-5 sm:aspect-[16/10] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="kicker">manpower database · 880 contacts</p>
          <p className="mt-1 text-[0.875rem] text-muted-foreground">each dot is one person; teal means they said yes. totals are real, timing is a replay.</p>
        </div>
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[0.75rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3" /> replay
        </button>
      </div>
      <div ref={wrap} className="w-full">
        <canvas ref={canvas} className="block w-full" role="img" aria-label="880 dots, one per contact. 455 of them light up as replies arrive, 52 percent, with no phone calls." />
      </div>
      <div className="grid grid-cols-3 gap-3 border-t border-border pt-4 font-mono text-[0.75rem]">
        <Stat label="emails sent" value={stats.sent} />
        <Stat label={stats.day >= 3 ? "follow-ups out" : "day"} value={stats.day >= 3 ? "day 3" : `day ${stats.day}`} />
        <Stat label="converted" value={stats.replied} accent={done} />
      </div>
    </div>
  );
}

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div data-no-scramble>
      <p className="text-muted-foreground uppercase tracking-[0.12em] text-[0.625rem]">{label}</p>
      <p className={cn("mt-1 text-[1.125rem] tabular-nums text-foreground", accent && "text-accent")}>{value}</p>
    </div>
  );
}

/* ───────── Recruiter: CVs in, ranked shortlist out (illustration) ───────── */

const CANDIDATES = [
  { id: "C-07", score: 0.91 },
  { id: "C-02", score: 0.84 },
  { id: "C-11", score: 0.77 },
  { id: "C-04", score: 0.62 },
  { id: "C-09", score: 0.48 },
];

export function RecruiterFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const show = inView || reduce;
  return (
    <div ref={ref} className="grid grid-cols-[auto_1fr] items-center gap-5 bg-card p-5 sm:aspect-[16/10] sm:grid-cols-[1fr_auto_1.35fr] sm:gap-6 sm:p-7">
      {/* CVs */}
      <div className="relative hidden h-[62%] sm:block">
        {[3, 2, 1, 0].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-x-0 top-0 flex h-[78%] flex-col gap-2 rounded-lg border border-border bg-card-2 p-3 shadow-[0_10px_24px_-14px_rgb(0_0_0/0.6)]"
            style={{ zIndex: 5 - i, translateY: `${i * 7}%`, scale: 1 - i * 0.05, transformOrigin: "50% 100%" }}
            initial={reduce ? false : { opacity: 0, x: -16 }}
            animate={show ? { opacity: 1 - i * 0.18, x: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <FileText className="size-4 text-muted-foreground" />
            <span className="h-1.5 w-2/3 rounded-full bg-border-strong/70" />
            <span className="h-1 w-full rounded-full bg-border-strong/40" />
            <span className="h-1 w-5/6 rounded-full bg-border-strong/40" />
            <span className="h-1 w-3/4 rounded-full bg-border-strong/40" />
          </motion.div>
        ))}
        <p className="kicker absolute bottom-0 left-0">CVs in</p>
      </div>

      {/* Agent */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative flex size-14 items-center justify-center rounded-2xl border border-accent/40 bg-accent-soft text-accent sm:size-16">
          <Bot className="size-6" />
          {show && !reduce && <span className="absolute inset-0 rounded-2xl border border-accent/50" style={{ animation: "ping-soft 2.4s ease-out infinite" }} />}
        </div>
        <span className="kicker">agent</span>
        <span className="text-accent">
          <Loader variant="dots" size={18} label="Screening" />
        </span>
      </div>

      {/* Ranked */}
      <div className="flex flex-col gap-2">
        <p className="kicker mb-1">ranked shortlist</p>
        {CANDIDATES.map((c, i) => (
          <motion.div
            key={c.id}
            className="flex items-center gap-2.5 rounded-md border border-border bg-card-2 px-2.5 py-1.5"
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }}
          >
            <span className="w-4 font-mono text-[0.6875rem] text-muted-foreground">{i + 1}</span>
            <span className="font-mono text-[0.6875rem]">{c.id}</span>
            <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-border">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
                initial={reduce ? false : { width: 0 }}
                animate={show ? { width: `${c.score * 100}%` } : {}}
                transition={{ delay: 0.8 + i * 0.12, duration: 0.8 }}
              />
            </span>
            {i < 3 && <Mail className="size-3.5 text-accent" aria-label="email drafted" />}
          </motion.div>
        ))}
        <p className="mt-1 text-[0.6875rem] text-muted-foreground">illustration · candidate data stays private</p>
      </div>
    </div>
  );
}
