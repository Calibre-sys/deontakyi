import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 * A stack of prints. The front print steps back into the deck on a timer, or with the controls.
 * Restrained on purpose: small offsets, one soft shadow, plain captions.
 */

type Print = { src: string; alt: string; place: string; year: string; position: string };

const PRINTS: Print[] = [
  { src: "/portrait-card.jpg", alt: "Portrait of Deon Takyi-Amponsem", place: "Accra", year: "2025", position: "50% 22%" },
  { src: "/media/atc-2026.jpg", alt: "At the SPE Africa Technology Conference, Abidjan", place: "SPE ATC, Abidjan", year: "2026", position: "50% 30%" },
  { src: "/media/buildingbytes-1.jpg", alt: "Building Bytes Pitch Program, Kumasi", place: "Building Bytes, Kumasi", year: "2025", position: "55% 40%" },
  { src: "/media/energy4me-2.jpg", alt: "SPE Energy4me outreach in a classroom", place: "SPE Energy4me outreach", year: "2024", position: "60% 40%" },
  { src: "/media/buildingbytes-2.jpg", alt: "Building Bytes demo day", place: "Building Bytes demo day", year: "2025", position: "50% 45%" },
];

const INTERVAL = 5000;
const OUT_MS = 320;
const IN_MS = 520;
const DEPTH = 3; // prints visible behind the front one
const OFFSETS = [
  { x: 0, y: 0, r: 0 },
  { x: 10, y: 8, r: 1.6 },
  { x: -8, y: 14, r: -1.4 },
  { x: 6, y: 20, r: 0.8 },
];

export function PhotoStack() {
  const reduce = useReducedMotion();
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // restarts the progress bar
  // The print being carried between the front and the back of the stack.
  const [moving, setMoving] = useState<{ id: number; dir: 1 | -1; phase: "out" | "in" } | null>(null);
  const busy = useRef(false);
  const n = PRINTS.length;

  const go = useCallback(
    (target: number) => {
      const next = ((target % n) + n) % n;
      if (busy.current || next === front) return;
      setTick((t) => t + 1);
      if (reduce) {
        setFront(next);
        return;
      }
      // Forward by one: the front print slides out and tucks in at the back.
      // Back by one: the back print slides out and lands on the front.
      // A jump to any other print just restacks.
      const forward = next === (front + 1) % n;
      const backward = next === (front - 1 + n) % n;
      if (!forward && !backward) {
        setFront(next);
        return;
      }
      busy.current = true;
      const id = forward ? front : next;
      const dir = forward ? 1 : -1;
      setMoving({ id, dir, phase: "out" });
      window.setTimeout(() => {
        setFront(next);
        setMoving({ id, dir, phase: "in" });
      }, OUT_MS);
      window.setTimeout(() => {
        setMoving(null);
        busy.current = false;
      }, OUT_MS + IN_MS);
    },
    [front, n, reduce],
  );

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setTimeout(() => {
      if (!document.hidden) go(front + 1);
      else setTick((t) => t + 1);
    }, INTERVAL);
    return () => window.clearTimeout(id);
  }, [front, tick, paused, reduce, go]);

  const current = PRINTS[front];

  return (
    <div
      className="mx-auto w-full max-w-[28rem]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5]">
        {PRINTS.map((print, i) => {
          const depth = (i - front + n) % n;
          const isMoving = moving?.id === i;
          const o = OFFSETS[Math.min(depth, DEPTH)];
          const rest = { x: o.x, y: o.y, rotate: o.r, scale: 1 - Math.min(depth, DEPTH) * 0.012, opacity: depth <= DEPTH ? 1 : 0 };
          // Out: clear of the stack to one side. Forward goes right, back goes left.
          const out = moving && { x: `${moving.dir * 62}%`, y: -6, rotate: moving.dir * 7, scale: 1, opacity: 1 };
          let pose: { x: number | string; y: number; rotate: number; scale: number; opacity: number } = rest;
          let z = 10 - depth;
          let transition: object = reduce ? { duration: 0 } : { type: "spring", stiffness: 190, damping: 27 };
          if (isMoving && moving && out) {
            if (moving.phase === "out") {
              pose = out;
              z = moving.dir === 1 ? 20 : 0; // forward: still on top; back: still underneath
              transition = { duration: OUT_MS / 1000, ease: [0.22, 1, 0.36, 1] };
            } else {
              pose = { ...rest, opacity: 1 };
              z = moving.dir === 1 ? 0 : 20; // swaps sides of the stack while clear of it
              transition = { type: "spring", stiffness: 210, damping: 28 };
            }
          }
          return (
            <motion.figure
              key={print.src}
              aria-hidden={depth !== 0}
              className="absolute inset-0 flex flex-col bg-[#f7f6f2] p-[4.5%] pb-0 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.5),0_1px_2px_rgb(0_0_0/0.12)] dark:bg-[#ecebe6]"
              style={{ zIndex: z }}
              initial={false}
              animate={pose}
              transition={transition}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden bg-neutral-300">
                <img
                  src={print.src}
                  alt={depth === 0 ? print.alt : ""}
                  draggable={false}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 size-full object-cover"
                  style={{ objectPosition: print.position }}
                />
              </div>
              <figcaption className="flex items-baseline justify-between gap-3 px-[1%] py-[3.5%] font-[family-name:var(--font-hand)] text-[clamp(1.25rem,1rem+0.7vw,1.6rem)] leading-none font-semibold text-neutral-800">
                <span className="truncate">{print.place}</span>
                <span className="shrink-0 text-neutral-600">'{print.year.slice(2)}</span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      {/* Controls: previous, a progress segment per print, next. */}
      <div className="mt-9 flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(front - 1)}
          aria-label="Previous photo"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card-2 hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex flex-1 gap-1.5" role="group" aria-label="Photos">
          {PRINTS.map((print, i) => (
            <button
              key={print.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1}: ${print.place}`}
              aria-current={i === front ? "true" : undefined}
              className="group relative h-6 flex-1"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-border-strong/60 transition-colors group-hover:bg-border-strong">
                {i < front && <span className="absolute inset-0 bg-foreground/70" />}
                {i === front && (
                  <span
                    key={tick}
                    className="absolute inset-y-0 left-0 bg-foreground"
                    style={{
                      width: reduce ? "100%" : undefined,
                      animation: reduce ? undefined : `stack-progress ${INTERVAL}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(front + 1)}
          aria-label="Next photo"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card-2 hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {current.place}, {current.year}
      </p>
    </div>
  );
}
