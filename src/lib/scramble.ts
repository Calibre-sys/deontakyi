/*
 * Text scramble, applied to every piece of text on the page.
 *
 * Each text node decodes once, the first time it scrolls into view: a band of random glyphs
 * sweeps left to right and leaves the real text behind it. Links and buttons scramble again
 * on hover. Glyphs keep the case of the character they stand in for, so line lengths barely
 * move while it runs.
 *
 * It writes straight to the DOM text nodes, so React never re-renders for it. If React
 * changes a node mid-animation, the animation stops and leaves React's text alone.
 * Reduced motion turns the whole thing off.
 */

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGIT = "0123456789";
const SYMBOL = "#%&*+=<>/\\[]{}";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE", "IFRAME"]);

type Run = { original: string; written: string; raf: number };

const runs = new WeakMap<Text, Run>();
const seen = new WeakSet<Text>();
const pending = new WeakMap<Element, Text[]>();

const pick = (set: string) => set[(Math.random() * set.length) | 0];

function glyphFor(ch: string) {
  if (ch >= "a" && ch <= "z") return pick(LOWER);
  if (ch >= "A" && ch <= "Z") return pick(UPPER);
  if (ch >= "0" && ch <= "9") return pick(DIGIT);
  if (/\s/.test(ch)) return ch;
  if (/[.,:;'"’·—–\-()!?]/.test(ch)) return ch; // punctuation holds still so words keep their shape
  return pick(SYMBOL);
}

function skipped(node: Node) {
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el instanceof SVGElement) return true;
    if (el.hasAttribute("data-no-scramble")) return true;
    if (el.isContentEditable) return true;
  }
  return false;
}

/** Plays the decode on one text node. */
export function scrambleNode(node: Text, { duration }: { duration?: number } = {}) {
  const active = runs.get(node);
  const original = active ? active.original : (node.nodeValue ?? "");
  if (active) cancelAnimationFrame(active.raf);
  if (!original.trim()) return;

  const len = original.length;
  // Short labels decode whole; long paragraphs get a narrower band that sweeps faster per character.
  const band = len <= 32 ? len : Math.min(18, Math.max(8, len * 0.08));
  const ms = duration ?? Math.min(1100, 280 + len * (len <= 32 ? 18 : 4.5));
  const start = performance.now();
  const run: Run = { original, written: node.nodeValue ?? "", raf: 0 };
  runs.set(node, run);
  let lastSwap = 0;
  let noise = "";

  const frame = (now: number) => {
    // React (or anything else) rewrote the text: stop and keep theirs.
    if (node.nodeValue !== run.written) {
      runs.delete(node);
      return;
    }
    const t = Math.min(1, (now - start) / ms);
    const eased = 1 - Math.pow(1 - t, 2);
    const head = eased * (len + band);
    // New random glyphs about every 45ms reads as flicker without strobing.
    if (now - lastSwap > 45 || !noise) {
      lastSwap = now;
      let n = "";
      for (let i = 0; i < len; i++) n += glyphFor(original[i]);
      noise = n;
    }
    let out = "";
    for (let i = 0; i < len; i++) out += i < head - band ? original[i] : noise[i];
    if (t >= 1) out = original;
    node.nodeValue = out;
    run.written = out;
    if (t < 1) run.raf = requestAnimationFrame(frame);
    else runs.delete(node);
  };
  run.raf = requestAnimationFrame(frame);
}

/** Text nodes under an element that should scramble. */
function textNodes(root: Node) {
  const out: Text[] = [];
  if (root.nodeType === Node.TEXT_NODE) {
    if ((root.nodeValue ?? "").trim() && !skipped(root)) out.push(root as Text);
    return out;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => ((n.nodeValue ?? "").trim() && !skipped(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n as Text);
  return out;
}

/** Starts the page-wide scramble. Returns a cleanup function. */
export function startScramble(root: HTMLElement = document.body) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        io.unobserve(el);
        const list = pending.get(el);
        pending.delete(el);
        list?.forEach((n, i) => {
          if (n.isConnected) window.setTimeout(() => scrambleNode(n), Math.min(i * 30, 240));
        });
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );

  const register = (from: Node) => {
    for (const node of textNodes(from)) {
      if (seen.has(node)) continue;
      seen.add(node);
      const parent = node.parentElement;
      if (!parent) continue;
      const list = pending.get(parent);
      if (list) list.push(node);
      else {
        pending.set(parent, [node]);
        io.observe(parent);
      }
    }
  };

  register(root);

  // New content (route changes, tabs, swapped panels) joins in as it mounts.
  let queued: Node[] = [];
  let scheduled = 0;
  const mo = new MutationObserver((records) => {
    for (const r of records) r.addedNodes.forEach((n) => queued.push(n));
    if (!scheduled)
      scheduled = requestAnimationFrame(() => {
        scheduled = 0;
        const batch = queued;
        queued = [];
        batch.forEach((n) => n.isConnected && register(n));
      });
  });
  mo.observe(root, { childList: true, subtree: true });

  // Links and buttons scramble again on hover (short labels only, so paragraphs never flicker).
  let last: Element | null = null;
  const onOver = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const target = (e.target as Element | null)?.closest?.("a, button, [data-scramble-hover]");
    if (!target || target === last) return;
    last = target;
    if (target.closest("[data-no-scramble]")) return;
    const nodes = textNodes(target);
    const total = nodes.reduce((s, n) => s + (n.nodeValue ?? "").length, 0);
    if (total === 0 || total > 48) return;
    nodes.forEach((n) => scrambleNode(n, { duration: 360 }));
  };
  const onOut = (e: PointerEvent) => {
    const to = (e.relatedTarget as Element | null)?.closest?.("a, button, [data-scramble-hover]");
    if (to !== last) last = null;
  };
  root.addEventListener("pointerover", onOver);
  root.addEventListener("pointerout", onOut);

  return () => {
    io.disconnect();
    mo.disconnect();
    if (scheduled) cancelAnimationFrame(scheduled);
    root.removeEventListener("pointerover", onOver);
    root.removeEventListener("pointerout", onOut);
  };
}
