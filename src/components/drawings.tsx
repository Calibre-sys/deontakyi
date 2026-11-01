import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/*
 * Drawings for the parts of the story no photograph exists of. Flat shapes in the page's own
 * colours, so they read as one set with the rest of the page.
 */

/** A core sample: the rock a petroleum engineer learns to read, cut into bands. */
export function CorePlug({ className }: { className?: string }) {
  const bands = [
    { h: 34, fill: "#c9a66b" },
    { h: 18, fill: "#8b6f4e" },
    { h: 46, fill: "#d9c39a" },
    { h: 12, fill: "#5d4a37" },
    { h: 40, fill: "#b8915c" },
    { h: 22, fill: "#e3d3b3" },
    { h: 30, fill: "#7a6046" },
    { h: 38, fill: "#c9a66b" },
  ];
  let y = 24;
  return (
    <svg viewBox="0 0 160 320" className={className} role="img" aria-label="Drawing of a cylindrical rock core with sandstone and shale bands">
      <defs>
        <clipPath id="core">
          <path d="M20 24 a60 16 0 0 1 120 0 V288 a60 16 0 0 1 -120 0 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#core)">
        {bands.map((b, i) => {
          const rect = <rect key={i} x="0" y={y} width="160" height={b.h} fill={b.fill} />;
          y += b.h;
          return rect;
        })}
        {/* Grain: a scatter of dots in the sandstone. */}
        {Array.from({ length: 70 }, (_, i) => (
          <circle key={i} cx={24 + ((i * 37) % 112)} cy={30 + ((i * 53) % 250)} r={1.2} fill="#3d3024" opacity={0.35} />
        ))}
        <rect x="104" y="0" width="36" height="320" fill="#000" opacity="0.18" />
      </g>
      <ellipse cx="80" cy="24" rx="60" ry="16" fill="#e8dcc2" />
      <ellipse cx="80" cy="24" rx="44" ry="10" fill="#d4c29f" />
    </svg>
  );
}

/** Tema: storage tanks, a pipeline with product moving through it, and the flow meter reading it. */
export function TankFarm() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [reading, setReading] = useState(reduce ? 412.6 : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, 412.6, { duration: 2.4, ease: [0.16, 1, 0.3, 1], onUpdate: setReading });
    return () => controls.stop();
  }, [inView, reduce]);

  const tanks = [
    { x: 60, w: 190, h: 150 },
    { x: 290, w: 150, h: 120 },
    { x: 480, w: 210, h: 170 },
  ];
  const groundY = 330;

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 420"
      className="block h-auto w-full"
      role="img"
      aria-label="Drawing of three storage tanks joined by a pipeline that runs to a flow meter and on to the terminal"
    >
      <rect width="1200" height="420" fill="var(--panel)" />
      <rect y={groundY} width="1200" height={420 - groundY} fill="var(--panel-2)" />
      {tanks.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={groundY - t.h} width={t.w} height={t.h} fill="var(--ink)" opacity={0.88} />
          <ellipse cx={t.x + t.w / 2} cy={groundY - t.h} rx={t.w / 2} ry={14} fill="var(--ink)" />
          {/* Ladder and level gauge. */}
          <rect x={t.x + t.w - 26} y={groundY - t.h + 10} width={6} height={t.h - 10} fill="var(--ground)" opacity={0.35} />
          <rect x={t.x + 18} y={groundY - t.h * 0.62} width={t.w * 0.3} height={8} fill="var(--accent)" />
        </g>
      ))}
      {/* The pipeline: a thick pipe with product moving through it. */}
      <path d="M150 360 H1120" stroke="var(--ink)" strokeWidth={22} fill="none" />
      <path d="M150 360 H1120" stroke="var(--accent)" strokeWidth={8} strokeDasharray="28 36" fill="none" className="flow" />
      {tanks.map((t, i) => (
        <rect key={i} x={t.x + t.w / 2 - 8} y={groundY} width={16} height={30} fill="var(--ink)" />
      ))}
      {/* The flow meter. */}
      <rect x={800} y={250} width={240} height={86} fill="var(--ground)" />
      <rect x={800} y={250} width={240} height={86} fill="none" stroke="var(--ink)" strokeWidth={6} />
      <text x={820} y={282} fill="var(--muted)" fontSize={18} fontFamily="var(--font-text)">
        Flow meter, m³/h
      </text>
      <text x={820} y={322} fill="var(--ink)" fontSize={38} fontWeight={800} fontFamily="var(--font-display)">
        {reading.toFixed(1)}
      </text>
      <rect x={905} y={336} width={30} height={24} fill="var(--ink)" />
      <text x={1060} y={318} fill="var(--ink)" fontSize={20} fontFamily="var(--font-text)">
        to terminal
      </text>
    </svg>
  );
}
