import { motion, useInView, useReducedMotion } from "motion/react";
import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { MEAN_SEVEN, MEAN_THREE, OIL_FORECAST, OIL_MONTHLY } from "@/lib/visual-data";
import { cn } from "@/lib/utils";

export type VisualKind = "forecast" | "wells" | "digits";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectVisual({ kind }: { kind: VisualKind }) {
  if (kind === "forecast") return <Forecast />;
  if (kind === "wells") return <Wells />;
  return <Digits />;
}

const note = "font-hand text-[1.125rem] leading-none text-muted-foreground";

/* ───────── ARIMA: the real series, then the forecast drawing itself on ───────── */

function Forecast() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const [W, setW] = useState(600);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const all = [...OIL_MONTHLY, ...OIL_FORECAST];
  const H = 120;
  const max = 2_250_000;
  const x = (i: number) => (i / (all.length - 1)) * W;
  const y = (v: number) => H - (v / max) * H;
  const line = (from: number, to: number) =>
    all
      .slice(from, to)
      .map((v, i) => `${i ? "L" : "M"}${x(from + i).toFixed(1)},${y(v).toFixed(1)}`)
      .join(" ");
  const split = OIL_MONTHLY.length - 1;

  const label = (i: number) => {
    const year = 2018 + Math.floor(i / 12);
    const month = new Date(2000, i % 12).toLocaleString("en", { month: "short" });
    return `${month} ${year}`;
  };

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (all.length - 1));
    setHover(Math.max(0, Math.min(all.length - 1, i)));
  };

  return (
    <div className="select-none">
      <div className="mb-2 flex items-end justify-between gap-4">
        <span className={note}>barrels a month</span>
        <span className="text-[0.8125rem] tabular-nums text-muted-foreground">
          {hover === null ? (
            "hover the line"
          ) : (
            <>
              {label(hover)} · <span className={hover > split ? "text-accent" : "text-foreground"}>{all[hover].toLocaleString()}</span>
              {hover > split && " forecast"}
            </>
          )}
        </span>
      </div>
      <div ref={ref}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          className="block h-[120px] w-full touch-none overflow-visible"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label="Monthly oil production fell from about 2 million barrels in 2018 to under 600 thousand in 2023. The ARIMA forecast continues the decline through 2024."
        >
          <defs>
            <clipPath id="forecast-reveal">
              <motion.rect
                x={0}
                y={-10}
                height={H + 20}
                initial={{ width: reduce ? W : 0 }}
                animate={{ width: inView || reduce ? W : 0 }}
                transition={{ duration: reduce ? 0 : 2.2, ease: EASE }}
              />
            </clipPath>
          </defs>
          <line x1={x(split)} x2={x(split)} y1={0} y2={H} stroke="var(--border)" strokeDasharray="2 4" />
          <g clipPath="url(#forecast-reveal)">
            <path d={line(0, OIL_MONTHLY.length)} fill="none" stroke="var(--foreground)" strokeOpacity={0.75} strokeWidth={1.5} strokeLinejoin="round" />
            <path d={line(split, all.length)} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="5 4" />
          </g>
          {hover !== null && (
            <>
              <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} stroke="var(--muted-foreground)" strokeOpacity={0.4} />
              <circle cx={x(hover)} cy={y(all[hover])} r={3.5} fill={hover > split ? "var(--accent)" : "var(--foreground)"} />
            </>
          )}
        </svg>
      </div>
      <div className="mt-1.5 flex justify-between text-[0.75rem] text-muted-foreground">
        <span>2018</span>
        <span className="font-hand text-[1.0625rem] leading-none text-accent">2024 forecast →</span>
      </div>
    </div>
  );
}

/* ───────── Datathon: the 20 wells, regrouped by what the models predicted ───────── */

type Well = { n: number; res: string; lift: "gas lift" | "natural flow"; flow: "steady" | "unsteady" };
const W_ = (n: number, res: string, lift: string, flow: string): Well => ({
  n,
  res,
  lift: lift === "GL" ? "gas lift" : "natural flow",
  flow: flow === "S" ? "steady" : "unsteady",
});
// From DBTEL_DSEATS_Africa_2025_Classification.csv
const WELLS: Well[] = [
  W_(1, "JANI", "NF", "U"), W_(2, "KEMA", "GL", "U"), W_(3, "MAKO", "GL", "U"), W_(4, "DEPU", "GL", "S"),
  W_(5, "MAKO", "GL", "U"), W_(6, "KEMA", "NF", "S"), W_(7, "KEMA", "GL", "U"), W_(8, "ACHI", "NF", "S"),
  W_(9, "DEPU", "GL", "U"), W_(10, "JANI", "NF", "S"), W_(11, "DEPU", "GL", "S"), W_(12, "ACHI", "GL", "S"),
  W_(13, "DEPU", "NF", "S"), W_(14, "MAKO", "GL", "S"), W_(15, "KEMA", "GL", "S"), W_(16, "KEMA", "GL", "S"),
  W_(17, "DEPU", "NF", "S"), W_(18, "ACHI", "GL", "S"), W_(19, "KEMA", "GL", "S"), W_(20, "MAKO", "NF", "S"),
];
const TOTALS: Record<string, string> = { KEMA: "2.10M bbl", DEPU: "1.27M bbl", ACHI: "1.08M bbl", MAKO: "0.96M bbl", JANI: "0.22M bbl" };

