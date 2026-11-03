import { useReducedMotion } from "motion/react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import * as Icons from "simple-icons";
import { cn } from "@/lib/utils";

/*
 * Tools hang off the thing they were used for, as small pendulums.
 *
 * Each charm is a damped simple pendulum, integrated every frame:
 *     θ'' = −(g / L) · sin θ − c · θ' + τ_wind + τ_pointer
 * so a long string swings slowly and a short one quickly (T = 2π√(L/g)). Brushing the pointer
 * across a ball pushes it in the direction of travel; a ball can be grabbed, pulled aside and let go.
 * A light, smoothly varying breeze keeps them alive at rest. All pendulums share one animation
 * loop that writes transforms directly, so nothing re-renders while they swing.
 */

export const TOOLS = {
  python: { name: "Python", icon: Icons.siPython },
  pytorch: { name: "PyTorch", icon: Icons.siPytorch },
  tensorflow: { name: "TensorFlow", icon: Icons.siTensorflow },
  keras: { name: "Keras", icon: Icons.siKeras },
  sklearn: { name: "scikit-learn", icon: Icons.siScikitlearn },
  pandas: { name: "pandas", icon: Icons.siPandas },
  numpy: { name: "NumPy", icon: Icons.siNumpy },
  jupyter: { name: "Jupyter", icon: Icons.siJupyter },
  fastapi: { name: "FastAPI", icon: Icons.siFastapi },
  langchain: { name: "LangChain", icon: Icons.siLangchain },
  javascript: { name: "JavaScript", icon: Icons.siJavascript },
  react: { name: "React", icon: Icons.siReact },
  node: { name: "Node.js", icon: Icons.siNodedotjs },
  appsscript: { name: "Apps Script", icon: Icons.siGoogleappsscript },
  sheets: { name: "Google Sheets", icon: Icons.siGooglesheets },
  git: { name: "Git", icon: Icons.siGit },
  github: { name: "GitHub", icon: Icons.siGithub },
  autocad: { name: "AutoCAD", icon: Icons.siAutocad },
} as const;

export type ToolKey = keyof typeof TOOLS;

const SCALE = 1.5;
// String lengths (px, before scaling) vary so neighbours have different periods.
const LENGTHS = [22, 40, 14, 32, 26, 46];

/* ── Shared physics loop ── */

const G = 2200; // px/s², tuned so a 60px string has a period of about one second
const DAMPING = 0.8; // 1/s, air drag on the swing
const RESTITUTION = 0.75; // how much bounce two balls keep when they knock together
const MAX_THETA = 1.25; // rad, keeps a hard flick from looping over the top

type Pendulum = {
  el: HTMLElement;
  anchor: HTMLElement; // the list item, whose centre is the pivot
  group: Pendulum[]; // siblings on the same rod, left to right
  index: number;
  radius: number;
  length: number; // px, pivot to ball centre
  theta: number;
  omega: number;
  phase: number;
  dragging: boolean;
};

const pendulums = new Set<Pendulum>();
let raf = 0;
let last = 0;

function step(now: number) {
  const dt = Math.min(0.033, (now - (last || now)) / 1000);
  last = now;
  const t = now / 1000;
  for (const p of pendulums) {
    if (!p.dragging) {
      // Breeze: two incommensurate sines per charm, so it never looks periodic.
      const wind = 2.2 * Math.sin(t * 0.83 + p.phase) + 1.2 * Math.sin(t * 1.91 + p.phase * 2.3);
      const alpha = -(G / p.length) * Math.sin(p.theta) - DAMPING * p.omega + wind;
      // Semi-implicit Euler: stable for this stiffness at 30–120 fps.
      p.omega += alpha * dt;
      p.theta += p.omega * dt;
      if (Math.abs(p.theta) > MAX_THETA) {
        p.theta = Math.sign(p.theta) * MAX_THETA;
        p.omega *= -0.3;
      }
    }
  }
  // Neighbouring balls knock into each other: equal-mass collisions along the line of centres.
  for (const group of groups) collide(group);
  for (const p of pendulums) p.el.style.transform = `rotate(${p.theta}rad)`;
  raf = pendulums.size ? requestAnimationFrame(step) : 0;
}

