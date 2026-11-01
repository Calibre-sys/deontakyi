import { motion } from "motion/react";
import { useId, useState } from "react";

/*
 * The one live thing on the page: the flow-zone-indicator arithmetic behind the HFU paper.
 * Set a core sample's porosity and permeability and see where it plots.
 *   RQI = 0.0314 * sqrt(k / phi)      (µm, k in mD, phi as a fraction)
 *   phiZ = phi / (1 - phi)
 *   FZI = RQI / phiZ
 * The band edges below are illustrative; in the paper the units come out of the data by clustering.
 */

const BANDS = [
  { max: 0.5, name: "tight, very low flow capacity" },
  { max: 1.5, name: "poor to fair flow capacity" },
  { max: 3.5, name: "good flow capacity" },
  { max: 7, name: "very good flow capacity" },
  { max: Infinity, name: "excellent flow capacity" },
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

const TONES = [12, 26, 42, 60, 80].map((pct) => `color-mix(in oklab, var(--accent) ${pct}%, var(--card-2))`);

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
    <div className="grid gap-8 md:grid-cols-[1fr_minmax(0,17rem)] md:items-center">
      <div className="grid gap-5">
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
        <div aria-live="polite" className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="font-display text-[2.5rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">
            {fzi.toFixed(2)} <span className="text-[1.25rem] text-muted-foreground">µm FZI</span>
          </p>
          <p className="text-[0.9375rem]">
            Flow unit {unit + 1}/5 · <span className="text-muted-foreground">{BANDS[unit].name}</span>
          </p>
        </div>
        <p className="text-[0.8125rem] text-muted-foreground">
          RQI {rqi.toFixed(3)} µm · φz {phiZ.toFixed(3)} · Illustrative band edges; the paper derives them by clustering.
        </p>
      </div>

      <figure className="overflow-hidden rounded-lg">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Log-log plot of RQI against normalised porosity. The sample sits in flow unit ${unit + 1}.`}>
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
              r={7}
              fill="var(--foreground)"
              stroke="var(--card)"
              strokeWidth={3}
              animate={{ cx: px(phiZ), cy: py(rqi) }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            />
          </g>
        </svg>
        <figcaption className="mt-2 text-[0.8125rem] text-muted-foreground">log RQI vs log φz, one band per flow unit</figcaption>
      </figure>
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
