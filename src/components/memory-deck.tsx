import { Check, RotateCcw } from "lucide-react";
import { motion, type TargetAndTransition, type Transition, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * A memory game dressed as a tiny training run. Six photos (x) and six event labels (y)
 * are dealt face down from a pile in the middle of the table. The cards flip up for a
 * short look, then the player pairs each image with its label. Every pair turned is an
 * epoch; accuracy is matches over epochs. Collect re-shuffles and deals again.
 */

type Pair = { id: string; src: string; alt: string; label: string; year?: string; position: string };
type Card = { key: string; pair: string; kind: "x" | "y" };

const PAIRS: Pair[] = [
  { id: "me", src: "/portrait-card.jpg", alt: "Portrait of Deon Takyi-Amponsem", label: "me, in Accra", year: "25", position: "50% 22%" },
  { id: "atc", src: "/media/atc-2026.jpg", alt: "At the SPE Africa Technology Conference", label: "SPE ATC, Abidjan", year: "26", position: "50% 30%" },
  { id: "bb1", src: "/media/buildingbytes-1.jpg", alt: "Building Bytes pitch program", label: "Building Bytes pitch, Kumasi", year: "25", position: "55% 40%" },
  { id: "bb2", src: "/media/buildingbytes-2.jpg", alt: "Building Bytes demo day", label: "Building Bytes demo day", year: "25", position: "50% 45%" },
  { id: "e4m", src: "/media/energy4me-2.jpg", alt: "SPE Energy4me outreach in a classroom", label: "Energy4me outreach", year: "24", position: "60% 40%" },
  { id: "rch", src: "/media/reschar-poster.jpg", alt: "The RescharAI desktop app", label: "RescharAI, shipped", position: "30% 50%" },
];
const BY_ID = Object.fromEntries(PAIRS.map((p) => [p.id, p]));

const COLS = 3;
const ROWS = 4;
const STAGGER = 0.07; // s between cards leaving the pile
const FLIGHT = 0.62; // s per flight
const PEEK_MS = 1500; // the look at the "training data" after a deal
const MISS_MS = 850; // how long a wrong pair stays up

const CARDS: Card[] = PAIRS.flatMap((p) => [
  { key: `${p.id}-x`, pair: p.id, kind: "x" as const },
  { key: `${p.id}-y`, pair: p.id, kind: "y" as const },
]);

function shuffled<T>(items: T[]) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type Phase = "pile" | "dealing" | "peek" | "play" | "done";

export function MemoryDeck() {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState<Card[]>(() => shuffled(CARDS)); // slot order
  const [phase, setPhase] = useState<Phase>("pile");
  const [up, setUp] = useState<string[]>([]); // the one or two cards turned this epoch
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [epochs, setEpochs] = useState(0);
  const [round, setRound] = useState(0); // remounts the flight keyframes on each deal
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const deal = useCallback(
    (fresh: boolean) => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      const flightMs = reduce ? 0 : (CARDS.length * STAGGER + FLIGHT) * 1000;
      const start = () => {
        if (fresh) setOrder(shuffled(CARDS));
        setUp([]);
        setMatched(new Set());
        setEpochs(0);
        setRound((r) => r + 1);
        setPhase("dealing");
        later(() => setPhase("peek"), flightMs + 120);
        later(() => setPhase("play"), flightMs + 120 + PEEK_MS);
      };
      // Sweep everything back to the pile first, face down, then deal the new order.
      setPhase("pile");
      setUp([]);
      later(start, fresh && !reduce ? 650 : 0);
    },
    [later, reduce],
  );

  // Open with a deal once the hero has settled.
  useEffect(() => {
    const id = window.setTimeout(() => deal(false), 700);
    return () => window.clearTimeout(id);
  }, [deal]);

  const turn = (card: Card) => {
    if (phase !== "play" || up.length >= 2 || up.includes(card.key) || matched.has(card.pair)) return;
    const next = [...up, card.key];
    setUp(next);
    if (next.length < 2) return;
    setEpochs((e) => e + 1);
    const [a, b] = next.map((k) => CARDS.find((c) => c.key === k)!);
    if (a.pair === b.pair) {
      const m = new Set(matched).add(a.pair);
      later(() => {
        setMatched(m);
        setUp([]);
        if (m.size === PAIRS.length) setPhase("done");
      }, 260);
    } else {
      later(() => setUp([]), MISS_MS);
    }
  };

  const hits = matched.size;
  const acc = epochs ? Math.round((hits / epochs) * 100) : 0;
  const status =
    phase === "pile" || phase === "dealing"
      ? "dealing the dataset…"
      : phase === "peek"
        ? "memorise the training data"
        : phase === "done"
          ? `converged in ${epochs} epochs`
          : "match each image to its label";

  return (
    <div className="mx-auto w-full max-w-[28rem]">
      <div
        className="relative aspect-[4/5] [perspective:1100px]"
        role="group"
        aria-label="Memory game: match each photo to the event it shows"
      >
        {order.map((card, slot) => {
          const col = slot % COLS;
          const row = Math.floor(slot / COLS);
          // Offsets to the pile in the middle, in multiples of a slot.
          const px = ((COLS - 1) / 2 - col) * 100;
          const py = ((ROWS - 1) / 2 - row) * 100;
          const tilt = ((slot * 37) % 9) - 4; // a loose, untidy pile
          const atPile = phase === "pile";
          const isMatched = matched.has(card.pair);
          const faceUp = phase === "peek" || phase === "done" || isMatched || up.includes(card.key);
          const playable = phase === "play" && !faceUp;
          const pair = BY_ID[card.pair];

          let animate: TargetAndTransition;
          let transition: Transition;
          if (atPile) {
            animate = { x: `${px}%`, y: `${py}%`, rotate: tilt, scale: 0.92 };
            transition = reduce ? { duration: 0 } : { duration: 0.45, ease: [0.77, 0, 0.175, 1], delay: slot * 0.015 };
          } else if (phase === "dealing" && !reduce) {
            // Arc out of the pile: up and over, then down into the slot.
            const lift = Math.min(py, 0) / 2 - 22;
            animate = {
              x: [`${px}%`, `${px / 2}%`, "0%"],
              y: [`${py}%`, `${lift}%`, "0%"],
              rotate: [tilt, tilt / 2 - 6, 0],
              scale: [0.92, 1.06, 1],
            };
            transition = { duration: FLIGHT, ease: [0.16, 1, 0.3, 1], delay: slot * STAGGER, times: [0, 0.45, 1] };
          } else {
            animate = { x: "0%", y: "0%", rotate: 0, scale: 1 };
            transition = reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 };
          }

          return (
            <div
              key={card.key}
              className="absolute p-[1.5%]"
              style={{
                left: `${(col / COLS) * 100}%`,
                top: `${(row / ROWS) * 100}%`,
                width: `${100 / COLS}%`,
                height: `${100 / ROWS}%`,
                zIndex: atPile || phase === "dealing" ? 40 - slot : 1,
              }}
            >
              <motion.button
                key={`${card.key}-${round}`}
                type="button"
                onClick={() => turn(card)}
                disabled={!playable}
                aria-label={
                  faceUp
                    ? card.kind === "x"
                      ? `Photo: ${pair.alt}${isMatched ? ", matched" : ""}`
                      : `Label: ${pair.label}${isMatched ? ", matched" : ""}`
                    : `Card ${slot + 1}, face down`
                }
                className={cn(
                  "relative block size-full rounded-[10px] outline-none [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  playable ? "cursor-pointer" : "cursor-default",
                )}
                initial={reduce ? false : { x: `${px}%`, y: `${py}%`, rotate: tilt, scale: 0.92 }}
                animate={animate}
                transition={transition}
                whileHover={playable && !reduce ? { y: "-4%", transition: { type: "spring", stiffness: 500, damping: 28 } } : undefined}
                whileTap={playable && !reduce ? { scale: 0.96 } : undefined}
              >
                <motion.span
                  className="absolute inset-0 block [transform-style:preserve-3d]"
                  initial={false}
                  animate={{ rotateY: faceUp ? 180 : 0 }}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 24 }}
                >
                  <CardBack />
                  <span className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {card.kind === "x" ? <ImageFace pair={pair} /> : <LabelFace pair={pair} />}
                    {isMatched && (
                      <motion.span
                        initial={reduce ? false : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </motion.span>
                    )}
                  </span>
                </motion.span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* The training log. */}
      <div className="mt-7 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-[family-name:var(--font-hand)] text-[1.45rem] leading-none font-semibold">{status}</p>
          <p className="mt-2 font-mono text-[0.75rem] tracking-tight text-muted-foreground tabular-nums">
            epoch {epochs} · acc {acc}% · {hits}/{PAIRS.length} labelled
          </p>
        </div>
        <button
          type="button"
          onClick={() => deal(true)}
          disabled={phase === "pile" || phase === "dealing"}
          className="btn btn-ghost shrink-0 disabled:opacity-50"
        >
          <RotateCcw className="size-4" /> {phase === "done" ? "retrain" : "reshuffle"}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {status}. {hits} of {PAIRS.length} pairs matched.
      </p>
    </div>
  );
}

function CardBack() {
  return (
    <span className="absolute inset-0 overflow-hidden rounded-[10px] border border-white/10 bg-neutral-900 p-[7%] shadow-[0_10px_22px_-12px_rgb(0_0_0/0.55)] [backface-visibility:hidden]">
      <span className="relative block size-full rounded-[6px] border border-primary/35">
        {/* A tiny 3-4-2 network: the deck's crest. */}
        <svg viewBox="0 0 60 60" className="absolute inset-0 m-auto size-[70%] text-primary" aria-hidden="true">
          {[15, 30, 45].flatMap((y1) =>
            [9, 23, 37, 51].map((y2) => <line key={`a${y1}-${y2}`} x1="12" y1={y1} x2="30" y2={y2} stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.8" />),
          )}
          {[9, 23, 37, 51].flatMap((y1) =>
            [22, 38].map((y2) => <line key={`b${y1}-${y2}`} x1="30" y1={y1} x2="48" y2={y2} stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.8" />),
          )}
          {[15, 30, 45].map((y) => <circle key={`i${y}`} cx="12" cy={y} r="3" fill="currentColor" fillOpacity="0.7" />)}
          {[9, 23, 37, 51].map((y) => <circle key={`h${y}`} cx="30" cy={y} r="3" fill="currentColor" fillOpacity="0.45" />)}
          {[22, 38].map((y) => <circle key={`o${y}`} cx="48" cy={y} r="3" fill="currentColor" fillOpacity="0.85" />)}
        </svg>
      </span>
    </span>
  );
}

function Tag({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <span
      className={cn(
        "absolute bottom-1.5 left-1.5 rounded-[4px] px-1 font-mono text-[0.625rem] leading-[1.35] font-semibold",
        dark ? "bg-black/55 text-white" : "bg-neutral-900/8 text-neutral-600",
      )}
    >
      {children}
    </span>
  );
}

function ImageFace({ pair }: { pair: Pair }) {
  return (
    <span className="absolute inset-0 overflow-hidden rounded-[10px] bg-[#f7f6f2] p-[5%] shadow-[0_10px_22px_-12px_rgb(0_0_0/0.5),0_1px_2px_rgb(0_0_0/0.12)] dark:bg-[#ecebe6]">
      <span className="relative block size-full overflow-hidden rounded-[5px] bg-neutral-300">
        <img
          src={pair.src}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: pair.position }}
        />
        <Tag dark>x</Tag>
      </span>
    </span>
  );
}

function LabelFace({ pair }: { pair: Pair }) {
  return (
    <span className="absolute inset-0 flex flex-col justify-center overflow-hidden rounded-[10px] bg-[#f7f6f2] px-[9%] text-left shadow-[0_10px_22px_-12px_rgb(0_0_0/0.5),0_1px_2px_rgb(0_0_0/0.12)] dark:bg-[#ecebe6]">
      <span className="font-[family-name:var(--font-hand)] text-[clamp(1rem,0.8rem+0.9vw,1.3rem)] leading-[1.02] font-semibold text-neutral-800">
        {pair.label}
      </span>
      {pair.year && <span className="mt-1 font-[family-name:var(--font-hand)] text-[1rem] leading-none text-neutral-500">'{pair.year}</span>}
      <Tag>y</Tag>
    </span>
  );
}
