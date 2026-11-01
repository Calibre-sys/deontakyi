import { motion, useReducedMotion } from "motion/react";
import { type PointerEvent, useId, useRef, useState } from "react";

/*
 * Interactive flow zone indicator plot, after the method in the 2025 HFU paper.
 *
 *   RQI  = 0.0314 · √(k / φ)        reservoir quality index, µm   (k in mD, φ as a fraction)
 *   φz   = φ / (1 − φ)              normalised porosity
 *   FZI  = RQI / φz                 flow zone indicator, µm
 *
 * On log RQI against log φz every sample with the same FZI falls on a line of slope 1, so a
 * hydraulic flow unit is the band between two such lines. The band edges here are illustrative;
 * in the paper they are found from the data by clustering.
 */

const UNITS = [
  { lo: 0, hi: 0.5, name: "Tight" },
  { lo: 0.5, hi: 1.5, name: "Poor to fair" },
  { lo: 1.5, hi: 3.5, name: "Good" },
  { lo: 3.5, hi: 7, name: "Very good" },
  { lo: 7, hi: Infinity, name: "Excellent" },
];
const EDGES = [0.5, 1.5, 3.5, 7];

// Domain (log scales) and slider limits.
const X_MIN = 0.03;
const X_MAX = 1;
const Y_MIN = 0.01;
const Y_MAX = 10;
const PHI_MIN = 0.04;
const PHI_MAX = 0.36;
const LOGK_MIN = -1; // 0.1 mD
const LOGK_MAX = 3.6; // ≈ 4,000 mD

// Geometry of the SVG.
const VW = 560;
const VH = 400;
const M = { l: 66, r: 66, t: 18, b: 58 };
const PW = VW - M.l - M.r;
const PH = VH - M.t - M.b;

const lx = (v: number) => Math.log10(v);
const px = (phiZ: number) => M.l + ((lx(phiZ) - lx(X_MIN)) / (lx(X_MAX) - lx(X_MIN))) * PW;
const py = (rqi: number) => M.t + PH - ((lx(rqi) - lx(Y_MIN)) / (lx(Y_MAX) - lx(Y_MIN))) * PH;
const invX = (x: number) => 10 ** (lx(X_MIN) + ((x - M.l) / PW) * (lx(X_MAX) - lx(X_MIN)));
const invY = (y: number) => 10 ** (lx(Y_MIN) + ((M.t + PH - y) / PH) * (lx(Y_MAX) - lx(Y_MIN)));

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Sequential single-hue ramp: low FZI lightest, high FZI strongest.
const TONE = [10, 20, 32, 46, 62].map((pct) => `color-mix(in oklab, var(--accent) ${pct}%, var(--card))`);

