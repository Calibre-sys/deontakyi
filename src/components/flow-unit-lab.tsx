import { motion } from "motion/react";
import { useId, useState } from "react";
import { Reveal } from "./kit";

/*
 * The one live thing on the page: the flow-zone-indicator arithmetic behind the HFU paper.
 * Set a core sample's porosity and permeability and see where it plots.
 *   RQI = 0.0314 * sqrt(k / phi)      (µm, k in mD, phi as a fraction)
 *   phiZ = phi / (1 - phi)
 *   FZI = RQI / phiZ
 * The band edges below are illustrative; in the paper the units come out of the data by clustering.
 */

const BANDS = [
  { max: 0.5, name: "tight rock, barely flows" },
  { max: 1.5, name: "poor to fair rock" },
  { max: 3.5, name: "good reservoir rock" },
  { max: 7, name: "very good reservoir rock" },
  { max: Infinity, name: "excellent, fast-flowing rock" },
];
const EDGES = [0.5, 1.5, 3.5, 7];

// Plot ranges, log scale.
const X0 = Math.log10(0.05);
const X1 = Math.log10(0.6);
const Y0 = Math.log10(0.02);
const Y1 = Math.log10(6);
const W = 320;
const H = 260;
const px = (phiZ: number) => ((Math.log10(phiZ) - X0) / (X1 - X0)) * W;
const py = (rqi: number) => H - ((Math.log10(rqi) - Y0) / (Y1 - Y0)) * H;

function bandPolygon(lo: number, hi: number) {
  const a = 0.05;
  const b = 0.6;
  const pts = [
    [a, lo * a],
    [b, lo * b],
    [b, Math.min(hi, 1e4) * b],
    [a, Math.min(hi, 1e4) * a],
  ];
  return pts.map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(" ");
}

const TONES = ["var(--surface)", "color-mix(in oklab, var(--accent) 12%, var(--surface))", "color-mix(in oklab, var(--accent) 26%, var(--surface))", "color-mix(in oklab, var(--accent) 42%, var(--surface))", "color-mix(in oklab, var(--accent) 60%, var(--surface))"];

export function FlowUnitLab() {
  const [porosity, setPorosity] = useState(18); // percent
  const [logK, setLogK] = useState(2); // log10 mD, so 100 mD
  const phiId = useId();
  const kId = useId();

  const phi = porosity / 100;
  const k = 10 ** logK;
  const rqi = 0.0314 * Math.sqrt(k / phi);
  const phiZ = phi / (1 - phi);
  const fzi = rqi / phiZ;
  const unit = BANDS.findIndex((b) => fzi < b.max);
  const bandEdges = [0, ...EDGES, Infinity];

  return (
    <div className="mt-24">
      <Reveal>
        <h3 className="text-lead leading-tight">Try the method on a rock sample</h3>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="measure mt-4">
          The paper groups rock by its flow zone indicator, worked out from porosity and permeability. Move the two values and
          see which kind of rock you have.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 grid gap-10 md:grid-cols-[1fr_minmax(0,20rem)] md:items-start">
        <div className="grid gap-8">
          <Slider id={phiId} label="Porosity" value={`${porosity}%`} min={4} max={36} step={1} current={porosity} onChange={setPorosity} />
          <Slider
            id={kId}
            label="Permeability"
            value={`${k < 10 ? k.toFixed(1) : Math.round(k).toLocaleString()} mD`}
            min={-1}
            max={3.7}
            step={0.05}
            current={logK}
            onChange={setLogK}
          />
          <div aria-live="polite">
            <p className="font-display text-head leading-none font-extrabold tracking-[-0.03em] tabular-nums">{fzi.toFixed(2)} µm</p>
            <p className="mt-3 text-lead leading-snug">
              That is the flow zone indicator. Flow unit {unit + 1} of 5: {BANDS[unit].name}.
            </p>
            <p className="mt-2 text-small text-muted">
              RQI {rqi.toFixed(3)} µm, normalised porosity {phiZ.toFixed(3)}. Band edges are illustrative; the paper finds them
              from the data.
            </p>
          </div>
        </div>

        <figure data-ui className="bg-paper p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-hidden" role="img" aria-label={`Log-log plot of RQI against normalised porosity. The sample sits in flow unit ${unit + 1}.`}>
            <defs>
              <clipPath id="plot">
                <rect width={W} height={H} />
              </clipPath>
            </defs>
            <g clipPath="url(#plot)">
              {bandEdges.slice(0, -1).map((lo, i) => (
                <polygon key={i} points={bandPolygon(lo || 1e-4, bandEdges[i + 1])} fill={TONES[i]} />
              ))}
              <motion.circle
                r={8}
                fill="var(--ink)"
                stroke="var(--paper)"
                strokeWidth={3}
                animate={{ cx: px(phiZ), cy: py(rqi) }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              />
            </g>
          </svg>
          <figcaption className="mt-3 text-small text-muted">
            Each band is one flow unit. Up and to the left means rock that lets oil through more easily.
          </figcaption>
        </figure>
      </Reveal>
    </div>
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
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-semibold">
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
        className="range mt-3 w-full"
        style={{ ["--fill" as string]: `${fill}%` }}
      />
    </div>
  );
}
