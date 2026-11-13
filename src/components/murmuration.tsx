import { useEffect, useRef } from "react";

/*
 * A page-wide sky of tiny dots, moved by physics rather than a script.
 *
 *  • Flocking: Reynolds' boids. Each bird reacts only to its nearest neighbours
 *    (separation, alignment, cohesion), as starlings do; a spatial hash keeps it fast.
 *    Birds keep a minimum airspeed, are drawn loosely toward a drifting roost, and
 *    scatter from the cursor as if from a falcon. Newton's laws move them.
 *  • Forming shapes: every dot is a damped spring pulled toward its slot, the way a
 *    show drone homes in, slightly underdamped so it swoops in and settles.
 *  • Neural net: once formed, signals travel along the weights, layer to layer (a forward pass).
 *  • Subsurface: once formed, fluid moves through the rock by Darcy's law,
 *    v = −(k/μ)∇p, with radial inflow to the well (v ∝ k / r). Sands with high
 *    permeability flow, shale barely moves, flow speeds up near the wellbore, and
 *    produced fluid rises up the well while the outer boundary recharges.
 */

type Shape = "deo" | "neural" | "subsurface";
type Phase = { kind: "flock" | Shape; ms: number };

const CYCLE: Phase[] = [
  { kind: "flock", ms: 3500 },
  { kind: "deo", ms: 6500 },
  { kind: "flock", ms: 6500 },
  { kind: "neural", ms: 7000 },
  { kind: "flock", ms: 6500 },
  { kind: "subsurface", ms: 9000 },
  { kind: "flock", ms: 3000 },
];

const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

/** Target slots for a shape, plus per-dot roles for shapes that keep moving once formed. */
type ShapeData = {
  pts: Float32Array; // x,y per dot
  role: Uint8Array; // 0 static · 1 moving with the shape's physics · 2 rising up the well
  a: Float32Array; // neural: edge index · subsurface: layer index
  b: Float32Array; // neural: position along the edge · subsurface: depth fraction within the layer
  geo?: Neural | Subsurface;
};
type Neural = { kind: "neural"; edges: [number, number, number, number][] };
type Subsurface = {
  kind: "subsurface";
  yAt: (horizon: number, x: number) => number;
  perm: number[]; // relative permeability per layer, between horizon i and i+1
  wellX: number;
  wellTop: number;
  x0: number;
  x1: number;
};

const blank = (n: number): ShapeData => ({
  pts: new Float32Array(n * 2),
  role: new Uint8Array(n),
  a: new Float32Array(n),
  b: new Float32Array(n),
});

/** Points that fill the letters "DEO", sampled from an offscreen render. */
function deoShape(w: number, h: number, n: number): ShapeData {
  const box = Math.min(w * 0.94, 1500);
  const c = document.createElement("canvas");
  const cw = 600;
  const ch = 260;
  c.width = cw;
  c.height = ch;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 220px "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif`;
  g.fillText("DEO", cw / 2, ch / 2 + 8);
  const data = g.getImageData(0, 0, cw, ch).data;
  const hits: number[] = [];
  for (let y = 0; y < ch; y += 2) for (let x = 0; x < cw; x += 2) if (data[(y * cw + x) * 4 + 3] > 128) hits.push(x, y);

  const s = box / cw;
  const ox = w / 2 - box / 2;
  const oy = h / 2 - (ch * s) / 2;
  const out = blank(n);
  const count = hits.length / 2;
  for (let i = 0; i < n; i++) {
    const k = (Math.random() * count) | 0;
    out.pts[i * 2] = ox + (hits[k * 2] + rand(-1, 1)) * s;
    out.pts[i * 2 + 1] = oy + (hits[k * 2 + 1] + rand(-1, 1)) * s;
  }
  return out;
}