const MODES = [
  { id: "res", label: "reservoir", groups: ["KEMA", "DEPU", "ACHI", "MAKO", "JANI"], perRow: 2 },
  { id: "lift", label: "lift", groups: ["gas lift", "natural flow"], perRow: 5 },
  { id: "flow", label: "stability", groups: ["steady", "unsteady"], perRow: 5 },
] as const;

function Wells() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [mode, setMode] = useState<(typeof MODES)[number]["id"] | "none">("none");
  const [width, setWidth] = useState(600);

  useEffect(() => {
    if (inView && mode === "none") {
      const t = setTimeout(() => setMode("res"), 350);
      return () => clearTimeout(t);
    }
  }, [inView, mode]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const D = width < 420 ? 20 : 24;
  const GAP = 4;
  const active = MODES.find((m) => m.id === mode);

  const pos = useMemo(() => {
    if (!active) {
      // unsorted: one or two plain rows, in well order
      const perRow = Math.max(1, Math.floor((width + GAP) / (D + GAP)));
      return WELLS.map((_, i) => ({ x: (i % perRow) * (D + GAP), y: Math.floor(i / perRow) * (D + GAP) }));
    }
    const G = active.groups.length;
    const colW = width / G;
    const key = active.id;
    const seen: Record<string, number> = {};
    return WELLS.map((w) => {
      const g = w[key];
      const gi = (active.groups as readonly string[]).indexOf(g);
      const k = (seen[g] = (seen[g] ?? -1) + 1);
      const per = active.perRow;
      const blockW = per * D + (per - 1) * GAP;
      return { x: gi * colW + (colW - blockW) / 2 + (k % per) * (D + GAP), y: Math.floor(k / per) * (D + GAP) };
    });
  }, [active, width, D]);

  return (
    <div className="select-none">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className={note}>20 wells, sorted by the model</span>
        <div role="radiogroup" aria-label="Group wells by" className="flex rounded-full border border-border p-0.5 text-[0.8125rem]">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded-full px-3 py-1 transition-colors",
                mode === m.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} className="relative" style={{ height: 3 * (D + GAP) }}>
        {WELLS.map((w, i) => (
          <motion.span
            key={w.n}
            title={`Well ${w.n}: ${w.res}, ${w.lift}, ${w.flow}`}
            className={cn(
              "absolute top-0 left-0 grid place-items-center rounded-full border text-[0.625rem] font-semibold tabular-nums",
              w.lift === "gas lift" ? "border-accent bg-accent text-accent-ink" : "border-accent bg-transparent text-accent",
            )}
            style={{ width: D, height: D }}
            initial={false}
            animate={{ x: pos[i].x, y: pos[i].y }}
            transition={{ type: "spring", stiffness: 260, damping: 26, delay: i * 0.012 }}
          >
            {w.n}
          </motion.span>
        ))}
      </div>
      <div className="mt-2 flex text-center text-[0.75rem] leading-tight text-muted-foreground">
        {active
          ? active.groups.map((g) => (
              <span key={g} className="flex-1">
                <span className="block font-semibold text-foreground">{g}</span>
                {active.id === "res" && <span className="hidden sm:block">{TOTALS[g]}</span>}
              </span>
            ))
          : <span className="flex-1">&nbsp;</span>}
      </div>
    </div>
  );
}

/* ───────── fastai ch. 4: draw a digit, compare it to the average 3 and 7 ───────── */

const SIZE = 28;
const SCALE = 6;

