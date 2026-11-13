import { useEffect, useRef } from "react";

/*
 * A page-wide sky of tiny dots. They drift like a murmuration of starlings, then
 * pull together, drone-show style, into a shape: my name, a neural network, and
 * a cross-section of the subsurface with a well drilled through it. Then they
 * break apart and flock again.
 *
 * Everything lives in typed arrays and is drawn on one canvas fixed behind the page.
 */

type Shape = "deo" | "neural" | "subsurface";
type Phase = { kind: "flock" | Shape; ms: number };

const CYCLE: Phase[] = [
  { kind: "flock", ms: 3200 },
  { kind: "deo", ms: 6500 },
  { kind: "flock", ms: 6000 },
  { kind: "neural", ms: 6500 },
  { kind: "flock", ms: 6000 },
  { kind: "subsurface", ms: 6500 },
  { kind: "flock", ms: 3000 },
];

const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

/** Points that fill the letters "DEO", sampled from an offscreen render. */
function deoPoints(w: number, h: number, n: number): Float32Array {
  const box = Math.min(w * 0.94, 1500);
  const c = document.createElement("canvas");
  const cw = 600;
  const ch = 260;
  c.width = cw;
  c.height = ch;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.fillStyle = "#000";
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
  const out = new Float32Array(n * 2);
  const count = hits.length / 2;
  for (let i = 0; i < n; i++) {
    const k = (Math.random() * count) | 0;
    out[i * 2] = ox + (hits[k * 2] + rand(-1, 1)) * s;
    out[i * 2 + 1] = oy + (hits[k * 2 + 1] + rand(-1, 1)) * s;
  }
  return out;
}

/** A small feed-forward net: nodes as dense discs, weights as dotted lines. */
function neuralPoints(w: number, h: number, n: number): Float32Array {
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
    for (const a of nodes[li]) for (const b of nodes[li + 1]) edges.push([a[0], a[1], b[0], b[1]]);

  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    let x: number;
    let y: number;
    if (Math.random() < 0.42) {
      const [nx, ny] = flat[(Math.random() * flat.length) | 0];
      const a = rand(0, Math.PI * 2);
      const d = Math.sqrt(Math.random()) * r;
      x = nx + Math.cos(a) * d;
      y = ny + Math.sin(a) * d;
    } else {
      const [ax, ay, bx, by] = edges[(Math.random() * edges.length) | 0];
      const t = Math.random();
      x = ax + (bx - ax) * t + rand(-0.6, 0.6);
      y = ay + (by - ay) * t + rand(-0.6, 0.6);
    }
    out[i * 2] = x;
    out[i * 2 + 1] = y;
  }
  return out;
}

/** Folded rock layers, sparse fill between horizons, and a well with its log trace. */
function subsurfacePoints(w: number, h: number, n: number): Float32Array {
  const bw = Math.min(w * 0.94, 1500);
  const bh = Math.min(h * 0.72, 620);
  const ox = w / 2 - bw / 2;
  const oy = h / 2 - bh / 2;
  const horizons = Array.from({ length: 6 }, (_, i) => ({
    base: oy + (i / 5) * bh,
    amp: bh * (0.05 + 0.03 * Math.sin(i * 1.7)),
    k: (Math.PI * 2) / bw * (0.9 + i * 0.08),
    ph: i * 0.6,
  }));
  const yAt = (hz: (typeof horizons)[number], x: number) => hz.base + Math.sin((x - ox) * hz.k + hz.ph) * hz.amp - Math.cos((x - ox) * hz.k * 0.5) * hz.amp * 0.6;
  const wellX = ox + bw * 0.62;

  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const p = Math.random();
    let x: number;
    let y: number;
    if (p < 0.6) {
      // a horizon line
      const hz = horizons[(Math.random() * horizons.length) | 0];
      x = ox + Math.random() * bw;
      y = yAt(hz, x) + rand(-1.2, 1.2);
    } else if (p < 0.82) {
      // sparse fill inside a layer; deeper layers are denser
      const li = Math.min(4, Math.floor(Math.pow(Math.random(), 0.7) * 5));
      x = ox + Math.random() * bw;
      const top = yAt(horizons[li], x);
      const bot = yAt(horizons[li + 1], x);
      y = top + (bot - top) * Math.random();
    } else if (p < 0.92) {
      // the wellbore
      x = wellX + rand(-1.5, 1.5);
      y = oy - bh * 0.18 + Math.random() * bh * 1.12;
    } else {
      // a wiggly log trace beside the well
      const t = Math.random();
      y = oy + t * bh;
      x = wellX + 14 + Math.abs(Math.sin(t * 37) * 10 + Math.sin(t * 91) * 6 + Math.sin(t * 13) * 8);
    }
    out[i * 2] = x;
    out[i * 2 + 1] = y;
  }
  return out;
}