/** A small feed-forward net: nodes as dense discs, weights as dotted lines carrying signal. */
function neuralShape(w: number, h: number, n: number): ShapeData {
  const layers = [4, 6, 6, 3];
  const bw = Math.min(w * 0.88, 1300);
  const bh = Math.min(h * 0.7, 620);
  const ox = w / 2 - bw / 2;
  const oy = h / 2 - bh / 2;
  const r = Math.max(8, Math.min(22, bw / 55));
  const nodes = layers.map((count, li) =>
    Array.from({ length: count }, (_, ni) => [ox + (li / (layers.length - 1)) * bw, oy + ((ni + 0.5) / count) * bh] as const),
  );
  const flat = nodes.flat();
  const edges: [number, number, number, number][] = [];
  for (let li = 0; li < layers.length - 1; li++)
    for (const p of nodes[li]) for (const q of nodes[li + 1]) edges.push([p[0], p[1], q[0], q[1]]);

  const out = blank(n);
  out.geo = { kind: "neural", edges };
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.42) {
      const [nx, ny] = flat[(Math.random() * flat.length) | 0];
      const ang = rand(0, Math.PI * 2);
      const d = Math.sqrt(Math.random()) * r;
      out.pts[i * 2] = nx + Math.cos(ang) * d;
      out.pts[i * 2 + 1] = ny + Math.sin(ang) * d;
    } else {
      const e = (Math.random() * edges.length) | 0;
      const t = Math.random();
      const [ax, ay, bx, by] = edges[e];
      out.role[i] = 1;
      out.a[i] = e;
      out.b[i] = t;
      out.pts[i * 2] = ax + (bx - ax) * t;
      out.pts[i * 2 + 1] = ay + (by - ay) * t;
    }
  }
  return out;
}

/** Folded rock layers with fluid in their pores, and a well with its log trace. */
function subsurfaceShape(w: number, h: number, n: number): ShapeData {
  const bw = Math.min(w * 0.94, 1500);
  const bh = Math.min(h * 0.72, 620);
  const ox = w / 2 - bw / 2;
  const oy = h / 2 - bh / 2;
  const horizons = Array.from({ length: 6 }, (_, i) => ({
    base: oy + (i / 5) * bh,
    amp: bh * (0.05 + 0.03 * Math.sin(i * 1.7)),
    k: ((Math.PI * 2) / bw) * (0.9 + i * 0.08),
    ph: i * 0.6,
  }));
  const yAt = (hi: number, x: number) => {
    const hz = horizons[hi];
    return hz.base + Math.sin((x - ox) * hz.k + hz.ph) * hz.amp - Math.cos((x - ox) * hz.k * 0.5) * hz.amp * 0.6;
  };
  // cap shale · reservoir sand · shale · sand · silt
  const perm = [0.03, 1, 0.05, 0.6, 0.18];
  const wellX = ox + bw * 0.62;
  const wellTop = oy - bh * 0.18;

  const out = blank(n);
  out.geo = { kind: "subsurface", yAt, perm, wellX, wellTop, x0: ox, x1: ox + bw };
  for (let i = 0; i < n; i++) {
    const p = Math.random();
    let x: number;
    let y: number;
    if (p < 0.45) {
      // a horizon (bedding surface)
      const hi = (Math.random() * horizons.length) | 0;
      x = ox + Math.random() * bw;
      y = yAt(hi, x) + rand(-1.2, 1.2);
    } else if (p < 0.85) {
      // fluid in the pore space of a layer
      const li = (Math.random() * 5) | 0;
      const f = rand(0.08, 0.92);
      x = ox + Math.random() * bw;
      y = yAt(li, x) + (yAt(li + 1, x) - yAt(li, x)) * f;
      out.role[i] = 1;
      out.a[i] = li;
      out.b[i] = f;
    } else if (p < 0.93) {
      // the wellbore
      x = wellX + rand(-1.5, 1.5);
      y = wellTop + Math.random() * bh * 1.12;
    } else {
      // a log trace beside the well
      const t = Math.random();
      y = oy + t * bh;
      x = wellX + 14 + Math.abs(Math.sin(t * 37) * 10 + Math.sin(t * 91) * 6 + Math.sin(t * 13) * 8);
    }
    out.pts[i * 2] = x;
    out.pts[i * 2 + 1] = y;
  }
  return out;
}

const BUILD: Record<Shape, (w: number, h: number, n: number) => ShapeData> = {
  deo: deoShape,
  neural: neuralShape,
  subsurface: subsurfaceShape,
};

// Boids parameters (pixels, per 60 fps frame)
const R = 16; // neighbour radius
const K = 8; // topological neighbours: starlings track about seven
const SEP_R = 6;
const MIN_SPEED = 1.3;
const MAX_SPEED = 3.6;