function Digits() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState<{ d3: number; d7: number } | null>(null);

  const ctx = () => canvas.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  const clear = () => {
    const c = ctx();
    if (c) c.clearRect(0, 0, SIZE * SCALE, SIZE * SCALE);
    setResult(null);
  };

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE * SCALE, y: ((e.clientY - r.top) / r.height) * SIZE * SCALE };
  };

  const stroke = (e: PointerEvent<HTMLCanvasElement>) => {
    const c = ctx();
    if (!c || !drawing.current) return;
    const p = point(e);
    c.strokeStyle = getComputedStyle(e.currentTarget).getPropertyValue("--foreground").trim() || "#000";
    c.lineWidth = SCALE * 2.4;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(last.current?.x ?? p.x, last.current?.y ?? p.y);
    c.lineTo(p.x, p.y);
    c.stroke();
    last.current = p;
  };

  const classify = () => {
    const c = ctx();
    if (!c) return;
    const px = toMnist(c.getImageData(0, 0, SIZE * SCALE, SIZE * SCALE));
    if (!px) return setResult(null);
    // L1 distance, exactly as in the notebook: (a - mean).abs().mean()
    const dist = (mean: number[]) => px.reduce((s, v, i) => s + Math.abs(v - mean[i] / 100), 0) / px.length;
    setResult({ d3: dist(MEAN_THREE), d7: dist(MEAN_SEVEN) });
  };

  const guess = result ? (result.d3 < result.d7 ? "3" : "7") : null;

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
      <div className="relative">
        <canvas
          ref={canvas}
          width={SIZE * SCALE}
          height={SIZE * SCALE}
          aria-label="Drawing pad: draw a 3 or a 7"
          className="digit-pad block size-[168px] touch-none rounded-xl border border-border bg-card"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drawing.current = true;
            last.current = null;
            stroke(e);
          }}
          onPointerMove={stroke}
          onPointerUp={() => {
            drawing.current = false;
            classify();
          }}
          onPointerCancel={() => (drawing.current = false)}
        />
        {!result && <span className={cn(note, "pointer-events-none absolute inset-0 grid place-items-center")}>draw a 3 or a 7</span>}
      </div>

      <div className="min-w-[12rem] flex-1">
        <p className="text-[0.9375rem] text-muted-foreground">
          {guess ? (
            <>
              looks like a <span className="font-display text-[2.5rem] leading-none font-semibold text-accent align-middle">{guess}</span>
            </>
          ) : (
            "no training, just pixels: whichever average digit your drawing is closer to wins."
          )}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-[16rem]">
          {(
            [
              ["average 3", MEAN_THREE, result?.d3],
              ["average 7", MEAN_SEVEN, result?.d7],
            ] as const
          ).map(([name, mean, d]) => (
            <figure key={name} className="flex items-center gap-3">
              <MeanDigit values={mean} active={!!guess && name.endsWith(guess)} />
              <figcaption className="text-[0.75rem] leading-tight text-muted-foreground">
                {name}
                <span className="block tabular-nums text-foreground">{d === undefined ? "–" : `dist ${d.toFixed(3)}`}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        {result && (
          <button type="button" onClick={clear} className="link mt-4 text-[0.875rem]">
            clear and try again
          </button>
        )}
      </div>
    </div>
  );
}

/** The average digit from the notebook, drawn in the accent colour. */
function MeanDigit({ values, active }: { values: readonly number[]; active: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className={cn("size-12 shrink-0 rounded-md border transition-colors", active ? "border-accent" : "border-border")} aria-hidden>
      {values.map((v, i) =>
        v > 6 ? <rect key={i} x={i % 28} y={Math.floor(i / 28)} width={1.02} height={1.02} fill="var(--accent)" fillOpacity={v / 100} /> : null,
      )}
    </svg>
  );
}

/** Crop the ink, fit it in a 20px box and centre it on a 28x28 grid, the way MNIST digits are prepared. */
function toMnist(img: ImageData): number[] | null {
  const { width: w, height: h, data } = img;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  if (maxX < 0) return null;
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const s = 20 / Math.max(bw, bh);
  const tmp = document.createElement("canvas");
  tmp.width = tmp.height = SIZE;
  const t = tmp.getContext("2d", { willReadFrequently: true })!;
  const src = document.createElement("canvas");
  src.width = w;
  src.height = h;
  src.getContext("2d")!.putImageData(img, 0, 0);
  t.imageSmoothingQuality = "high";
  t.drawImage(src, minX, minY, bw, bh, (SIZE - bw * s) / 2, (SIZE - bh * s) / 2, bw * s, bh * s);
  const out = t.getImageData(0, 0, SIZE, SIZE).data;
  const px = Array.from({ length: SIZE * SIZE }, (_, i) => out[i * 4 + 3] / 255);
  // shift so the centre of mass sits in the middle
  let mx = 0, my = 0, m = 0;
  px.forEach((v, i) => ((mx += (i % SIZE) * v), (my += Math.floor(i / SIZE) * v), (m += v)));
  const dx = Math.round(13.5 - mx / m);
  const dy = Math.round(13.5 - my / m);
  const shifted = new Array(SIZE * SIZE).fill(0);
  px.forEach((v, i) => {
    const x = (i % SIZE) + dx;
    const y = Math.floor(i / SIZE) + dy;
    if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) shifted[y * SIZE + x] = v;
  });
  return shifted;
}