const BUILD: Record<Shape, (w: number, h: number, n: number) => Float32Array> = {
  deo: deoPoints,
  neural: neuralPoints,
  subsurface: subsurfacePoints,
};

export function Murmuration() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let N = 0;
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let shade = new Float32Array(0); // per-dot brightness, for a little depth
    let hx = new Float32Array(0); // each bird's place in the flock, as a unit offset
    let hy = new Float32Array(0);
    const targets: Partial<Record<Shape, Float32Array>> = {};

    let rgb = "45,212,191";
    let alpha = 0.5;
    const readColor = () => {
      const dark = document.documentElement.classList.contains("dark");
      const hex = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#2dd4bf";
      const m = hex.replace("#", "").match(/.{2}/g);
      if (m && m.length >= 3) rgb = m.slice(0, 3).map((h) => parseInt(h, 16)).join(",");
      alpha = dark ? 0.55 : 0.42;
    };

    const rebuildTargets = () => {
      for (const k of Object.keys(BUILD) as Shape[]) targets[k] = BUILD[k](W, H, N);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const want = Math.round(Math.min(9000, Math.max(2200, (W * H) / 140)));
      if (want !== N) {
        const [ox, oy, ovx, ovy, os, ohx, ohy] = [px, py, vx, vy, shade, hx, hy];
        px = new Float32Array(want);
        py = new Float32Array(want);
        vx = new Float32Array(want);
        vy = new Float32Array(want);
        shade = new Float32Array(want);
        hx = new Float32Array(want);
        hy = new Float32Array(want);
        for (let i = 0; i < want; i++) {
          if (i < N) {
            px[i] = ox[i];
            py[i] = oy[i];
            vx[i] = ovx[i];
            vy[i] = ovy[i];
            shade[i] = os[i];
            hx[i] = ohx[i];
            hy[i] = ohy[i];
          } else {
            // start as a loose flock around the middle of the sky
            const a = rand(0, Math.PI * 2);
            const d = Math.sqrt(Math.random()) * Math.min(W, H) * 0.35;
            px[i] = W * 0.5 + Math.cos(a) * d * 1.6;
            py[i] = H * 0.45 + Math.sin(a) * d * 0.6;
            shade[i] = rand(0.35, 1);
            // a gaussian-ish blob: dense core, feathered edges
            const ga = rand(0, Math.PI * 2);
            const gd = (Math.random() + Math.random() + Math.random()) / 3;
            hx[i] = Math.cos(ga) * gd * 2;
            hy[i] = Math.sin(ga) * gd * 2;
          }
        }
        N = want;
      }
      rebuildTargets();
    };

    readColor();
    resize();

    // pointer: dots scatter around the cursor
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
    // re-sample the letters once the display font has loaded
    document.fonts?.ready.then(() => {
      targets.deo = deoPoints(W, H, N);
    });

    const draw = (t: number, formed: number) => {
      ctx.clearRect(0, 0, W, H);
      const size = formed > 0.5 ? 1.35 : 1.6;
      // three brightness buckets keep fillStyle changes cheap
      for (let b = 0; b < 3; b++) {
        const lo = 0.35 + b * 0.22;
        const hi = lo + 0.22;
        ctx.fillStyle = `rgba(${rgb},${(alpha * (0.45 + b * 0.28)).toFixed(3)})`;
        for (let i = 0; i < N; i++) {
          const s = shade[i];
          if (s < lo || s >= (b === 2 ? 2 : hi)) continue;
          // twinkle a little once a shape has formed, like drone lights
          if (formed > 0.6 && ((i * 7919 + ((t / 90) | 0)) % 97) === 0) continue;
          ctx.fillRect(px[i], py[i], size, size);
        }
      }
    };

    if (reduce) {
      // no motion: just show the name, still
      const tgt = targets.deo!;
      const paint = () => {
        for (let i = 0; i < N; i++) {
          px[i] = tgt[i * 2];
          py[i] = tgt[i * 2 + 1];
        }
        draw(0, 0);
      };
      paint();
      document.fonts?.ready.then(() => {
        targets.deo = deoPoints(W, H, N);
        const t2 = targets.deo;
        for (let i = 0; i < N; i++) {
          px[i] = t2[i * 2];
          py[i] = t2[i * 2 + 1];
        }
        draw(0, 0);
      });
      return () => {
        themeObs.disconnect();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
      };
    }

    const total = CYCLE.reduce((s, p) => s + p.ms, 0);
    let raf = 0;
    let last = performance.now();
    const start = last;

    const frame = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      const t = now - start;

      // where are we in the show?
      let into = t % total;
      let phase = CYCLE[0];
      for (const p of CYCLE) {
        if (into < p.ms) {
          phase = p;
          break;
        }
        into -= p.ms;
      }
      const shape = phase.kind === "flock" ? null : targets[phase.kind];
      // ease the pull in, so dots stream into place rather than snap
      const pull = shape ? Math.min(1, into / 1800) : 0;
      const formed = shape ? Math.min(1, into / 2600) : 0;

      // a wandering centre the flock chases: the "lead birds"
      const ts = t * 0.00018;
      const cx = W * (0.5 + 0.32 * Math.sin(ts * 1.3) + 0.08 * Math.sin(ts * 3.7));
      const cy = H * (0.42 + 0.2 * Math.sin(ts * 1.9 + 1) + 0.06 * Math.cos(ts * 4.3));
      const tf = t * 0.00035;
      // the flock's size and heading breathe slowly
      const sx = Math.min(W, 1400) * (0.2 + 0.08 * Math.sin(ts * 2.3));
      const sy = Math.min(H, 900) * (0.09 + 0.05 * Math.cos(ts * 1.7 + 0.5));
      const rot = Math.sin(ts * 1.1) * 0.6 + Math.sin(ts * 2.9) * 0.2;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const damp = Math.pow(shape ? 0.86 : 0.94, dt);

      for (let i = 0; i < N; i++) {
        let x = px[i];
        let y = py[i];
        let ax: number;
        let ay: number;

        if (shape) {
          const dx = shape[i * 2] - x;
          const dy = shape[i * 2 + 1] - y;
          const k = 0.012 + 0.05 * pull * pull;
          ax = dx * k;
          ay = dy * k;
          // a faint shimmer once settled
          ax += Math.sin(tf * 6 + i) * 0.03;
          ay += Math.cos(tf * 5 + i * 1.3) * 0.03;
        } else {
          // Each bird holds a place in a blob that stretches, folds and turns over
          // time, which gives the murmuration its rolling shape.
          const u = hx[i];
          const v = hy[i];
          const fold = Math.sin(u * 1.6 + tf * 2.1) * 0.55 + Math.cos(v * 2.2 - tf * 1.4) * 0.3;
          const lx = u * sx + fold * sy * 0.5;
          const ly = v * sy + Math.sin(u * 2.4 + tf * 1.7) * sy * 0.35;
          const gx = cx + lx * cosR - ly * sinR;
          const gy = cy + lx * sinR + ly * cosR;
          const dx = gx - x;
          const dy = gy - y;
          ax = dx * 0.0016;
          ay = dy * 0.0016;
          // local swirl so neighbours ripple together
          const nx = x * 0.006;
          const ny = y * 0.006;
          const ang = Math.sin(nx + tf * 1.5) * 2 + Math.cos(ny * 1.2 - tf) * 2;
          ax += Math.cos(ang) * 0.05;
          ay += Math.sin(ang) * 0.05;
        }

        // scatter from the cursor
        const rx = x - mx;
        const ry = y - my;
        const r2 = rx * rx + ry * ry;
        if (r2 < 9000) {
          const f = (1 - r2 / 9000) * 0.9;
          const r = Math.sqrt(r2) + 0.01;
          ax += (rx / r) * f;
          ay += (ry / r) * f;
        }

        let nvx = (vx[i] + ax * dt) * damp;
        let nvy = (vy[i] + ay * dt) * damp;
        const sp = nvx * nvx + nvy * nvy;
        const max = shape ? 14 : 4;
        if (sp > max * max) {
          const s = max / Math.sqrt(sp);
          nvx *= s;
          nvy *= s;
        }
        vx[i] = nvx;
        vy[i] = nvy;
        x += nvx * dt;
        y += nvy * dt;
        px[i] = x;
        py[i] = y;
      }

      draw(t, formed);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      themeObs.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}