export function Murmuration() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let N = 0;
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let shade = new Float32Array(0);
    // spatial hash
    let cols = 0;
    let rows = 0;
    let cellOf = new Int32Array(0);
    let cellStart = new Int32Array(0);
    let cellFill = new Int32Array(0);
    let order = new Int32Array(0);
    const shapes: Partial<Record<Shape, ShapeData>> = {};

    let rgb = "45,212,191";
    let alpha = 0.5;
    const readColor = () => {
      const dark = document.documentElement.classList.contains("dark");
      const hex = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#2dd4bf";
      const m = hex.replace("#", "").match(/.{2}/g);
      if (m && m.length >= 3) rgb = m.slice(0, 3).map((x) => parseInt(x, 16)).join(",");
      alpha = dark ? 0.55 : 0.42;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const want = Math.round(Math.min(9000, Math.max(2200, (W * H) / 140)));
      if (want !== N) {
        const old = { px, py, vx, vy, shade };
        px = new Float32Array(want);
        py = new Float32Array(want);
        vx = new Float32Array(want);
        vy = new Float32Array(want);
        shade = new Float32Array(want);
        for (let i = 0; i < want; i++) {
          if (i < N) {
            px[i] = old.px[i];
            py[i] = old.py[i];
            vx[i] = old.vx[i];
            vy[i] = old.vy[i];
            shade[i] = old.shade[i];
          } else {
            const a = rand(0, Math.PI * 2);
            const d = Math.sqrt(Math.random()) * Math.min(W, H) * 0.3;
            px[i] = W * 0.5 + Math.cos(a) * d * 1.6;
            py[i] = H * 0.45 + Math.sin(a) * d * 0.6;
            const h = rand(0, Math.PI * 2);
            vx[i] = Math.cos(h) * 2;
            vy[i] = Math.sin(h) * 2;
            shade[i] = rand(0.35, 1);
          }
        }
        N = want;
        cellOf = new Int32Array(N);
        order = new Int32Array(N);
      }
      // the grid reaches one screen beyond each edge so birds that stray off-screen still flock
      cols = Math.ceil((W * 3) / R);
      rows = Math.ceil((H * 3) / R);
      cellStart = new Int32Array(cols * rows + 1);
      cellFill = new Int32Array(cols * rows);
      for (const k of Object.keys(BUILD) as Shape[]) shapes[k] = BUILD[k](W, H, N);
    };

    readColor();
    resize();

    let mx = -1e4;
    let my = -1e4;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onLeave = () => {
      mx = my = -1e4;
    };
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };
    const themeObs = new MutationObserver(readColor);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    const cleanup = () => {
      clearTimeout(resizeTimer);
      themeObs.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };

    const draw = (t: number, formed: number) => {
      ctx.clearRect(0, 0, W, H);
      const size = formed > 0.5 ? 1.35 : 1.6;
      for (let b = 0; b < 3; b++) {
        const lo = 0.35 + b * 0.22;
        const hi = b === 2 ? 2 : lo + 0.22;
        ctx.fillStyle = `rgba(${rgb},${(alpha * (0.45 + b * 0.28)).toFixed(3)})`;
        for (let i = 0; i < N; i++) {
          const s = shade[i];
          if (s < lo || s >= hi) continue;
          const x = px[i];
          const y = py[i];
          if (x < -2 || y < -2 || x > W || y > H) continue;
          if (formed > 0.6 && (i * 7919 + ((t / 90) | 0)) % 97 === 0) continue;
          ctx.fillRect(x, y, size, size);
        }
      }
    };

    const snapTo = (s: ShapeData) => {
      for (let i = 0; i < N; i++) {
        px[i] = s.pts[i * 2];
        py[i] = s.pts[i * 2 + 1];
      }
      draw(0, 0);
    };

    if (reduce) {
      snapTo(shapes.deo!);
      document.fonts?.ready.then(() => {
        shapes.deo = deoShape(W, H, N);
        snapTo(shapes.deo);
      });
      return cleanup;
    }
    document.fonts?.ready.then(() => {
      shapes.deo = deoShape(W, H, N);
    });

    /** One step of Reynolds' boids over a spatial hash. */
    const flock = (dt: number, t: number) => {
      const offX = W;
      const offY = H;
      const cells = cols * rows;
      cellFill.fill(0);
      for (let i = 0; i < N; i++) {
        let cx = ((px[i] + offX) / R) | 0;
        let cy = ((py[i] + offY) / R) | 0;
        cx = cx < 0 ? 0 : cx >= cols ? cols - 1 : cx;
        cy = cy < 0 ? 0 : cy >= rows ? rows - 1 : cy;
        const c = cy * cols + cx;
        cellOf[i] = c;
        cellFill[c]++;
      }
      cellStart[0] = 0;
      for (let c = 0; c < cells; c++) {
        cellStart[c + 1] = cellStart[c] + cellFill[c];
        cellFill[c] = cellStart[c];
      }
      for (let i = 0; i < N; i++) order[cellFill[cellOf[i]]++] = i;

      // the roost the flock is drawn to drifts slowly across the sky
      const ts = t * 0.00018;
      const rx = W * (0.5 + 0.3 * Math.sin(ts * 1.3) + 0.08 * Math.sin(ts * 3.7));
      const ry = H * (0.42 + 0.18 * Math.sin(ts * 1.9 + 1) + 0.06 * Math.cos(ts * 4.3));
      const R2 = R * R;
      const S2 = SEP_R * SEP_R;

      for (let i = 0; i < N; i++) {
        const x = px[i];
        const y = py[i];
        const c = cellOf[i];
        const ccx = c % cols;
        const ccy = (c / cols) | 0;
        let n = 0;
        let sx = 0;
        let sy = 0;
        let svx = 0;
        let svy = 0;
        let sepx = 0;
        let sepy = 0;
        outer: for (let oy = -1; oy <= 1; oy++) {
          const yy = ccy + oy;
          if (yy < 0 || yy >= rows) continue;
          for (let ox = -1; ox <= 1; ox++) {
            const xx = ccx + ox;
            if (xx < 0 || xx >= cols) continue;
            const cc = yy * cols + xx;
            for (let k = cellStart[cc], end = cellStart[cc + 1]; k < end; k++) {
              const j = order[k];
              if (j === i) continue;
              const dx = px[j] - x;
              const dy = py[j] - y;
              const d2 = dx * dx + dy * dy;
              if (d2 > R2) continue;
              sx += dx;
              sy += dy;
              svx += vx[j];
              svy += vy[j];
              if (d2 < S2 && d2 > 1e-4) {
                sepx -= dx / d2;
                sepy -= dy / d2;
              }
              if (++n >= K) break outer;
            }
          }
        }

        let ax = 0;
        let ay = 0;
        if (n > 0) {
          ax += (svx / n - vx[i]) * 0.06; // alignment
          ay += (svy / n - vy[i]) * 0.06;
          ax += (sx / n) * 0.0035; // cohesion
          ay += (sy / n) * 0.0035;
          ax += sepx * 1.1; // separation
          ay += sepy * 1.1;
        }
        // pull toward the roost, growing with distance
        const dx = rx - x;
        const dy = ry - y;
        const d = Math.sqrt(dx * dx + dy * dy) + 1;
        const pull = Math.min(0.07, d * 0.00016);
        ax += (dx / d) * pull;
        ay += (dy / d) * pull;
        // falcon: the cursor sends an escape wave through the flock
        const fx = x - mx;
        const fy = y - my;
        const f2 = fx * fx + fy * fy;
        if (f2 < 14400) {
          const f = Math.sqrt(f2) + 0.01;
          const s = (1 - f / 120) * 0.6;
          ax += (fx / f) * s;
          ay += (fy / f) * s;
        }

        let nvx = vx[i] + ax * dt;
        let nvy = vy[i] + ay * dt;
        let sp = Math.sqrt(nvx * nvx + nvy * nvy);
        if (sp < 1e-4) {
          const h = Math.random() * Math.PI * 2;
          nvx = Math.cos(h);
          nvy = Math.sin(h);
          sp = 1;
        }
        // birds can't hover or exceed their top speed
        const clamped = sp < MIN_SPEED ? MIN_SPEED : sp > MAX_SPEED ? MAX_SPEED : sp;
        if (clamped !== sp) {
          nvx *= clamped / sp;
          nvy *= clamped / sp;
        }
        vx[i] = nvx;
        vy[i] = nvy;
      }
      for (let i = 0; i < N; i++) {
        px[i] += vx[i] * dt;
        py[i] += vy[i] * dt;
      }
    };

    /** Advance the moving parts of a formed shape: signals along weights, or Darcy flow. */
    const advect = (s: ShapeData, dt: number) => {
      const g = s.geo;
      if (!g) return;
      if (g.kind === "neural") {
        for (let i = 0; i < N; i++) {
          if (s.role[i] !== 1) continue;
          let t = s.b[i] + 0.004 * dt;
          if (t > 1) t -= 1;
          s.b[i] = t;
          const [ax, ay, bx, by] = g.edges[s.a[i]];
          s.pts[i * 2] = ax + (bx - ax) * t;
          s.pts[i * 2 + 1] = ay + (by - ay) * t;
        }
        return;
      }
      // Darcy: radial inflow, v = k·q / r toward the well, along the bed
      const q = 70;
      const rw = 6;
      for (let i = 0; i < N; i++) {
        const role = s.role[i];
        if (role === 0) continue;
        const ix = i * 2;
        if (role === 2) {
          // produced: lifted up the wellbore
          s.pts[ix + 1] -= 4.5 * dt;
          if (s.pts[ix + 1] < g.wellTop) {
            // pressure support recharges the reservoir: a parcel re-enters at a radius
            // drawn ∝ r, the share of pore volume each radius holds, so density stays even
            const li = s.a[i];
            const edge = Math.random() < 0.5 ? g.x0 : g.x1;
            const x = g.wellX + (edge - g.wellX) * Math.sqrt(rand(0.05, 1));
            const y = g.yAt(li, x) + (g.yAt(li + 1, x) - g.yAt(li, x)) * s.b[i];
            s.pts[ix] = x;
            s.pts[ix + 1] = y;
            px[i] = x;
            py[i] = y;
            vx[i] = vy[i] = 0;
            s.role[i] = 1;
          }
          continue;
        }
        const li = s.a[i];
        const x = s.pts[ix];
        const r = g.wellX - x;
        const dist = Math.abs(r);
        let v = (g.perm[li] * q) / (dist + rw);
        if (v > 5) v = 5;
        const step = Math.sign(r) * v * dt;
        if (dist <= Math.abs(step) + 0.5) {
          s.pts[ix] = g.wellX;
          s.role[i] = 2;
          continue;
        }
        const nx = x + step;
        s.pts[ix] = nx;
        s.pts[ix + 1] = g.yAt(li, nx) + (g.yAt(li + 1, nx) - g.yAt(li, nx)) * s.b[i];
      }
    };

    /** Damped springs pull every dot to its slot. */
    const form = (s: ShapeData, dt: number, into: number) => {
      const ramp = Math.min(1, into / 1800);
      const k = 0.003 + 0.03 * ramp * ramp;
      const c = 2 * Math.sqrt(k) * 0.75; // a touch underdamped: swoop in, settle
      const pts = s.pts;
      for (let i = 0; i < N; i++) {
        const x = px[i];
        const y = py[i];
        let ax = (pts[i * 2] - x) * k - vx[i] * c;
        let ay = (pts[i * 2 + 1] - y) * k - vy[i] * c;
        const fx = x - mx;
        const fy = y - my;
        const f2 = fx * fx + fy * fy;
        if (f2 < 9000) {
          const f = Math.sqrt(f2) + 0.01;
          const st = (1 - f2 / 9000) * 1.2;
          ax += (fx / f) * st;
          ay += (fy / f) * st;
        }
        let nvx = vx[i] + ax * dt;
        let nvy = vy[i] + ay * dt;
        const sp = nvx * nvx + nvy * nvy;
        if (sp > 196) {
          const m = 14 / Math.sqrt(sp);
          nvx *= m;
          nvy *= m;
        }
        vx[i] = nvx;
        vy[i] = nvy;
        px[i] = x + nvx * dt;
        py[i] = y + nvy * dt;
      }
    };

    const total = CYCLE.reduce((sum, p) => sum + p.ms, 0);
    let raf = 0;
    const start = performance.now();
    let last = start;

    const frame = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      const t = now - start;

      let into = t % total;
      let phase = CYCLE[0];
      for (const p of CYCLE) {
        if (into < p.ms) {
          phase = p;
          break;
        }
        into -= p.ms;
      }

      let formed = 0;
      if (phase.kind === "flock") {
        flock(dt, t);
      } else {
        const s = shapes[phase.kind]!;
        formed = Math.min(1, into / 2600);
        if (into > 2600) advect(s, dt);
        form(s, dt, into);
      }

      draw(t, formed);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}