const groups = new Set<Pendulum[]>();

function collide(group: Pendulum[]) {
  const sorted = [...group].sort((a, b) => a.index - b.index);
  const pivots = sorted.map((p) => p.anchor.offsetLeft + p.anchor.offsetWidth / 2);
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const ax = pivots[i] + a.length * Math.sin(a.theta);
    const ay = a.length * Math.cos(a.theta);
    const bx = pivots[i + 1] + b.length * Math.sin(b.theta);
    const by = b.length * Math.cos(b.theta);
    const dx = bx - ax;
    const dy = by - ay;
    const d = Math.hypot(dx, dy) || 0.001;
    const min = a.radius + b.radius;
    if (d >= min) continue;
    const nx = dx / d;
    const ny = dy / d;
    // Tangential directions of each bob and their linear velocities.
    const atx = Math.cos(a.theta), aty = -Math.sin(a.theta);
    const btx = Math.cos(b.theta), bty = -Math.sin(b.theta);
    const avx = a.omega * a.length * atx, avy = a.omega * a.length * aty;
    const bvx = b.omega * b.length * btx, bvy = b.omega * b.length * bty;
    const vrel = (bvx - avx) * nx + (bvy - avy) * ny;
    if (vrel < 0) {
      const j = (-(1 + RESTITUTION) * vrel) / 2;
      if (!a.dragging) a.omega = ((avx - j * nx) * atx + (avy - j * ny) * aty) / a.length;
      if (!b.dragging) b.omega = ((bvx + j * nx) * btx + (bvy + j * ny) * bty) / b.length;
    }
    // Push them apart so they never overlap.
    const push = (min - d) / 2;
    if (!a.dragging) a.theta -= (push * (nx * atx + ny * aty)) / a.length;
    if (!b.dragging) b.theta += (push * (nx * btx + ny * bty)) / b.length;
  }
}

function register(p: Pendulum) {
  pendulums.add(p);
  p.group.push(p);
  groups.add(p.group);
  if (!raf) {
    last = 0;
    raf = requestAnimationFrame(step);
  }
  return () => {
    pendulums.delete(p);
    const i = p.group.indexOf(p);
    if (i >= 0) p.group.splice(i, 1);
    if (!p.group.length) groups.delete(p.group);
  };
}

/* ── Components ── */

/** Relative luminance (WCAG) of a hex colour. */
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Ball colour that keeps a brand mark legible in both themes: very dark marks sit on white, very light ones on near-black. */
function ballFor(hex: string) {
  const l = luminance(hex);
  if (l < 0.06) return "#ffffff";
  if (l > 0.45) return "#16181d";
  return "var(--card)";
}

export function HangingTools({
  tools,
  rod = false,
  size = 36,
  align = "end",
  className,
}: {
  tools: readonly ToolKey[];
  rod?: boolean;
  size?: number;
  align?: "start" | "center" | "end";
  className?: string;
}) {
  const group = useRef<Pendulum[]>([]);
  if (!tools.length) return null;
  const names = tools.map((t) => TOOLS[t].name).join(", ");
  return (
    <div className={cn("relative", className)}>
      {rod && <div aria-hidden className="h-1 rounded-full bg-border-strong" />}
      <ul
        aria-label={`Tools used: ${names}`}
        className={cn(
          "flex gap-2.5 px-2",
          align === "start" && "justify-start",
          align === "center" && "justify-center",
          align === "end" && "justify-end",
        )}
      >
        {tools.map((key, i) => (
          <Charm key={key} tool={key} index={i} size={Math.round(size * SCALE)} group={group.current} />
        ))}
      </ul>
    </div>
  );
}