/** Polygon for the band between two iso-FZI lines, clipped by the plot rectangle via clipPath. */
function band(lo: number, hi: number) {
  const a = X_MIN;
  const b = X_MAX;
  const loV = Math.max(lo, 1e-4);
  const hiV = Math.min(hi, 1e4);
  return [
    [a, loV * a],
    [b, loV * b],
    [b, hiV * b],
    [a, hiV * a],
  ]
    .map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`)
    .join(" ");
}

// Decade and minor ticks.
function logTicks(min: number, max: number) {
  const major: number[] = [];
  const minor: number[] = [];
  for (let e = Math.floor(lx(min)); e <= Math.ceil(lx(max)); e++) {
    for (let m = 1; m < 10; m++) {
      const v = m * 10 ** e;
      if (v < min * 0.999 || v > max * 1.001) continue;
      (m === 1 ? major : minor).push(v);
    }
  }
  return { major, minor };
}
const XT = logTicks(X_MIN, X_MAX);
const YT = logTicks(Y_MIN, Y_MAX);
const X_LABELS = [0.03, 0.05, 0.1, 0.2, 0.5, 1];
const fmt = (v: number) => (v >= 1 ? v.toFixed(0) : v >= 0.1 ? v.toFixed(1) : v.toFixed(2));

export function FlowUnitLab() {
  const [phi, setPhi] = useState(0.18);
  const [logK, setLogK] = useState(2);
  const [dragging, setDragging] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const phiId = useId();
  const kId = useId();
  const clipId = `fzi-clip-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const k = 10 ** logK;
  const rqi = 0.0314 * Math.sqrt(k / phi);
  const phiZ = phi / (1 - phi);
  const fzi = rqi / phiZ;
  const unit = UNITS.findIndex((u) => fzi >= u.lo && fzi < u.hi);
  const cx = px(clamp(phiZ, X_MIN, X_MAX));
  const cy = py(clamp(rqi, Y_MIN, Y_MAX));

  // Dragging on the plot sets φz and RQI, solved back to φ and k.
  const fromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current!.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * VW;
    const y = ((event.clientY - box.top) / box.height) * VH;
    const z = invX(clamp(x, M.l, M.l + PW));
    const r = invY(clamp(y, M.t, M.t + PH));
    const nextPhi = clamp(z / (1 + z), PHI_MIN, PHI_MAX);
    const nextK = nextPhi * (r / 0.0314) ** 2;
    setPhi(Math.round(nextPhi * 1000) / 1000);
    setLogK(clamp(Math.log10(nextK), LOGK_MIN, LOGK_MAX));
  };

  const spring = reduce || dragging ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-10">
      {/* Controls and readout */}
      <div className="grid content-start gap-5">
        <Slider
          id={phiId}
          label="Porosity, φ"
          value={`${(phi * 100).toFixed(1)} %`}
          min={PHI_MIN}
          max={PHI_MAX}
          step={0.001}
          current={phi}
          onChange={setPhi}
        />
        <Slider
          id={kId}
          label="Permeability, k"
          value={`${k < 10 ? k.toFixed(2) : Math.round(k).toLocaleString()} mD`}
          min={LOGK_MIN}
          max={LOGK_MAX}
          step={0.01}
          current={logK}
          onChange={setLogK}
        />

        <table className="w-full text-[0.875rem] tabular-nums" aria-live="polite">
          <caption className="sr-only">Computed values for the sample</caption>
          <tbody>
            <Row k="φz" v={phiZ.toFixed(3)} unit="" />
            <Row k="RQI" v={rqi.toFixed(3)} unit="µm" />
            <Row k="FZI" v={fzi.toFixed(2)} unit="µm" strong />
            <Row k="Flow unit" v={`HFU ${unit + 1}`} unit={UNITS[unit].name.toLowerCase()} strong />
          </tbody>
        </table>

        <ul className="grid gap-1.5 text-[0.8125rem]" aria-label="Flow units by FZI range">
          {UNITS.map((u, i) => (
            <li key={u.name} className={`flex items-center gap-2.5 ${i === unit ? "text-foreground" : "text-muted-foreground"}`}>
              <span aria-hidden className="size-3 shrink-0 rounded-[3px]" style={{ background: TONE[i] }} />
              <span className="w-12 font-medium">HFU {i + 1}</span>
              <span className="tabular-nums">{u.hi === Infinity ? `FZI ≥ ${u.lo}` : `${u.lo} – ${u.hi} µm`}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* The plot */}
      <figure className="order-first min-w-0 lg:order-none">
        <svg
          ref={svg}
          viewBox={`0 0 ${VW} ${VH}`}
          className={`block w-full touch-none select-none ${dragging ? "cursor-grabbing" : "cursor-crosshair"}`}
          role="img"
          aria-label={`Log-log plot of reservoir quality index against normalised porosity. The sample at φz ${phiZ.toFixed(3)}, RQI ${rqi.toFixed(3)} µm has FZI ${fzi.toFixed(2)} µm and falls in flow unit ${unit + 1}.`}
          onPointerDown={(e) => {
            svg.current?.setPointerCapture(e.pointerId);
            setDragging(true);
            fromPointer(e);
          }}
          onPointerMove={(e) => dragging && fromPointer(e)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          fontFamily="var(--font-sans)"
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={M.l} y={M.t} width={PW} height={PH} />
            </clipPath>
          </defs>

          {/* Plot surface */}
          <rect x={M.l} y={M.t} width={PW} height={PH} fill="var(--card)" />

          <g clipPath={`url(#${clipId})`}>
            {/* Flow-unit bands */}
            {UNITS.map((u, i) => (
              <polygon key={u.name} points={band(u.lo, u.hi)} fill={TONE[i]} />
            ))}

            {/* Grid: minor then major */}
            {XT.minor.map((v) => (
              <line key={`xm${v}`} x1={px(v)} x2={px(v)} y1={M.t} y2={M.t + PH} stroke="var(--foreground)" strokeOpacity={0.06} />
            ))}
            {YT.minor.map((v) => (
              <line key={`ym${v}`} y1={py(v)} y2={py(v)} x1={M.l} x2={M.l + PW} stroke="var(--foreground)" strokeOpacity={0.06} />
            ))}
            {XT.major.map((v) => (
              <line key={`xM${v}`} x1={px(v)} x2={px(v)} y1={M.t} y2={M.t + PH} stroke="var(--foreground)" strokeOpacity={0.16} />
            ))}
            {YT.major.map((v) => (
              <line key={`yM${v}`} y1={py(v)} y2={py(v)} x1={M.l} x2={M.l + PW} stroke="var(--foreground)" strokeOpacity={0.16} />
            ))}

            {/* Iso-FZI lines: unit boundaries */}
            {EDGES.map((f) => (
              <line
                key={f}
                x1={px(X_MIN)}
                y1={py(f * X_MIN)}
                x2={px(X_MAX)}
                y2={py(f * X_MAX)}
                stroke="var(--foreground)"
                strokeOpacity={0.55}
                strokeWidth={1.25}
              />
            ))}

            {/* The sample's own iso-FZI line */}
            <motion.line
              initial={false}
              animate={{ x1: px(X_MIN), y1: py(fzi * X_MIN), x2: px(X_MAX), y2: py(fzi * X_MAX) }}
              transition={spring}
              stroke="var(--accent)"
              strokeWidth={2}
              strokeDasharray="6 4"
            />

            {/* Projections to the axes */}
            <motion.line initial={false} animate={{ x1: cx, x2: cx, y1: cy, y2: M.t + PH }} transition={spring} stroke="var(--foreground)" strokeOpacity={0.45} strokeDasharray="3 3" />
            <motion.line initial={false} animate={{ x1: M.l, x2: cx, y1: cy, y2: cy }} transition={spring} stroke="var(--foreground)" strokeOpacity={0.45} strokeDasharray="3 3" />
          </g>

          {/* Plot frame */}
          <rect x={M.l} y={M.t} width={PW} height={PH} fill="none" stroke="var(--border-strong)" />

          {/* X axis ticks and labels */}
          {XT.minor.map((v) => (
            <line key={`xt${v}`} x1={px(v)} x2={px(v)} y1={M.t + PH} y2={M.t + PH + 4} stroke="var(--muted-foreground)" />
          ))}
          {XT.major.map((v) => (
            <line key={`xT${v}`} x1={px(v)} x2={px(v)} y1={M.t + PH} y2={M.t + PH + 7} stroke="var(--muted-foreground)" />
          ))}
          {X_LABELS.map((v) => (
            <text key={`xl${v}`} x={px(v)} y={M.t + PH + 22} textAnchor="middle" fontSize={12.5} fill="var(--muted-foreground)">
              {fmt(v)}
            </text>
          ))}
          <text x={M.l + PW / 2} y={VH - 8} textAnchor="middle" fontSize={13.5} fill="var(--foreground)">
            Normalised porosity, φz = φ / (1 − φ)
          </text>

          {/* Y axis ticks and labels */}
          {YT.minor.map((v) => (
            <line key={`yt${v}`} x1={M.l - 4} x2={M.l} y1={py(v)} y2={py(v)} stroke="var(--muted-foreground)" />
          ))}
          {YT.major.map((v) => (
            <g key={`yT${v}`}>
              <line x1={M.l - 7} x2={M.l} y1={py(v)} y2={py(v)} stroke="var(--muted-foreground)" />
              <text x={M.l - 11} y={py(v) + 4.5} textAnchor="end" fontSize={12.5} fill="var(--muted-foreground)">
                {fmt(v)}
              </text>
            </g>
          ))}
          <text transform={`translate(16 ${M.t + PH / 2}) rotate(-90)`} textAnchor="middle" fontSize={13.5} fill="var(--foreground)">
            Reservoir quality index, RQI (µm)
          </text>

          {/* Iso-FZI labels on the right edge */}
          <text x={M.l + PW + 8} y={M.t + 5} fontSize={12} fill="var(--muted-foreground)">
            FZI, µm
          </text>
          {EDGES.map((f) => (
            <text key={`fl${f}`} x={M.l + PW + 8} y={py(f * X_MAX) + 4.5} fontSize={12.5} fill="var(--foreground)">
              {f.toFixed(1)}
            </text>
          ))}

          {/* Axis value markers for the sample */}
          <motion.g initial={false} animate={{ x: cx }} transition={spring}>
            <rect x={-25} y={M.t + PH - 24} width={50} height={19} rx={4} fill="var(--foreground)" />
            <text y={M.t + PH - 10} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--background)">
              {phiZ.toFixed(3)}
            </text>
          </motion.g>
          <motion.g initial={false} animate={{ y: cy }} transition={spring}>
            <rect x={M.l + 5} y={-9.5} width={50} height={19} rx={4} fill="var(--foreground)" />
            <text x={M.l + 30} y={4} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--background)">
              {rqi.toFixed(3)}
            </text>
          </motion.g>

          {/* The sample */}
          <motion.circle
            initial={false}
            animate={{ cx, cy }}
            transition={spring}
            r={dragging ? 8 : 6.5}
            fill="var(--accent)"
            stroke="var(--card)"
            strokeWidth={2.5}
          />
        </svg>
        <figcaption className="mt-2 text-[0.8125rem] text-muted-foreground">
          Drag on the plot or use the sliders. Lines of constant FZI have unit slope on log axes; each band is one
          hydraulic flow unit. Band edges are illustrative.
        </figcaption>
      </figure>
    </div>
  );
}

function Row({ k, v, unit, strong }: { k: string; v: string; unit: string; strong?: boolean }) {
  return (
    <tr className="border-t border-border first:border-t-0">
      <th scope="row" className="py-1.5 pr-3 text-left font-normal text-muted-foreground">
        {k}
      </th>
      <td className={`py-1.5 text-right ${strong ? "font-semibold" : ""}`}>
        {v} <span className="font-normal text-muted-foreground">{unit}</span>
      </td>
    </tr>
  );
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  const fill = ((current - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-[0.9375rem]">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <output htmlFor={id} className="tabular-nums">
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        aria-valuetext={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-1 w-full"
        style={{ ["--fill" as string]: `${fill}%` }}
      />
    </div>
  );
}
