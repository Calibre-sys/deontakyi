import { Fragment, useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * A diagram of the work: what data goes in, which method it goes through, and
 * what came out. Every node and line comes from facts already on the page (the
 * projects, the papers and the collections). Hover or focus a node to trace it.
 */

type MapNode = { id: string; label: string; href?: string };

const INPUTS: MapNode[] = [
  { id: "i-core", label: "Core plugs" },
  { id: "i-field", label: "Field data, GNPC" },
  { id: "i-production", label: "Production history" },
  { id: "i-sheets", label: "Spreadsheets" },
  { id: "i-cvs", label: "CVs" },
  { id: "i-contacts", label: "Contacts and orders" },
];

const METHODS: MapNode[] = [
  { id: "m-cluster", label: "Autoencoders and K-means" },
  { id: "m-regress", label: "Regression with residual correction" },
  { id: "m-causal", label: "VAR, VECM and Granger causality" },
  { id: "m-arima", label: "ARIMA and SARIMA" },
  { id: "m-llm", label: "LLM agents" },
  { id: "m-script", label: "Apps Script" },
];

const OUTPUTS: MapNode[] = [
  { id: "o-hfu", label: "Flow unit paper", href: "#paper-hfu" },
  { id: "o-reschar", label: "RescharAI", href: "#case-reschar" },
  { id: "o-injectors", label: "Water injector paper", href: "#paper-injectors" },
  { id: "o-arima", label: "Oil production forecast", href: "/projects/energy" },
  { id: "o-fortell", label: "Fortell", href: "#case-fortell" },
  { id: "o-recruiter", label: "AI recruitment agent", href: "#case-recruiter" },
  { id: "o-outreach", label: "Outreach automation", href: "#case-outreach" },
  { id: "o-soh", label: "SOH Order Management", href: "#case-soh" },
];

/** Data, method, result. */
const FLOWS: [string, string, string][] = [
  ["i-core", "m-cluster", "o-reschar"],
  ["i-core", "m-cluster", "o-hfu"],
  ["i-field", "m-cluster", "o-reschar"],
  ["i-field", "m-regress", "o-reschar"],
  ["i-production", "m-causal", "o-injectors"],
  ["i-production", "m-arima", "o-arima"],
  ["i-sheets", "m-llm", "o-fortell"],
  ["i-cvs", "m-llm", "o-recruiter"],
  ["i-contacts", "m-script", "o-outreach"],
  ["i-contacts", "m-script", "o-soh"],
];

/*
 * Where each line turns. A line into a method turns in that method's channel;
 * a line out of a method turns in that method's own channel. The fractions are
 * picked so no two lines share a vertical run and none cross.
 */
const TURN_IN: Record<string, number> = { "m-cluster": 0.5, "m-arima": 0.7, "m-llm": 0.3 };
const TURN_OUT: Record<string, number> = { "m-cluster": 0.35, "m-regress": 0.62, "m-causal": 0.5, "m-arima": 0.35, "m-llm": 0.62, "m-script": 0.5 };

const LABEL = new Map([...INPUTS, ...METHODS, ...OUTPUTS].map((n) => [n.id, n.label]));

/** Unique edges, each tagged with the flows it belongs to. */
const EDGES = (() => {
  const seen = new Map<string, { from: string; to: string; flows: number[] }>();
  FLOWS.forEach(([i, m, o], f) => {
    for (const [from, to] of [
      [i, m],
      [m, o],
    ]) {
      const key = `${from}>${to}`;
      const edge = seen.get(key) ?? { from, to, flows: [] };
      edge.flows.push(f);
      seen.set(key, edge);
    }
  });
  return [...seen.values()];
})();

/** Lower-case a label inside a sentence, but keep acronyms (CVs, GNPC). */
const lc = (s: string) => (/^[A-Z]{2,}/.test(s) ? s : s[0].toLowerCase() + s.slice(1));

const list = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** For each result: the data and the methods that feed it, as plain sentences. */
function sourcesOf(outputId: string) {
  const flows = FLOWS.filter(([, , o]) => o === outputId);
  const inputs = [...new Set(flows.map(([i]) => LABEL.get(i)!))];
  const methods = [...new Set(flows.map(([, m]) => LABEL.get(m)!))];
  return { inputs, methods };
}

type Line = { d: string; flows: number[] };

export function WorkMap() {
  const box = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState<string | null>(null);

  const register = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) nodes.current.set(id, el);
      else nodes.current.delete(id);
    },
    [],
  );

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const origin = el.getBoundingClientRect();
      setSize({ w: origin.width, h: origin.height });
      const at = (id: string) => {
        const r = nodes.current.get(id)?.getBoundingClientRect();
        return r ? { l: r.left - origin.left, r: r.right - origin.left, y: r.top - origin.top + r.height / 2 } : null;
      };
      const next: Line[] = [];
      for (const edge of EDGES) {
        const a = at(edge.from);
        const b = at(edge.to);
        if (!a || !b) continue;
        const x1 = a.r + 12;
        const x2 = b.l - 12;
        const turn = edge.from.startsWith("i-") ? (TURN_IN[edge.to] ?? 0.5) : (TURN_OUT[edge.from] ?? 0.5);
        const xm = Math.round(x1 + (x2 - x1) * turn);
        next.push({ d: `M${x1} ${a.y}H${xm}V${b.y}H${x2}`, flows: edge.flows });
      }
      setLines(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, []);

  const lit = new Set(active ? FLOWS.flatMap((flow, f) => (flow.includes(active) ? [f] : [])) : []);
  const onPath = (id: string) => !active || FLOWS.some((flow, f) => lit.has(f) && flow.includes(id));
  const hover = (id: string) => ({
    onPointerEnter: () => setActive(id),
    onPointerLeave: () => setActive(null),
    onFocus: () => setActive(id),
    onBlur: () => setActive(null),
  });

  return (
    <figure className="surface overflow-hidden">
      {/* The diagram, from 64rem up */}
      <div ref={box} className="relative hidden px-10 py-12 lg:block xl:px-14">
        <svg aria-hidden className="pointer-events-none absolute inset-0" width={size.w} height={size.h}>
          {lines.map((line, i) => {
            const on = line.flows.some((f) => lit.has(f));
            return (
              <path
                key={i}
                d={line.d}
                fill="none"
                strokeLinejoin="miter"
                strokeWidth={on ? 2 : 1}
                className={cn("transition-colors duration-150", on ? "stroke-accent" : active ? "stroke-border" : "stroke-border-strong")}
              />
            );
          })}
        </svg>

        <div className="relative grid grid-cols-[1fr_1.15fr_1fr] gap-x-28 xl:gap-x-36">
          <p className="kicker mb-8 pr-[14px] text-right">Data</p>
          <p className="kicker mb-8 text-center">Method</p>
          <p className="kicker mb-8">What came out</p>

          <ul className="flex flex-col justify-around gap-6">
            {INPUTS.map((n) => (
              <li key={n.id} className="flex justify-end">
                <span
                  ref={register(n.id)}
                  tabIndex={0}
                  {...hover(n.id)}
                  className={cn(
                    "border-r-2 border-border-strong py-1 pr-3 text-right text-[1.0625rem] font-medium text-foreground outline-offset-4 transition-opacity duration-150",
                    !onPath(n.id) && "opacity-40",
                  )}
                >
                  {n.label}
                </span>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col justify-around gap-6">
            {METHODS.map((n) => (
              <li key={n.id} className="flex justify-center">
                <span
                  ref={register(n.id)}
                  tabIndex={0}
                  {...hover(n.id)}
                  className={cn(
                    "rounded-lg border border-border bg-background px-4 py-2 text-center text-[1rem] leading-snug text-ink-2 outline-offset-4 transition-opacity duration-150",
                    !onPath(n.id) && "opacity-40",
                  )}
                >
                  {n.label}
                </span>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col justify-around gap-4">
            {OUTPUTS.map((n) => {
              const { inputs, methods } = sourcesOf(n.id);
              return (
                <li key={n.id} className="flex">
                  <a
                    ref={register(n.id)}
                    href={n.href}
                    {...hover(n.id)}
                    className={cn(
                      "link border-l-2 border-border-strong py-1 pl-3 font-display text-[1.1875rem] font-semibold tracking-[-0.015em] no-underline transition-opacity duration-150 hover:underline",
                      !onPath(n.id) && "opacity-40",
                    )}
                  >
                    {n.label}
                    <span className="sr-only">
                      , from {list(inputs.map(lc))}, by {list(methods)}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* The same facts as a list, below 64rem */}
      <ol className="divide-y divide-border px-5 py-2 sm:px-8 lg:hidden">
        {OUTPUTS.map((n) => {
          const { inputs, methods } = sourcesOf(n.id);
          return (
            <li key={n.id} className="py-5">
              <a href={n.href} className="link font-display text-[1.1875rem] font-semibold tracking-[-0.015em]">
                {n.label}
              </a>
              <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">
                From {list(inputs.map(lc))}.
                <br />
                {methods.map((m, i) => (
                  <Fragment key={m}>
                    {i === 0 ? "By " : i === methods.length - 1 ? " and " : ", "}
                    {m}
                  </Fragment>
                ))}
                .
              </p>
            </li>
          );
        })}
      </ol>
      <figcaption className="border-t border-border px-5 py-4 text-[0.875rem] font-medium text-muted-foreground sm:px-8 lg:px-10 xl:px-14">
        Each line runs from the data, through the method, to what was built.
      </figcaption>
    </figure>
  );
}