function Charm({ tool, index, size, group }: { tool: ToolKey; index: number; size: number; group: Pendulum[] }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const swing = useRef<HTMLDivElement>(null);
  const body = useRef<Pendulum | null>(null);
  const lastMove = useRef({ x: 0, t: 0 });
  const { name, icon } = TOOLS[tool];
  const string = Math.round(LENGTHS[index % LENGTHS.length] * SCALE);
  const length = string + 3 + size / 2; // pivot to the ball's centre

  useEffect(() => {
    if (reduce || !swing.current) return;
    const p: Pendulum = {
      el: swing.current,
      anchor: swing.current.parentElement!,
      group,
      index,
      radius: size / 2,
      length, theta: (index % 2 ? 1 : -1) * 0.08, omega: 0, phase: index * 1.7 + length, dragging: false };
    body.current = p;
    const off = register(p);
    return () => {
      off();
      body.current = null;
    };
  }, [reduce, length, index, group, size]);

  // Pointer brushing past: push in the direction of travel, in proportion to its speed.
  const brush = (e: PointerEvent<HTMLElement>) => {
    const p = body.current;
    if (!p || p.dragging) return;
    const now = performance.now();
    const dt = Math.max(8, now - lastMove.current.t) / 1000;
    const vx = lastMove.current.t ? (e.clientX - lastMove.current.x) / dt : 0;
    lastMove.current = { x: e.clientX, t: now };
    p.omega += Math.max(-6, Math.min(6, (vx / p.length) * 0.35));
  };

  // Grab, pull aside, let go.
  const pivot = useRef({ x: 0, y: 0 });
  const down = (e: PointerEvent<HTMLElement>) => {
    const p = body.current;
    setHover(true);
    if (!p || !swing.current) return;
    const r = swing.current.parentElement!.getBoundingClientRect();
    pivot.current = { x: r.left + r.width / 2, y: r.top };
    p.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    const p = body.current;
    if (!p) return;
    if (!p.dragging) return brush(e);
    const dx = e.clientX - pivot.current.x;
    const dy = Math.max(10, e.clientY - pivot.current.y);
    const target = Math.max(-MAX_THETA, Math.min(MAX_THETA, Math.atan2(dx, dy)));
    const now = performance.now();
    const dt = Math.max(8, now - lastMove.current.t) / 1000;
    p.omega = (target - p.theta) / dt; // carry the hand's speed into the release
    p.theta = target;
    lastMove.current = { x: e.clientX, t: now };
  };
  const up = () => {
    const p = body.current;
    if (p) {
      p.dragging = false;
      p.omega = Math.max(-12, Math.min(12, p.omega));
    }
  };

  return (
    <li className="relative" style={{ width: size }}>
      <div ref={swing} className="flex origin-top flex-col items-center will-change-transform">
        <span aria-hidden className="w-[1.5px] bg-muted-foreground/70" style={{ height: string }} />
        <span aria-hidden className="-mb-1 size-2 rounded-full border border-muted-foreground/80 bg-background" />
        <span
          role="img"
          aria-label={name}
          title={name}
          onPointerEnter={(e) => {
            setHover(true);
            lastMove.current = { x: e.clientX, t: performance.now() };
          }}
          onPointerLeave={() => setHover(false)}
          onPointerMove={move}
          onPointerDown={down}
          onPointerUp={up}
          onPointerCancel={up}
          className="flex cursor-grab touch-none items-center justify-center rounded-full border border-border-strong shadow-[0_10px_20px_-8px_rgb(0_0_0/0.5)] transition-colors duration-300 select-none active:cursor-grabbing"
          style={{ width: size, height: size, background: ballFor(icon.hex) }}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="pointer-events-none"
            style={{ width: size * 0.5, height: size * 0.5, fill: `#${icon.hex}` }}
          >
            <path d={icon.path} />
          </svg>
        </span>
      </div>
      {/* Name tag. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-md bg-foreground px-2 py-0.5 text-[0.8125rem] font-medium whitespace-nowrap text-background transition-[opacity,transform] duration-200",
          hover ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
        style={{ top: string + size + 14 }}
      >
        {name}
      </span>
    </li>
  );
}
